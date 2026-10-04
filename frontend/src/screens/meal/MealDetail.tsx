import { JobState } from '../../components/feedback/JobState';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import type { Ingredient, SlotIngredient } from '../../api/models';
import { Button } from '../../components/core/Button';
import { IconButton } from '../../components/core/IconButton';
import { Icon } from '../../components/core/Icon';
import { Badge } from '../../components/display/Badge';
import { Card } from '../../components/display/Card';
import { DayTag } from '../../components/display/DayTag';
import { Score } from '../../components/display/Score';
import { Stars } from '../../components/display/Stars';
import { Input } from '../../components/forms/Input';
import { CookChip } from '../../components/kitchen/CookChip';
import { SuggestedTag } from '../../components/kitchen/SuggestedTag';
import { ReviewActions } from '../../components/kitchen/ReviewActions';
import { RecipeStep } from '../../components/kitchen/RecipeStep';
import { Screen, BackHeader, SectionHead, MealPhoto, Why, BottomBar } from '../../components/layout/Layout';
import { useAddToQueue, useDeleteRecipe, useKeepSlot, useMarkCooked, usePatchSlot, useRecipe, useRemoveFromQueue, useSaveRecipe } from '../../api/hooks';
import { useUi } from '../../state/UiContext';
import { useWeekData } from '../../state/useWeekSlots';
import { Md, costStr, dayKey, hasSale, stepTimer, timeStr } from '../../lib/meal';
import { Meta, RecipeWriting, isWriting } from '../plan/parts';
import '../../styles/screens-a.css';

const TAG = { have: ['success', 'On hand'], list: ['neutral', 'On list'], sale: ['sale', 'On sale'] } as const;
type Ing = Ingredient & { tag?: SlotIngredient['tag'] };

function parseNum(q: string): number | null {
  const parts = q.trim().split(/\s+/);
  let total = 0;
  for (const p of parts) {
    const f = p.match(/^(\d+)\/(\d+)$/);
    const n = f ? +f[1] / +f[2] : Number(p);
    if (!isFinite(n)) return null;
    total += n;
  }
  return parts[0] ? total : null;
}
function scaleQty(q: string, k: number): string {
  if (k === 1) return q;
  const n = parseNum(q);
  return n == null ? q : String(Math.round(n * k * 100) / 100);
}

