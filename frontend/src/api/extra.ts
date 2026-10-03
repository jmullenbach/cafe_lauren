import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError, post } from './client';
import { getJob } from './endpoints';
import { FINISHED, handleJob } from './jobs';
import { readUser } from '../lib/storage';

/** Ordering and export endpoints that are not in the generated client yet. */
export interface InstacartLink { url: string; cached: boolean; item_count: number }

export const createInstacartLink = (monday: string) => post<InstacartLink>(`/api/weeks/${encodeURIComponent(monday)}/instacart-link`);

/** True when an error is the "no Instacart key" 409. */
export function isInstacartNotConfigured(e: unknown): boolean {
  if (!(e instanceof ApiError) || e.status !== 409) return false;
  const d = (e.body as { detail?: unknown } | null)?.detail;
  return typeof d === 'object' && d !== null && (d as { code?: string }).code === 'instacart_not_configured';
}

export const useInstacartLink = () => useMutation({ mutationFn: createInstacartLink });

/** Open a URL in a new tab; fall back to navigating when the popup is blocked (iOS after an await). */
export function openExternal(url: string): void {
  const w = window.open(url, '_blank', 'noopener');
  if (!w) window.location.href = url;
}

/**
 * Download an export. The export routes need the X-Cafe-User header, which a plain link cannot send,
 * so fetch the file and hand the browser a blob URL.
 */
export async function downloadExport(path: string, fallbackName: string): Promise<void> {
  const user = readUser();
  const res = await fetch(path, { headers: user ? { 'X-Cafe-User': user } : {} });
  if (!res.ok) throw new Error(`Export failed (${res.status})`);
  const blob = await res.blob();
  const cd = res.headers.get('content-disposition') || '';
  const name = /filename="?([^";]+)"?/i.exec(cd)?.[1] || fallbackName;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/** Backstop for the job stream: poll a job every 2s until it finishes, feeding results into the shared job state. */
export function useJobPoll(jobId: number | null | undefined): void {
  const qc = useQueryClient();
  useEffect(() => {
    if (jobId == null) return;
    let stop = false;
    const tick = async () => {
      try {
        const j = await getJob(jobId);
        handleJob(qc, j);
        if (FINISHED.has(j.status)) return;
      } catch { /* try again */ }
      if (!stop) timer = setTimeout(tick, 2000);
    };
    let timer = setTimeout(tick, 2000);
    return () => { stop = true; clearTimeout(timer); };
  }, [jobId, qc]);
}
