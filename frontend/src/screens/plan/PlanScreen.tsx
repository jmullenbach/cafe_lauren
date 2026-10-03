import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Slot } from '../../api/models';
import { Button } from '../../components/core/Button';
import { IconButton } from '../../components/core/IconButton';
import { Icon } from '../../components/core/Icon';
import { Card } from '../../components/display/Card';
import { DayTag } from '../../components/display/DayTag';
import { SuggestedTag } from '../../components/kitchen/SuggestedTag';
import { ReviewActions } from '../../components/kitchen/ReviewActions';
import { JobState } from '../../components/feedback/JobState';
import { Screen, LargeTitle, SectionHead, ListRow } from '../../components/layout/Layout';
import { useApproveWeek, useKeepSlot, usePlanWeek, useQueue, useRemoveFromQueue } from '../../api/hooks';
import { useRunningJobs } from '../../api/jobs';
import { useUi } from '../../state/UiContext';
import { useWeekData } from '../../state/useWeekSlots';
import { costStr, dayKey, mealRoute, slotTitle, timeStr } from '../../lib/meal';
import { Meta, RecipeWriting, Thinking, Votes } from './parts';
import '../../styles/screens-a.css';

function SlotCard({ s }: { s: Slot }) {
  const { openSheet, toast } = useUi();
  const nav = useNavigate();
  const keep = useKeepSlot();
  const { nameOf } = useWeekData();
  if (s.kind !== 'cook' || !s.recipe) {
    const open = s.kind === 'open';
    return (
      <div data-testid={`slot-${s.day}`} data-kind={s.kind} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 'var(--radius-card)', background: open ? 'transparent' : 'var(--surface-sunken)', border: open ? '1.5px dashed var(--border-strong)' : '1px solid transparent' }}>
        <DayTag day={dayKey(s.day)} short style={{ width: 44, justifyContent: 'center' }} />
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{ font: 'italic 400 15px/1.3 var(--font-serif)', color: open ? 'var(--text-strong)' : 'var(--text-body)' }}>{slotTitle(s)}</span>
          {open && s.basis && <span style={{ font: '400 12px/1.3 var(--font-sans)', color: 'var(--text-muted)' }}>Not this week: {s.basis}</span>}
          {s.kind === 'leidy' && !s.recipe && <span style={{ font: '400 12px/1.3 var(--font-sans)', color: 'var(--text-muted)' }}>Waiting on what she's making</span>}
        </div>
        <Button size="s" variant={open ? 'primary' : 'ghost'} onClick={() => openSheet({ type: open ? 'swap' : 'edit', slotId: s.id })}>{open ? 'Pick a meal' : 'Change'}</Button>
      </div>
    );
  }
  const m = s.recipe;
  const review = s.status === 'suggested';
  const thinking = s.status === 'thinking';
  const why = (s.why ?? []).slice(0, 2).join(' · ');
  return (
    <Card padding="none" selected={review} style={review ? { borderStyle: 'dashed', borderColor: 'var(--sage-300)', boxShadow: 'none' } : undefined}>
      <div data-testid={`slot-${s.day}`} data-kind="cook" data-status={s.status ?? ''} style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <DayTag day={dayKey(s.day)} />
          <SuggestedTag status={s.status ?? 'suggested'} by={s.status === 'suggested' ? undefined : nameOf(s.by)} />
          <span style={{ flex: 1 }} />
          {!review && !thinking && <IconButton icon="ellipsis" label="Change" size="s" onClick={() => openSheet({ type: 'edit', slotId: s.id })} />}
        </div>
        {thinking ? <Thinking slot={s} /> : <>
          <div onClick={() => nav(mealRoute(s))} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <h3 style={{ font: '400 20px/1.2 var(--font-serif)', color: 'var(--text-strong)' }}>{m.title}</h3>
            <p style={{ font: 'italic 400 14px/1.4 var(--font-serif)', color: 'var(--text-body)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{m.description}</p>
          </div>
          <Meta method={m.method} time={timeStr(m)} cost={costStr(m)} />
          <RecipeWriting recipe={m} jobId={s.job_id} />
          {(review || s.basis) && (why || s.basis) && <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', font: '400 13px/1.4 var(--font-sans)', color: 'var(--sage-900)' }}><Icon name="sparkles" size={14} style={{ color: 'var(--sage-600)', marginTop: 2 }} /><span>{s.basis ? `For “${s.basis}”: ` : ''}{why}</span></div>}
          <div style={{ paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
            {review
              ? <ReviewActions size="s" onReject={() => openSheet({ type: 'reject', slotId: s.id })} onSwap={() => openSheet({ type: 'swap', slotId: s.id })}
                  onApprove={() => keep.mutate(s.id, { onSuccess: () => toast({ tone: 'success', icon: 'check', title: 'Kept', message: 'Others can still vote or swap it.' }) })} />
              : <Votes slot={s} />}
          </div>
        </>}
      </div>
    </Card>
  );
}

function ApproveBar() {
  const { week, slots, monday, nameOf } = useWeekData();
  const approve = useApproveWeek();
  const { toast } = useUi();
  const pend = slots.filter((s) => s.kind === 'cook' && s.status === 'suggested').length;
  if (week?.approved_by) return (
    <div data-testid="approved-note" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 'var(--radius-m)', background: 'var(--sage-50)', marginBottom: 16 }}>
      <Icon name="circle-check" size={20} style={{ color: 'var(--sage-600)' }} />
      <span style={{ flex: 1, font: '400 13px/1.4 var(--font-sans)', color: 'var(--sage-900)' }}><b>Approved by {nameOf(week.approved_by)}.</b> Swaps are still welcome; the list updates with them.</span>
    </div>
  );
  return (
    <div style={{ position: 'sticky', bottom: -8, zIndex: 4, margin: '20px -20px 0', padding: '12px 20px 14px', background: 'var(--glass-bg)', backdropFilter: 'var(--blur-glass)', WebkitBackdropFilter: 'var(--blur-glass)', borderTop: '1px solid var(--border-subtle)' }}>
      <Button size="l" variant="accent" fullWidth icon="circle-check" disabled={!monday || approve.isPending}
        onClick={() => monday && approve.mutate(monday, { onSuccess: () => toast({ tone: 'success', icon: 'circle-check', title: 'Week approved', message: 'The grocery list is ready. You can still swap anything.' }) })}>
        {pend ? `Keep the other ${pend} and approve` : 'Approve the week'}
      </Button>
    </div>
  );
}

function UpNext() {
  const { data: queue } = useQueue();
  const remove = useRemoveFromQueue();
  const { openSheet } = useUi();
  const nav = useNavigate();
  const { nameOf } = useWeekData();
  if (!queue?.length) return null;
  return (<>
    <SectionHead title="Up next" aside="Recipe box" onAside={() => nav('/recipes')} />
    <p style={{ font: '400 13px/1.45 var(--font-sans)', color: 'var(--text-muted)', margin: '-4px 0 10px' }}>Meals the house wants soon. Café plans from these first; tap one to put it on a night.</p>
    <Card padding="none" style={{ padding: '0 14px' }}>{queue.map((q, i) => (
      <ListRow key={q.id} icon="list" iconColor="var(--sage-700)" title={q.recipe.title} sub={`Added by ${nameOf(q.by)}`} onClick={() => openSheet({ type: 'schedule', recipeId: q.recipe.id })} last={i === queue.length - 1}
        right={<IconButton icon="x" label="Remove" size="s" onClick={(e) => { (e as unknown as MouseEvent).stopPropagation?.(); remove.mutate(q.recipe.id); }} />} />
    ))}</Card>
  </>);
}

export function PlanScreen() {
  const { openSheet } = useUi();
  const { week, slots, monday, loading } = useWeekData();
  const plan = usePlanWeek();
  const [planJob, setPlanJob] = useState<number | null>(null);
  const planning = useRunningJobs('plan_week').length > 0;
  const cook = slots.filter((s) => s.kind === 'cook');
  const pend = cook.filter((s) => s.status === 'suggested').length;
  const empty = !loading && cook.length === 0;
  const store = week?.store?.name;
  const sub = empty ? 'Nothing is planned yet. Café can suggest a week around the deals, the pantry and what the house asked for.'
    : pend ? `Café suggested meals around this week's ${store ?? 'store'} deals. ${pend} still need someone to keep, swap, or turn down.`
    : 'Every meal has been looked at by someone in the house.';
  return (
    <Screen>
      <LargeTitle overline={week?.label} title="The plan" sub={loading ? undefined : sub} right={<IconButton icon="sparkles" label="Ask Café" onClick={() => openSheet({ type: 'chat' })} />} />
      {week?.approved_by && <ApproveBar />}
      {(planning || planJob != null) && <div style={{ marginBottom: 12 }}><JobState jobId={planJob ?? undefined} thinking="Café is planning the week…" /></div>}
      {empty && !planning && (
        <Card tone="accent" padding="m" style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={{ font: '400 20px/1.2 var(--font-serif)', color: 'var(--text-strong)' }}>Plan the week</span>
            <Button icon="sparkles" disabled={!monday || plan.isPending} onClick={() => monday && plan.mutate({ monday }, { onSuccess: (r) => setPlanJob(r.job.id) })}>Suggest a week</Button>
          </div>
        </Card>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{slots.map((s) => <SlotCard key={s.id} s={s} />)}</div>
      <UpNext />
      {!week?.approved_by && !empty && <ApproveBar />}
    </Screen>
  );
}
