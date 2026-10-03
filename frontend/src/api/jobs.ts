import type { QueryClient } from '@tanstack/react-query';
import type { JobEvent } from './localTypes';
import { BASE_URL } from './client';

const FINISHED = new Set(['done', 'failed', 'resting']);
type Listener = (running: JobEvent[]) => void;

const running = new Map<string, JobEvent>();
const listeners = new Set<Listener>();
const emit = () => { const list = [...running.values()]; listeners.forEach((l) => l(list)); };

/** Subscribe to the set of jobs currently queued or running (for "Café is thinking" states). */
export function subscribeRunningJobs(l: Listener): () => void {
  listeners.add(l);
  l([...running.values()]);
  return () => { listeners.delete(l); };
}

/**
 * Open the server-sent event stream at /api/jobs/stream. When a job finishes (done, failed or resting),
 * every query is invalidated so screens refetch. Tolerates the backend being down: EventSource retries
 * on its own, and any parse or network error is swallowed.
 */
export function startJobStream(qc: QueryClient): () => void {
  if (typeof EventSource === 'undefined') return () => {};
  let es: EventSource | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let stopped = false;

  const onMessage = (ev: MessageEvent) => {
    try {
      const job = JSON.parse(ev.data) as JobEvent;
      if (job == null || job.status == null) return;
      const id = String(job.id);
      if (FINISHED.has(job.status)) {
        running.delete(id);
        qc.invalidateQueries();
      } else {
        running.set(id, job);
      }
      emit();
    } catch { /* ignore malformed events and heartbeats */ }
  };

  const connect = () => {
    if (stopped) return;
    try {
      es = new EventSource(`${BASE_URL}/api/jobs/stream`);
    } catch {
      timer = setTimeout(connect, 10_000);
      return;
    }
    es.onmessage = onMessage;
    // Named events (e.g. "job") carry the same payload.
    es.addEventListener('job', onMessage as EventListener);
    es.onerror = () => {
      // While the connection is merely dropped the browser retries by itself. A hard failure
      // (backend down, proxy 5xx) closes it, so reopen after a pause.
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
