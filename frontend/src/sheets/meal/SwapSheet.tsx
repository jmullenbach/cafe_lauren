import { useEffect, useMemo, useState } from 'react';
import { Sheet } from '../../components/feedback/Sheet';
import { Button } from '../../components/core/Button';
import { Icon } from '../../components/core/Icon';
import { Badge } from '../../components/display/Badge';
import { Card } from '../../components/display/Card';
import { ChoiceChips } from '../../components/forms/ChoiceChips';
import { Input } from '../../components/forms/Input';
import { JobState } from '../../components/feedback/JobState';
import { ListRow } from '../../components/layout/Layout';
import { useQueue, useRecipes, useSwapOptions, useSwapSlot } from '../../api/hooks';
import { useJobStatus } from '../../api/jobs';
import { useUi } from '../../state/UiContext';
import { useWeekData } from '../../state/useWeekSlots';
import { DAYNAME, SWAP_PREFS, metaLine, shortDate } from '../../lib/meal';
import { caption, useSlotFor } from './shared';

/** One option from a swap_options job (services/planner.py swap_option_rows): a stored recipe, possibly a draft. */
interface Opt { recipe_id: number; title: string; method?: string | null; total_min?: number | null; cost_usd?: number | null; why?: string[]; ingredient_flags?: Record<string, { have?: boolean; sale?: string | null }> }

function parseOptions(result: unknown): Opt[] {
  const r = result as { options?: Opt[] } | null | undefined;
  return Array.isArray(r?.options) ? r!.options! : [];
}

function OptionCard({ title, meta, sale, basis, why, onUse, busy }: { title: string; meta: string; sale: boolean; basis: string; why?: string; onUse: () => void; busy: boolean }) {
  return (
    <div data-testid="swap-option" style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 14, borderRadius: 'var(--radius-m)', background: 'var(--surface-card)', border: '1px dashed var(--sage-300)' }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <span style={{ flex: 1, font: '400 18px/1.2 var(--font-serif)', color: 'var(--text-strong)' }}>{title}</span>
        {sale && <Badge tone="sale" icon="tag">Sale</Badge>}
      </div>
      {meta && <span style={{ font: '500 12.5px/1 var(--font-sans)', color: 'var(--text-muted)' }}>{meta}</span>}
      {(why || basis) && <span style={{ display: 'flex', gap: 6, font: '400 13px/1.4 var(--font-sans)', color: 'var(--sage-900)' }}><Icon name="sparkles" size={13} style={{ color: 'var(--sage-600)', marginTop: 3 }} />{basis ? `${basis}: ` : ''}{why}</span>}
      <Button size="s" variant="secondary" icon="check" disabled={busy} onClick={onUse} style={{ alignSelf: 'flex-start' }}>Use this</Button>
    </div>
  );
}

