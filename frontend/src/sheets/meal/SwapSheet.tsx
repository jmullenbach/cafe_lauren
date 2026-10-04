import { useEffect, useMemo, useRef, useState } from 'react';
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
import { useJobPoll } from '../../api/extra';
import { useUi } from '../../state/UiContext';
import { useWeekData } from '../../state/useWeekSlots';
import type { RecipeSummary } from '../../api/models';
import { DAYNAME, EXTRA, STAPLES_TAG, SWAP_PREFS, metaLine, shortDate } from '../../lib/meal';
import { caption, useSlotFor } from './shared';
import '../../styles/screens-a.css';

/**
 * One option from a swap_options job (services/planner.py swap_option_rows): a stored recipe, possibly a draft.
 * A new idea has detail_status "pending": Café writes its full recipe only after it is picked.
 */
interface Opt { recipe_id: number; title: string; method?: string | null; total_min?: number | null; cost_usd?: number | null; detail_status?: string; why?: string[]; ingredient_flags?: Record<string, { have?: boolean; sale?: string | null }> }

/** What an ask said (its chips and text), for "Quicker · no fish: ..." on the options it produced. */
function askBasis(payload: unknown): string {
  const p = (payload ?? {}) as { prefs?: string[]; text?: string | null };
  return [...(p.prefs ?? []), (p.text ?? '').trim()].filter(Boolean).join(' · ');
}

function parseOptions(result: unknown): Opt[] {
  const r = result as { options?: Opt[] } | null | undefined;
  return Array.isArray(r?.options) ? r!.options! : [];
}

function OptionCard({ title, meta, sale, isNew, basis, why, onUse, busy }: { title: string; meta: string; sale: boolean; isNew: boolean; basis: string; why?: string; onUse: () => void; busy: boolean }) {
  return (
    <div data-testid="swap-option" style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 14, borderRadius: 'var(--radius-m)', background: 'var(--surface-card)', border: '1px dashed var(--sage-300)' }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <span style={{ flex: 1, font: '400 18px/1.2 var(--font-serif)', color: 'var(--text-strong)' }}>{title}</span>
        {isNew && <Badge tone="neutral" icon="sparkles">New idea</Badge>}
        {sale && <Badge tone="sale" icon="tag">Sale</Badge>}
      </div>
      {meta && <span style={{ font: '500 12.5px/1 var(--font-sans)', color: 'var(--text-muted)' }}>{meta}</span>}
      {(why || basis) && <span style={{ display: 'flex', gap: 6, font: '400 13px/1.4 var(--font-sans)', color: 'var(--sage-900)' }}><Icon name="sparkles" size={13} style={{ color: 'var(--sage-600)', marginTop: 3 }} />{basis ? `${basis}: ` : ''}{why}</span>}
      <Button size="s" variant="secondary" icon="check" disabled={busy} onClick={onUse} style={{ alignSelf: 'flex-start' }}>Use this</Button>
    </div>
  );
}

/** The Staples chip filters the recipe box; the other chips are preferences for Café. */
const NIGHT_CHIPS = [...SWAP_PREFS, STAPLES_TAG];
const isStaples = (r: RecipeSummary) => (r.tags ?? []).includes(STAPLES_TAG);
const boxSub = (r: RecipeSummary) => (isStaples(r) ? STAPLES_TAG : [r.method, r.total_min ? `${r.total_min} min` : '', `last made ${shortDate(r.last_made)}`].filter(Boolean).join(' · '));