export function MealDetail() {
  const { id } = useParams();
  const [sp] = useSearchParams();
  const nav = useNavigate();
  const { openSheet, toast } = useUi();
  const { slots, nameOf } = useWeekData();
  const recipeId = Number(id);
  const { data: m, isLoading, isError } = useRecipe(Number.isFinite(recipeId) ? recipeId : undefined);
  const day = sp.get('day');
  const s = day ? slots.find((x) => x.day === day && x.recipe_id === recipeId) : undefined;
  const keep = useKeepSlot();
  const patchSlot = usePatchSlot();
  const markCooked = useMarkCooked();
  const addQueue = useAddToQueue();
  const removeQueue = useRemoveFromQueue();
  const saveRecipe = useSaveRecipe();
  const delRecipe = useDeleteRecipe();

  const base: Ing[] = s ? (s.ingredients ?? []).map(({ qty, unit, name, group, tag }) => ({ qty, unit, name, group, tag })) : (m?.ingredients ?? []);
  const baseKey = JSON.stringify(base);
  const [ings, setIngs] = useState<Ing[]>(base);
  const [editing, setEditing] = useState(false);
  const [newIng, setNewIng] = useState('');
  const [serves, setServes] = useState(5);
  const [cooking, setCooking] = useState(-1);
  const [rated, setRated] = useState(0);
  const startedFromUrl = useRef(false);
  const stepEls = useRef<Array<HTMLDivElement | null>>([]);

  // Follow the server copy unless someone is mid-edit.
  useEffect(() => { if (!editing) setIngs(base); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [baseKey, editing]);
  useEffect(() => { if (sp.get('edit') && s && !startedFromUrl.current) { startedFromUrl.current = true; setEditing(true); } }, [sp, s]);
  const flat = (m?.steps ?? []).flatMap((g) => (g.steps ?? []).map((text, i) => ({ group: i === 0 ? g.group : null, text })));
  useEffect(() => { if (sp.get('cook') && m && flat.length && !startedFromUrl.current) { startedFromUrl.current = true; setCooking(0); } });
  useEffect(() => { if (cooking >= 0) stepEls.current[cooking]?.scrollIntoView?.({ block: 'center', behavior: 'smooth' }); }, [cooking]);

  if (isLoading) return <Screen bottom={40}><BackHeader title="" onBack={() => nav(-1)} /><div className="clm-skeleton" style={{ height: 200, borderRadius: 'var(--radius-m)', background: 'var(--linen-200)' }} /></Screen>;
  if (isError || !m) return <Screen bottom={40}><BackHeader title="Meal" onBack={() => nav(-1)} /><p style={{ font: '400 14px/1.45 var(--font-sans)', color: 'var(--text-muted)' }}>We couldn't find that meal.</p></Screen>;

  const draft = m.status === 'draft';
  const status = s ? (s.status ?? null) : draft ? 'draft' : null;
  const dirty = JSON.stringify(ings) !== baseKey || serves !== 5;
  const done = flat.length > 0 && cooking >= flat.length;
  const save = () => {
    if (!s) return;
    const k = serves / 5;
    const out: Ingredient[] = ings.map(({ qty, unit, name, group }) => ({ qty: scaleQty(qty, k), unit, name, group }));
    patchSlot.mutate({ id: s.id, ingredients: out, reset_ingredients: false }, { onSuccess: () => { setEditing(false); setServes(5); toast({ tone: 'success', icon: 'check', title: 'Saved', message: 'Marked as edited. The grocery list follows.' }); } });
  };
  const addIng = () => {
    const v = newIng.trim();
    if (!v) return;
    const q = v.match(/^(\d+(?:[./]\d+)?)\s+(?:(lbs?|oz|cups?|tbsp|tsp|cans?|jars?|bags?|bunch(?:es)?|heads?|cloves?|blocks?|trays?|ears?|packages?|pkgs?|boxes|box|bottles?)\s+)?(.+)$/i);
    setIngs([...ings, { qty: q ? q[1] : '', unit: q?.[2] ?? '', name: q ? q[3] : v, tag: 'list' }]);
    setNewIng('');
  };
  const inQueue = m.in_queue;
  const onWeek = (m.on_week_days ?? []).length > 0;

  return (
    <>
      <Screen bottom={120}>
        <BackHeader title={m.title} onBack={() => nav(-1)} right={s && <IconButton icon="ellipsis" label="Change" onClick={() => openSheet({ type: 'edit', slotId: s.id })} />} />
        <MealPhoto height={200} radius="var(--radius-m)">{s && <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}><DayTag day={dayKey(s.day)} />{hasSale(s) && <Badge tone="sale" variant="solid" icon="tag">On sale</Badge>}</div>}</MealPhoto>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
          {status && <SuggestedTag status={status} by={status === 'suggested' || status === 'draft' ? undefined : nameOf(s?.by)} style={{ alignSelf: 'flex-start' }} />}
          {s?.job_id != null && !isWriting(m) && <JobState jobId={s.job_id} thinking="Finding something else…" />}
          <RecipeWriting recipe={m} jobId={s?.job_id ?? null} />
          {s && (s.kind === 'cook' || s.kind === 'leidy') && <CookChip cook={s.cook} onClick={() => openSheet({ type: 'cook', slotId: s.id })} style={{ alignSelf: 'flex-start', height: 28, font: '600 13px/1 var(--font-sans)' }} />}
          <h1 style={{ font: '300 30px/1.1 var(--font-serif)', letterSpacing: 'var(--ls-display)', color: 'var(--text-strong)' }}>{m.title}</h1>
          <p style={{ font: 'var(--type-description)', fontSize: 16, color: 'var(--text-body)' }}>{m.description}</p>
          <Meta method={m.method} time={timeStr(m)} cost={costStr(m)} />
          {draft && !isWriting(m) && <div style={{ display: 'flex', gap: 10, padding: '12px 14px', borderRadius: 'var(--radius-s)', background: 'var(--honey-100)', color: 'var(--honey-700)', font: '400 13px/1.45 var(--font-sans)' }}><Icon name="notebook-pen" size={16} style={{ marginTop: 2 }} /><span>Café wrote this recipe. Check the amounts and steps before cooking it. Nothing is saved until you do.</span></div>}
          {m.healthy != null && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}><Score label="Healthy" value={m.healthy} /><Score label="Delicious" value={m.delicious ?? 0} tone="terra" /></div>}
          {s && (status === 'suggested' || status === 'edited') && ((s.why?.length ?? 0) > 0 || s.basis) && <Why items={s.why ?? []} basis={s.basis ?? undefined} />}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '28px 0 12px' }}>
          <h2 style={{ font: '400 22px/1.2 var(--font-serif)', color: 'var(--text-strong)' }}>Ingredients</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {editing && <><IconButton icon="minus" label="Fewer" size="s" variant="secondary" onClick={() => setServes(Math.max(1, serves - 1))} /><span style={{ font: '600 13px/1 var(--font-sans)', minWidth: 58, textAlign: 'center' }}>Serves {serves}</span><IconButton icon="plus" label="More" size="s" variant="secondary" onClick={() => setServes(serves + 1)} /></>}
            {!editing && s && <Button size="s" variant="ghost" icon="pencil" onClick={() => setEditing(true)}>Edit</Button>}
          </div>
        </div>
        <Card padding="none" style={{ padding: '0 14px' }}>
          <div data-testid="ingredients">
          {ings.map((x, i) => (
            <div key={i} data-testid="ingredient" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', borderBottom: i < ings.length - 1 || editing ? '1px solid var(--border-subtle)' : 0 }}>
              <span style={{ flex: 1, minWidth: 0, font: '400 15px/1.35 var(--font-sans)', color: 'var(--text-strong)' }}>{(x.qty || x.unit) && <b style={{ fontWeight: 650 }}>{[scaleQty(x.qty, serves / 5), x.unit].filter(Boolean).join(' ')} </b>}{x.name}</span>
              {x.tag && <Badge tone={TAG[x.tag][0]}>{TAG[x.tag][1]}</Badge>}
              {editing && <IconButton icon="x" label={`Remove ${x.name}`} size="s" onClick={() => setIngs(ings.filter((_, j) => j !== i))} />}
            </div>
          ))}
          </div>
          {editing && <form onSubmit={(e) => { e.preventDefault(); addIng(); }} style={{ display: 'flex', gap: 8, padding: '12px 0' }}>
            <Input size="s" style={{ flex: 1, minWidth: 0 }} value={newIng} onChange={(e) => setNewIng(e.target.value)} placeholder="Add an ingredient" />
            <Button size="s" type="submit" variant="secondary" icon="plus">Add</Button>
          </form>}
        </Card>
        {flat.length > 0 && <>
          <SectionHead title="Steps" aside={cooking >= 0 && !done ? `Step ${cooking + 1} of ${flat.length}` : null} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {flat.map((st, i) => (
              <div key={i} ref={(el) => { stepEls.current[i] = el; }}>
                {st.group && <div style={{ font: '600 12px/1 var(--font-sans)', color: 'var(--sage-700)', margin: i === 0 ? '0 0 2px' : '14px 0 2px' }}>{st.group}</div>}
                <RecipeStep index={i + 1} done={cooking > i} active={cooking === i} timer={stepTimer(st.text) ?? undefined} onToggle={cooking >= 0 ? () => setCooking(i) : undefined}><Md text={st.text} /></RecipeStep>
              </div>
            ))}
          </div>
        </>}
        {done && <Card tone="accent" padding="m" style={{ marginTop: 16 }}><div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}><span style={{ font: '400 20px/1.2 var(--font-serif)', color: 'var(--text-strong)' }}>How was it?</span><Stars value={rated} size={28} onChange={(v) => { setRated(v); markCooked.mutate({ id: m.id, stars: v }, { onSuccess: () => toast({ tone: 'success', icon: 'star', title: `Saved — ${v} stars`, message: 'Joe and Leidy can add theirs.' }) }); }} /></div></Card>}
        {m.leftovers && <><SectionHead title="Leftovers" /><div style={{ display: 'flex', gap: 10, font: '400 14px/1.45 var(--font-sans)', color: 'var(--text-body)' }}><Icon name="refresh-cw" size={16} style={{ color: 'var(--sage-600)', marginTop: 2 }} /><Md text={m.leftovers} /></div></>}
      </Screen>
      <BottomBar>
        {editing ? <><Button variant="secondary" style={{ flex: 1 }} onClick={() => { setIngs(base); setServes(5); setEditing(false); }}>Cancel</Button><Button style={{ flex: 1.4 }} icon="check" disabled={!dirty || patchSlot.isPending} onClick={save}>Save changes</Button></>
          : draft ? <><Button variant="secondary" style={{ flex: 1 }} icon="x" onClick={() => delRecipe.mutate(m.id, { onSuccess: () => nav(-1) })}>Discard</Button><Button variant="accent" style={{ flex: 1.4 }} icon="book-open" onClick={() => saveRecipe.mutate(m.id, { onSuccess: () => { toast({ tone: 'success', icon: 'book-open', title: 'Saved to the recipe box' }); nav(-1); } })}>Save to recipe box</Button></>
          : s && s.status === 'suggested' ? <ReviewActions style={{ flex: 1 }} onReject={() => openSheet({ type: 'reject', slotId: s.id })} onSwap={() => openSheet({ type: 'swap', slotId: s.id })} onApprove={() => keep.mutate(s.id, { onSuccess: () => toast({ tone: 'success', icon: 'check', title: 'Kept', message: 'Others can still vote or swap it.' }) })} />
          : flat.length > 0 && cooking >= 0 && !done ? <><Button variant="secondary" icon="arrow-left" style={{ flex: 1 }} disabled={cooking === 0} onClick={() => setCooking(cooking - 1)}>Back</Button><Button style={{ flex: 1.4 }} iconRight="arrow-right" onClick={() => setCooking(cooking + 1)}>{cooking === flat.length - 1 ? 'Done cooking' : 'Next step'}</Button></>
          : !s ? <>{onWeek
              ? <Button variant="secondary" icon="calendar-days" style={{ flex: 1 }} disabled>On this week</Button>
              : inQueue
              ? <Button variant="secondary" icon="check" style={{ flex: 1 }} onClick={() => removeQueue.mutate(m.id, { onSuccess: () => toast({ icon: 'x', title: 'Removed from Up next' }) })}>In Up next</Button>
              : <Button variant="secondary" icon="plus" style={{ flex: 1 }} onClick={() => addQueue.mutate({ recipe_id: m.id }, { onSuccess: () => toast({ tone: 'success', icon: 'list', title: 'Added to Up next', message: 'Café will work it into an upcoming week.' }) })}>Add to Up next</Button>}
            <Button icon="calendar-days" style={{ flex: 1 }} onClick={() => openSheet({ type: 'schedule', recipeId: m.id })}>Put on a night</Button></>
          : <Button size="l" fullWidth icon="chef-hat" disabled={flat.length === 0 || done} onClick={() => setCooking(0)}>{done ? 'Enjoy dinner' : flat.length ? 'Start cooking' : 'Full steps in the recipe box'}</Button>}
      </BottomBar>
    </>
  );
}
