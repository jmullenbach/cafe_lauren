import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { useJobStatus } from '../../api/jobs';
import { useRetryJob } from '../../api/hooks';
import { useUi } from '../../state/UiContext';
import { Button } from '../core/Button';
import { Icon } from '../core/Icon';

export const RESTING_MESSAGE = 'Café is resting. Try again later.';

interface Props {
  jobId: number | null | undefined;
  /** Shown while queued or running. */
  thinking?: ReactNode;
}

/**
 * Inline status for one background job: a thinking line while it runs, the resting banner when the
 * subscription limit is hit, and a failure message with a Retry button.
 */
export function JobState({ jobId, thinking = 'Café is thinking…' }: Props) {
  const job = useJobStatus(jobId);
  const retry = useRetryJob();
  const { toast } = useUi();
  const toasted = useRef<string>('');

  useEffect(() => {
    if (job?.status === 'resting' && toasted.current !== `${job.id}`) {
      toasted.current = `${job.id}`;
      toast({ tone: 'warning', icon: 'clock', title: RESTING_MESSAGE });
    }
  }, [job?.id, job?.status, toast]);

  if (!job || job.status === 'done' || job.status === 'cancelled') return null;
  const box = { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 'var(--radius-m)', font: '500 14px/1.4 var(--font-sans)' } as const;

  if (job.status === 'queued' || job.status === 'running') {
    return <div role="status" data-testid="job-state" data-status={job.status} style={{ ...box, background: 'var(--linen-100)', color: 'var(--text-default)' }}><Icon name="sparkles" size={16} />{thinking}</div>;
  }
  const resting = job.status === 'resting';
  return (
    <div role="alert" data-testid="job-state" data-status={job.status} style={{ ...box, background: resting ? 'var(--honey-100)' : 'var(--tomato-100)', color: 'var(--text-strong)' }}>
      <Icon name={resting ? 'clock' : 'triangle-alert'} size={16} />
      <span style={{ flex: 1 }}>{resting ? RESTING_MESSAGE : job.error || 'That did not work.'}</span>
      <Button size="s" variant="secondary" icon="refresh-cw" disabled={retry.isPending} onClick={() => retry.mutate(job.id)}>Retry</Button>
    </div>
  );
}
