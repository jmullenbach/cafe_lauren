// Minimal hand-written types used until the shared contract in ./types.ts is adopted.
export type JobStatus = 'queued' | 'running' | 'done' | 'failed' | 'resting';
export interface JobEvent {
  id: number | string;
  type?: string;
  status: JobStatus;
  error?: string | null;
  result?: unknown;
}