export function SwapSheet({ open, slotId }: { open: boolean; slotId?: unknown }) {
  const { closeSheet, toast } = useUi();
  const { slots } = useWeekData();
  const slot = useSlotFor(slotId);
  const [prefs, setPrefs] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [asks, setAsks] = useState(0);
  const [jobId, setJobId] = useState<number | null>(null);
  const options = useSwapOptions();
  const swap = useSwapSlot();
  const job = useJobStatus(jobId);
  const { data: queue } = useQueue();
  const { data: box } = useRecipes({ status: 'saved', sort: 'stars' });

  useEffect(() => { if (open) { setPrefs([]); setNote(''); setAsks(0); setJobId(null); } }, [open, slotId]);
  // Ask Café for options when the sheet opens, and again (debounced) when the preferences change or "Ask" is tapped.
  const prefKey = prefs.join('|');
  const sid = slot?.id;
  useEffect(() => {
    if (!open || sid == null) return;
    const t = setTimeout(() => options.mutate({ id: sid, prefs, text: note.trim() || null }, { onSuccess: (r) => setJobId(r.job.id) }), asks === 0 ? 0 : 450);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, sid, prefKey, asks]);

  const used = useMemo(() => new Set(slots.map((s) => s.recipe_id).filter((x): x is number => x != null)), [slots]);
  if (!slot) return <Sheet open={false} />;
  const cur = slot.recipe;
  const basis = [...prefs, note.trim()].filter(Boolean).join(' · ');
  const running = job && (job.status === 'queued' || job.status === 'running');
  const opts = job?.status === 'done' ? parseOptions(job.result).slice(0, 3) : [];

  const done = (msg?: string) => { closeSheet(); toast({ icon: 'refresh-cw', title: msg ?? 'Swapped', message: 'Votes reset so everyone can weigh in.' }); };
  const useRecipe = (recipe_id: number, b: string) => swap.mutate({ id: slot.id, kind: 'recipe', recipe_id, basis: b || null }, { onSuccess: () => done() });
  const makeIt = (kind: 'leftover' | 'leidy' | 'text', text: string, icon: string) => swap.mutate({ id: slot.id, kind, text, cook: kind === 'leidy' ? 'leidy' : undefined }, { onSuccess: () => { closeSheet(); toast({ icon, title: `${DAYNAME[slot.day]}: ${text}` }); } });
  const next = (queue ?? []).filter((q) => !used.has(q.recipe.id));
  const fromBox = (box ?? []).filter((r) => !used.has(r.id) && !next.some((q) => q.recipe.id === r.id)).slice(0, 3);

  return (
    <Sheet open={open} onClose={closeSheet} title={`Swap ${DAYNAME[slot.day]}`} subtitle={cur ? `Instead of ${cur.title}` : 'Pick something for this night'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <ChoiceChips size="s" value={prefs} onChange={setPrefs} options={SWAP_PREFS} />
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <Input style={{ flex: 1, minWidth: 0 }} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Or say it: “use the freezer meatballs”" />
          <Button variant="secondary" icon="sparkles" onClick={() => setAsks((n) => n + 1)} disabled={!note.trim()}>Ask</Button>
        </div>
        <span style={{ ...caption, marginTop: 4 }}>Café's options</span>
        {(running || (jobId == null && !options.isError))
          ? <div data-testid="swap-thinking" style={{ padding: 16, borderRadius: 'var(--radius-m)', background: 'var(--sage-50)', font: '500 14px/1.4 var(--font-sans)', color: 'var(--sage-700)', display: 'flex', gap: 8, alignItems: 'center' }}><Icon name="sparkles" size={16} />Looking at deals and the pantry…</div>
          : <>
              <JobState jobId={jobId} />
              {job?.status === 'done' && opts.length === 0 && <span style={{ font: '400 13px/1.4 var(--font-sans)', color: 'var(--text-muted)' }}>Café had no new ideas. Try the recipe box below.</span>}
              {opts.map((o) => (
                <OptionCard key={o.recipe_id} title={o.title} meta={metaLine(o)} sale={Object.values(o.ingredient_flags ?? {}).some((x) => x.sale)} basis={basis} why={o.why?.[0]} busy={swap.isPending}
                  onUse={() => useRecipe(o.recipe_id, basis)} />
              ))}
            </>}
        {next.length > 0 && <><span style={{ ...caption, marginTop: 8 }}>Up next</span>
          <Card padding="none" style={{ padding: '0 14px' }}>{next.map((q, i) => <ListRow key={q.id} icon="list" iconColor="var(--sage-700)" title={q.recipe.title} sub={`Queued by ${q.by[0].toUpperCase() + q.by.slice(1)}`} onClick={() => useRecipe(q.recipe.id, 'From Up next')} last={i === next.length - 1} />)}</Card></>}
        {fromBox.length > 0 && <><span style={{ ...caption, marginTop: 8 }}>From the recipe box</span>
          <Card padding="none" style={{ padding: '0 14px' }}>{fromBox.map((r, i) => <ListRow key={r.id} title={r.title} sub={`${[r.method, r.total_min ? `${r.total_min} min` : ''].filter(Boolean).join(' · ')} · last made ${shortDate(r.last_made)}`} onClick={() => useRecipe(r.id, 'Picked from the recipe box')} last={i === fromBox.length - 1} />)}</Card></>}
        <span style={{ ...caption, marginTop: 8 }}>Or make it</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Button size="s" variant="secondary" icon="refresh-cw" onClick={() => makeIt('leftover', 'Leftovers night', 'refresh-cw')}>Leftovers night</Button>
          <Button size="s" variant="secondary" icon="chef-hat" onClick={() => makeIt('leidy', 'Leidy cooks', 'chef-hat')}>Leidy cooks</Button>
          <Button size="s" variant="secondary" icon="utensils" onClick={() => makeIt('text', 'Eating out', 'utensils')}>Eating out</Button>
        </div>
      </div>
    </Sheet>
  );
}
