import type { Recipe, Slot } from '../../api/models';
import { Icon } from '../../components/core/Icon';
import { VoteButtons } from '../../components/kitchen/VoteButtons';
import { JobState } from '../../components/feedback/JobState';
import { useVoteSlot } from '../../api/hooks';
import { useJobPoll } from '../../api/extra';
import { useJobStatus } from '../../api/jobs';
import { useWeekData } from '../../state/useWeekSlots';
import '../../styles/screens-a.css';

export function Meta({ method, time, cost }: { method?: string | null; time?: string; cost?: string }) {
  const items = ([['cooking-pot', method], ['clock', time], ['receipt', cost]] as const).filter(([, t]) => t);
  return <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px' }}>{items.map(([i, t]) => <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, font: '500 12.5px/1 var(--font-sans)', color: 'var(--text-body)' }}><Icon name={i} size={14} style={{ color: 'var(--text-muted)' }} />{t}</span>)}</div>;
}

export function Votes({ slot }: { slot: Slot }) {
  const { me, personOf } = useWeekData();
  const vote = useVoteSlot();
  const v = slot.votes ?? {};
  const vals = Object.values(v);
  const voters = Object.keys(v).map((k) => personOf(k)).filter(<T,>(x: T | undefined): x is T => !!x).map((p) => ({ name: p.name, color: p.color as never }));
  return <VoteButtons value={me ? v[me.key] ?? null : null} onChange={(x) => vote.mutate({ id: slot.id, value: x })} up={vals.filter((x) => x === 'up').length} down={vals.filter((x) => x === 'down').length} voters={voters} />;
}

/** The "finding something else" state while a replacement is being found. */
export function Thinking({ slot }: { slot: Slot }) {
  useJobPoll(slot.job_id);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '6px 0' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, font: '500 14px/1.4 var(--font-sans)', color: 'var(--sage-700)' }}><Icon name="sparkles" size={16} />Finding something else…</span>
      {slot.basis && <span style={{ font: '400 13px/1.4 var(--font-sans)', color: 'var(--text-muted)' }}>Working from: “{slot.basis}”</span>}
      {[80, 60].map((w) => <span key={w} className="clm-skeleton" style={{ height: 10, width: w + '%', borderRadius: 3, background: 'var(--linen-200)' }} />)}
      <JobState jobId={slot.job_id} thinking="Looking at deals and the pantry…" />
    </div>
  );
}

/** True while Café still owes this recipe its ingredients and steps (an older server sends no detail_status). */
export const isWriting = (r?: Pick<Recipe, 'detail_status'> | null): boolean => r?.detail_status === 'pending' || r?.detail_status === 'failed';

/**
 * A picked idea whose ingredients and steps Café is still writing (recipe.detail_status pending), or
 * could not write (failed: Retry through the job). Polls the fill job as a backstop to the stream.
 */
export function RecipeWriting({ recipe, jobId }: { recipe?: Pick<Recipe, 'detail_status'> | null; jobId?: number | null }) {
  const pending = isWriting(recipe);
  useJobPoll(pending ? jobId : null);
  const job = useJobStatus(pending ? jobId : null);
  if (!pending || !recipe) return null;
  if (job && (job.status === 'failed' || job.status === 'resting')) return <JobState jobId={jobId} />;
  if (recipe.detail_status === 'failed') {
    return <span data-testid="recipe-writing" data-status="failed" style={{ font: '400 13px/1.4 var(--font-sans)', color: 'var(--text-muted)' }}>Café couldn't write this recipe. Swap it or try again later.</span>;
  }
  return (
    <span role="status" data-testid="recipe-writing" data-status="pending" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, font: '500 13px/1.4 var(--font-sans)', color: 'var(--sage-700)' }}>
      <Icon name="sparkles" size={14} />Café is writing the recipe…
    </span>
  );
}
