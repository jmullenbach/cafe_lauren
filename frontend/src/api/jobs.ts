import { useSyncExternalStore } from 'react';
import type { QueryClient } from '@tanstack/react-query';
import type { Job } from './models';
import { BASE_URL } from './client';
import { keys } from './keys';
import { useAppState } from './hooks';

export const FINISHED = new Set(['done', 'failed', 'resting']);

/** Latest known version of every job seen on the stream this session. */
const jobs = new Map<number, Job>();
const listeners = new Set<() => void>();
let snapshot: Job[] = [];
const emit = () => { snapshot = [...jobs.values()]; listeners.forEach((l) => l()); };
const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };
const getSnapshot = () => snapshot;

/** Record a job (from the stream, a mutation response or a retry) so every screen sees its state. */
export function noteJob(job: Job | null | undefined): void {
  if (!job || job.id == null) return;
  jobs.set(job.id, job);
  emit();
}

/** Which queries a finished job makes stale, by job type. */
export function invalidateForJob(qc: QueryClient, job: Job): void {
  const inv = (queryKey: readonly unknown[]) => qc.invalidateQueries({ queryKey });
  switch (job.type) {
    case 'plan_week': case 'swap_options': case 'replacement':
      inv(keys.weeks); inv(keys.state); break;
    case 'pantry_read':
      inv(keys.pantry); inv(keys.state); break;
    case 'ads_refresh': case 'ads_read':
      inv(keys.dealsAll); inv(keys.stores); break;
    case 'recipe_draft':
      inv(keys.recipesAll); break;
    case 'chat':
      inv(keys.chatAll); break;
    default:
      inv(keys.state);
  }
}

/** Called for every job event, whatever its source. */
export function handleJob(qc: QueryClient, job: Job): void {
  const prev = jobs.get(job.id);
  noteJob(job);
  qc.setQueryData(keys.job(job.id), job);
  if (FINISHED.has(job.status) && prev?.status !== job.status) invalidateForJob(qc, job);
}

/**
 * Open the server-sent event stream. EventSource cannot set headers, so the user goes in `?user=`.
 * Events are `event: job` with a Job as data. Reconnects after a hard failure.
 */
export function startJobStream(qc: QueryClient, user: string): () => void {
  if (typeof EventSource === 'undefined') return () => {};
  let es: EventSource | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let stopped = false;

  const onJob = (ev: MessageEvent) => {
    try {
      const job = JSON.parse(ev.data) as Job;
      if (job == null || job.status == null || job.id == null) return;
      handleJob(qc, job);
    } catch { /* ignore malformed events */ }
  };
  const connect = () => {
    if (stopped) return;
    es = new EventSource(`${BASE_URL}/api/jobs/stream?user=${encodeURIComponent(user)}`);
    es.addEventListener('job', onJob as EventListener);
    es.onerror = () => {
      if (es && es.readyState === EventSource.CLOSED) {
        es.close();
        es = null;
        if (!stopped) timer = setTimeout(connect, 10_000);
      }
    };
  };
  connect();
  return () => { stopped = true; clearTimeout(timer); es?.close(); es = null; };
}

/** Latest state of one job: from the stream, falling back to any copy in the app state. */
export function useJobStatus(jobId: number | null | undefined): Job | undefined {
  const all = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const { data } = useAppState();
  if (jobId == null) return undefined;
  return all.find((j) => j.id === jobId) ?? data?.jobs.find((j) => j.id === jobId);
}

/** Jobs that are queued or running right now. */
export function useRunningJobs(type?: string | string[]): Job[] {
  const all = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const { data } = useAppState();
  const merged = new Map<number, Job>();
  for (const j of data?.jobs ?? []) merged.set(j.id, j);
  for (const j of all) merged.set(j.id, j);
  const types = type === undefined ? null : Array.isArray(type) ? type : [type];
  return [...merged.values()].filter((j) => !FINISHED.has(j.status) && (!types || types.includes(j.type)));
}