export function SwapSheet({ open, slotId }: { open: boolean; slotId?: unknown }) {
  const { closeSheet, toast } = useUi();
  const { allSlots } = useWeekData();
  const slot = useSlotFor(slotId);
  /** Lunches & breakfast takes a recipe from the box (staples by default); Café's night ideas do not apply. */
  const isExtra = slot?.day === EXTRA;
  const [prefs, setPrefs] = useState<string[]>([]);
  /** Recipe box search: what is typed, and the debounced text the query uses. */
  const [query, setQuery] = useState('');
  const [q, setQ] = useState('');
  const [note, setNote] = useState('');
  const [jobId, setJobId] = useState<number | null>(null);
  /** What the newest ask said (null: chips only), so the thinking line can echo it. */
  const [asked, setAsked] = useState<string | null>(null);
  /** The last options Café returned: they stay on screen, dimmed, while a newer ask runs. */
  const [shown, setShown] = useState<{ jobId: number; opts: Opt[]; basis: string } | null>(null);
  const [since, setSince] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  const options = useSwapOptions();
  const swap = useSwapSlot();
  const job = useJobStatus(jobId);
  const { data: queue } = useQueue();
  const staplesOn = prefs.includes(STAPLES_TAG);
  const aiPrefs = prefs.filter((p) => p !== STAPLES_TAG);
  const searching = q.length > 0 || staplesOn;
  const { data: boxNow } = useRecipes({ status: 'saved', sort: 'stars', ...(q ? { q } : {}), ...(staplesOn ? { tag: [STAPLES_TAG] } : {}) });
  // Keep the last rows on screen while the next search loads.
  const lastBox = useRef<RecipeSummary[]>([]);
  if (boxNow) lastBox.current = boxNow;
  const box = boxNow ?? lastBox.current;
  const sid = slot?.id;
  useEffect(() => { const t = setTimeout(() => setQ(query.trim()), 200); return () => clearTimeout(t); }, [query]);

  const prefsRef = useRef(aiPrefs);
  prefsRef.current = aiPrefs;
  /** Ask Café. The server cancels any older ask for this night, so only the newest one runs. */
  const ask = (text: string | null) => {
    if (sid == null) return;
    setAsked(text);
    setSince(Date.now());
    setNow(Date.now());
    setJobId(null);
    options.mutate({ id: sid, prefs: prefsRef.current, text }, { onSuccess: (r) => setJobId(r.job.id) });
  };

  useEffect(() => { if (open) { setPrefs(isExtra ? [STAPLES_TAG] : []); setQuery(''); setQ(''); setNote(''); setJobId(null); setAsked(null); setShown(null); } }, [open, slotId]);
  // Ask when the sheet opens, and again (debounced) when the preference chips change.
  const prefKey = aiPrefs.join('|');
  const first = useRef(true);
  useEffect(() => {
    if (!open || sid == null || isExtra) { first.current = true; return; }
    const t = setTimeout(() => ask(note.trim() || null), first.current ? 0 : 450);
    first.current = false;
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, sid, prefKey]);

  const running = options.isPending || (jobId != null && (!job || job.status === 'queued' || job.status === 'running'));
  useJobPoll(running ? jobId : null);
  // Elapsed seconds on the thinking line (restarts on Retry too).
  useEffect(() => {
    if (!running) return;
    setSince(Date.now());
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [running]);
  useEffect(() => {
    if (job?.status === 'done' && job.id === jobId && shown?.jobId !== job.id) setShown({ jobId: job.id, opts: parseOptions(job.result).slice(0, 3), basis: askBasis(job.payload) });
  }, [job, jobId, shown?.jobId]);

  const used = useMemo(() => new Set(allSlots.map((s) => s.recipe_id).filter((x): x is number => x != null)), [allSlots]);
  if (!slot) return <Sheet open={false} />;
  const cur = slot.recipe;
  const opts = shown?.opts ?? [];
  const basis = shown?.basis ?? '';
  const typed = note.trim();
  const askBusy = running && asked === typed;
  const secs = Math.max(0, Math.round((now - since) / 1000));
  const thinkingText = asked ? `Asking Café: “${asked}”…` : 'Looking at deals and the pantry…';

  const done = (msg?: string) => { closeSheet(); toast({ icon: 'refresh-cw', title: msg ?? 'Swapped', message: isExtra ? 'The grocery list follows.' : 'Votes reset so everyone can weigh in.' }); };
  const useRecipe = (recipe_id: number, b: string, why?: string[], isNew = false) => swap.mutate({ id: slot.id, kind: 'recipe', recipe_id, basis: b || null, ...(why?.length ? { why } : {}) },
    { onSuccess: () => { if (isNew) { closeSheet(); toast({ icon: 'sparkles', title: 'Swapped', message: 'Café is writing the full recipe. Votes reset so everyone can weigh in.' }); } else done(); } });
  const makeIt = (kind: 'leftover' | 'leidy' | 'text', text: string, icon: string) => swap.mutate({ id: slot.id, kind, text, cook: kind === 'leidy' ? 'leidy' : undefined }, { onSuccess: () => { closeSheet(); toast({ icon, title: `${DAYNAME[slot.day]}: ${text}` }); } });
  const next = (queue ?? []).filter((x) => !used.has(x.recipe.id));
  // Searching shows every match; otherwise a few favorites that are not on the week (staples are not dinners).
  const fromBox = searching ? box.filter((r) => r.id !== slot.recipe_id) : box.filter((r) => !used.has(r.id) && !isStaples(r) && !next.some((x) => x.recipe.id === r.id)).slice(0, 3);
  const boxList = (fromBox.length > 0 || searching) && <><span style={{ ...caption, marginTop: searching ? 0 : 8 }}>From the recipe box</span>
    {fromBox.length > 0
      ? <Card padding="none" style={{ padding: '0 14px' }}><div data-testid="swap-box">{fromBox.map((r, i) => <div key={r.id} data-testid="swap-box-row"><ListRow title={r.title} sub={boxSub(r)} onClick={() => useRecipe(r.id, 'Picked from the recipe box')} last={i === fromBox.length - 1} /></div>)}</div></Card>
      : <span data-testid="swap-box-empty" style={{ font: '400 13px/1.4 var(--font-sans)', color: 'var(--text-muted)' }}>{boxNow ? 'Nothing in the recipe box matches.' : 'Searching…'}</span>}</>;

  return (
    <Sheet open={open} onClose={closeSheet} title={isExtra ? DAYNAME[EXTRA] : `Swap ${DAYNAME[slot.day]}`} subtitle={cur ? `Instead of ${cur.title}` : isExtra ? 'Pick what to stock up on' : 'Pick something for this night'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Input icon="search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the recipe box" />
        <ChoiceChips size="s" value={prefs} onChange={setPrefs} options={isExtra ? [STAPLES_TAG] : NIGHT_CHIPS} />
        {searching && boxList}
        {isExtra ? <>
          {!searching && boxList}
          {slot.recipe_id != null && <Button size="s" variant="secondary" icon="x" disabled={swap.isPending} style={{ alignSelf: 'flex-start', marginTop: 8 }}
            onClick={() => swap.mutate({ id: slot.id, kind: 'open' }, { onSuccess: () => { closeSheet(); toast({ icon: 'x', title: 'Left empty this week', message: 'Its items are off the grocery list.' }); } })}>Leave it empty this week</Button>}
        </> : <>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <Input style={{ flex: 1, minWidth: 0 }} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Or say it: “use the freezer meatballs”" />
          <Button variant="secondary" icon="sparkles" onClick={() => { if (!askBusy && typed) ask(typed); }} disabled={!typed || askBusy}
            style={askBusy ? { opacity: 0.8, animation: 'clm-pulse 1.4s ease-in-out infinite' } : undefined}>{askBusy ? 'Asking…' : 'Ask'}</Button>
        </div>
        <span style={{ ...caption, marginTop: 4 }}>Café's options</span>
        {running && <div data-testid="swap-thinking" role="status" style={{ padding: 16, borderRadius: 'var(--radius-m)', background: 'var(--sage-50)', font: '500 14px/1.4 var(--font-sans)', color: 'var(--sage-700)', display: 'flex', gap: 8, alignItems: 'center' }}>
          <Icon name="sparkles" size={16} /><span style={{ flex: 1 }}>{thinkingText}</span><span data-testid="swap-elapsed" style={{ font: '500 12.5px/1 var(--font-sans)', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{secs}s</span></div>}
        {!running && <JobState jobId={jobId} />}
        {!running && job?.status === 'done' && opts.length === 0 && <span style={{ font: '400 13px/1.4 var(--font-sans)', color: 'var(--text-muted)' }}>Café had no new ideas. Try the recipe box below.</span>}
        {opts.length > 0 && <div data-testid="swap-options" data-stale={running ? 'true' : 'false'} aria-busy={running} style={{ display: 'flex', flexDirection: 'column', gap: 14, opacity: running ? 0.45 : 1, transition: 'opacity var(--dur-fast) var(--ease-out)' }}>
          {opts.map((o) => (
            <OptionCard key={o.recipe_id} title={o.title} meta={metaLine(o)} sale={Object.values(o.ingredient_flags ?? {}).some((x) => x.sale)} isNew={o.detail_status === 'pending'} basis={basis} why={o.why?.[0]} busy={swap.isPending}
              onUse={() => useRecipe(o.recipe_id, basis, o.why, o.detail_status === 'pending')} />
          ))}
        </div>}
        {next.length > 0 && <><span style={{ ...caption, marginTop: 8 }}>Up next</span>
          <Card padding="none" style={{ padding: '0 14px' }}>{next.map((q, i) => <ListRow key={q.id} icon="list" iconColor="var(--sage-700)" title={q.recipe.title} sub={`Queued by ${q.by[0].toUpperCase() + q.by.slice(1)}`} onClick={() => useRecipe(q.recipe.id, 'From Up next')} last={i === next.length - 1} />)}</Card></>}
        {!searching && boxList}
        <span style={{ ...caption, marginTop: 8 }}>Or make it</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Button size="s" variant="secondary" icon="refresh-cw" onClick={() => makeIt('leftover', 'Leftovers night', 'refresh-cw')}>Leftovers night</Button>
          <Button size="s" variant="secondary" icon="chef-hat" onClick={() => makeIt('leidy', 'Leidy cooks', 'chef-hat')}>Leidy cooks</Button>
          <Button size="s" variant="secondary" icon="utensils" onClick={() => makeIt('text', 'Eating out', 'utensils')}>Eating out</Button>
        </div>
        </>}
      </div>
    </Sheet>
  );
}
