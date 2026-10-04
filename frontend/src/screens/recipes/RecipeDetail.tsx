import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/screens-b.css';
import { Screen, BackHeader, MealPhoto, SectionHead, BottomBar } from '../../components/layout/Layout';
import { Button } from '../../components/core/Button';
import { Icon } from '../../components/core/Icon';
import { Badge } from '../../components/display/Badge';
import { Card } from '../../components/display/Card';
import { Score } from '../../components/display/Score';
import { Stars } from '../../components/display/Stars';
import { SegmentedControl } from '../../components/forms/SegmentedControl';
import { SuggestedTag } from '../../components/kitchen/SuggestedTag';
import { RecipeStep } from '../../components/kitchen/RecipeStep';
import { useAddToQueue, useDeleteRecipe, useMarkCooked, usePatchRecipe, useRecipe, useRemoveFromQueue, useSaveRecipe } from '../../api/hooks';
import { useWeekData } from '../../state/useWeekSlots';
import { useUi } from '../../state/UiContext';
import { useQueryClient } from '@tanstack/react-query';
import { keys } from '../../api/keys';
import { renderBold, visibleTags } from './bold';
import { shortDate } from '../../lib/listText';

export function RecipeDetail() {
  const { id } = useParams();
  const rid = Number(id);
  const nav = useNavigate();
  const qc = useQueryClient();
  const refresh = () => qc.invalidateQueries({ queryKey: keys.recipe(rid) });
  const { toast, openSheet } = useUi();
  const { data: r, isLoading, error } = useRecipe(Number.isFinite(rid) ? rid : undefined);
  const save = useSaveRecipe();
  const del = useDeleteRecipe();
  const queue = useAddToQueue();
  const unqueue = useRemoveFromQueue();
  const cooked = useMarkCooked();
  const patch = usePatchRecipe();
  const { people } = useWeekData();
  const [rating, setRating] = useState(0);
  const [rateOpen, setRateOpen] = useState(false);
  const back = () => nav('/recipes');
  const fail = (title: string) => (e: unknown) => toast({ tone: 'danger', icon: 'triangle-alert', title, message: (e as Error).message });

  if (isLoading || !r) {
    return <Screen><BackHeader title="Recipe" onBack={back} /><p style={{ font: '400 14px/1.5 var(--font-sans)', color: 'var(--text-muted)', marginTop: 16 }}>{error ? 'Could not load this recipe.' : 'Loading…'}</p></Screen>;
  }
  const draft = r.status === 'draft';
  const ingredients = r.ingredients ?? [];
  const steps = r.steps ?? [];
  const onDays = r.on_week_days ?? [];
  const tags = visibleTags(r.tags ?? []);
  const meta = [r.method, r.total_min ? `${r.total_min} min` : null, r.cost_usd ? `~$${Math.round(r.cost_usd)}` : null].filter(Boolean).join(' · ');
  const groups = ingredients.reduce<Record<string, typeof ingredients>>((m, i) => { (m[i.group || ''] ||= []).push(i); return m; }, {});
  let n = 0;
  return (
    <>
      <Screen bottom={140}>
        <BackHeader title={r.title} onBack={back} />
        <MealPhoto height={170} />
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', margin: '16px 0 8px', flexWrap: 'wrap' }}>
          {draft ? <SuggestedTag status="draft" /> : <Badge tone="success" icon="book-open">In the recipe box</Badge>}
          {onDays.length > 0 && <Badge tone="accent" icon="calendar-days">On the plan · {onDays.join(', ')}</Badge>}
          {r.in_queue && <Badge tone="info" icon="list">Up next</Badge>}
        </div>
        <h1 data-testid="recipe-title" style={{ font: '300 30px/1.1 var(--font-serif)', letterSpacing: 'var(--ls-display)', color: 'var(--text-strong)' }}>{r.title}</h1>
        {r.description && <p style={{ font: 'italic 400 16px/1.45 var(--font-serif)', color: 'var(--text-body)', margin: '8px 0 0' }}>{r.description}</p>}
        {meta && <p style={{ font: '500 13px/1.3 var(--font-sans)', color: 'var(--text-muted)', margin: '10px 0 0' }}>{meta}</p>}
        {!draft && (r.stars ?? 0) > 0 && <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}><Stars value={r.stars!} size={16} /><span style={{ font: '400 12.5px/1 var(--font-sans)', color: 'var(--text-muted)' }}>last made {shortDate(r.last_made)}</span></div>}
        {(r.healthy != null || r.delicious != null) && (
          <div style={{ display: 'flex', gap: 24, margin: '16px 0 0' }}>
            {r.healthy != null && <Score label="Healthiness" value={r.healthy} tone="sage" style={{ flex: 1 }} />}
            {r.delicious != null && <Score label="Deliciousness" value={r.delicious} tone="terra" style={{ flex: 1 }} />}
          </div>
        )}
        {!draft && <Button size="s" variant="secondary" icon="calendar-days" style={{ marginTop: 14 }} onClick={() => openSheet({ type: 'schedule', recipeId: r.id })}>Put on a night</Button>}
        {!draft && (
          <div data-testid="default-cook" style={{ marginTop: 18 }}>
            <span style={{ display: 'block', font: '600 13px/1 var(--font-sans)', color: 'var(--text-strong)', marginBottom: 8 }}>Usually cooked by</span>
            <SegmentedControl size="s" value={r.default_cook ?? ''} onChange={(v) => patch.mutate({ id: r.id, default_cook: v || null }, {
              onSuccess: () => toast({ tone: 'success', icon: 'chef-hat', title: v ? `${people.find((p) => p.key === v)?.name ?? v} usually cooks this` : 'Anyone can cook this', message: 'New nights use this. Nights already planned stay as they are.' }),
              onError: fail('Could not save'),
            })} options={[...people.map((p) => ({ value: p.key, label: p.name })), { value: '', label: 'Anyone' }]} />
            <span style={{ display: 'block', font: '400 12.5px/1.4 var(--font-sans)', color: 'var(--text-muted)', marginTop: 8 }}>The default when this goes on a night. It doesn't change nights already planned; change those from the plan.</span>
          </div>
        )}
        {tags.length > 0 && <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 14 }}>{tags.map((t) => <Badge key={t}>{t}</Badge>)}</div>}
        {draft && (
          <div data-testid="draft-banner" style={{ display: 'flex', gap: 10, padding: '12px 14px', borderRadius: 'var(--radius-s)', background: 'var(--honey-100)', color: 'var(--honey-700)', font: '400 13px/1.45 var(--font-sans)', marginTop: 16 }}>
            <Icon name="triangle-alert" size={16} style={{ marginTop: 2 }} />
            <span><b>Check this before cooking.</b> Café wrote this draft{r.source === 'ai' ? '' : ''}. It is not in the recipe box until you save it.</span>
          </div>
        )}

        <SectionHead title="Ingredients" aside={`${ingredients.length}`} />
        <Card padding="none" style={{ padding: '4px 14px' }}>
          {Object.entries(groups).map(([g, items]) => (
            <div key={g}>
              {g && <div style={{ font: 'var(--type-overline)', letterSpacing: 'var(--ls-overline)', textTransform: 'uppercase', color: 'var(--text-muted)', padding: '12px 0 2px' }}>{g}</div>}
              {items.map((i, k) => (
                <div key={`${i.name}-${k}`} style={{ display: 'flex', gap: 8, padding: '10px 0', borderBottom: '1px solid var(--border-subtle)', font: '400 15px/1.35 var(--font-sans)', color: 'var(--text-strong)' }}>
                  <span style={{ minWidth: 64, fontWeight: 650 }}>{[i.qty, i.unit].filter(Boolean).join(' ')}</span><span>{i.name}</span>
                </div>
              ))}
            </div>
          ))}
          {!ingredients.length && <p style={{ padding: '12px 0', font: '400 14px/1.4 var(--font-sans)', color: 'var(--text-muted)' }}>No ingredients yet.</p>}
        </Card>

        {steps.length > 0 && <SectionHead title="Instructions" />}
        {steps.map((g) => (
          <div key={g.group} style={{ marginBottom: 16 }}>
            <div style={{ font: '600 14px/1.2 var(--font-sans)', color: 'var(--text-strong)', margin: '0 0 6px' }}>{g.group}</div>
            {(g.steps ?? []).map((s) => <RecipeStep key={`${g.group}-${s}`} index={++n}>{renderBold(s)}</RecipeStep>)}
          </div>
        ))}

        {r.leftovers && (
          <>
            <SectionHead title="Leftovers" />
            <p style={{ font: '400 14px/1.5 var(--font-sans)', color: 'var(--text-body)' }}>{r.leftovers}</p>
          </>
        )}

        {!draft && rateOpen && (
          <Card padding="m" tone="accent" style={{ marginTop: 20 }}>
            <div ref={(el) => el?.scrollIntoView({ block: 'center', behavior: 'smooth' })} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span style={{ font: '400 20px/1.2 var(--font-serif)', color: 'var(--text-strong)' }}>How was dinner?</span>
              <Stars value={rating} size={28} onChange={setRating} />
              <span style={{ font: '400 13px/1.4 var(--font-sans)', color: 'var(--text-muted)' }}>Ratings go back into the recipe box, so next week's plan gets better.</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button variant="ghost" size="s" onClick={() => setRateOpen(false)}>Cancel</Button>
                <Button icon="check" size="s" disabled={!rating || cooked.isPending} onClick={() => cooked.mutate({ id: r.id, stars: rating }, {
                  onSuccess: () => { refresh(); setRateOpen(false); setRating(0); toast({ tone: 'success', icon: 'star', title: 'Marked as cooked', message: `${rating} star${rating > 1 ? 's' : ''} saved.` }); },
                  onError: fail('Could not save'),
                })}>Mark as cooked</Button>
              </div>
            </div>
          </Card>
        )}
      </Screen>
      <BottomBar>
        {draft ? (
          <>
            <Button size="l" variant="secondary" icon="trash-2" disabled={del.isPending} onClick={() => del.mutate(r.id, { onSuccess: () => { toast({ icon: 'trash-2', title: 'Draft discarded' }); back(); }, onError: fail('Could not discard') })}>Discard</Button>
            <Button size="l" variant="accent" fullWidth icon="book-open" disabled={save.isPending} onClick={() => save.mutate(r.id, { onSuccess: () => toast({ tone: 'success', icon: 'book-open', title: 'Saved to the recipe box' }), onError: fail('Could not save') })}>Save to recipe box</Button>
          </>
        ) : (
          <>
            <Button size="l" variant="secondary" fullWidth icon={r.in_queue ? 'check' : 'list'} disabled={queue.isPending || unqueue.isPending} onClick={() => r.in_queue
              ? unqueue.mutate(r.id, { onSuccess: () => { refresh(); toast({ icon: 'list', title: 'Removed from Up next' }); } })
              : queue.mutate({ recipe_id: r.id }, { onSuccess: () => { refresh(); toast({ tone: 'success', icon: 'list', title: 'Added to Up next', message: 'Café will work it into an upcoming week.' }); }, onError: fail('Could not add') })}>{r.in_queue ? 'In Up next' : 'Add to Up next'}</Button>
            <Button size="l" variant="primary" fullWidth icon="star" onClick={() => setRateOpen(true)}>Mark cooked</Button>
          </>
        )}
      </BottomBar>
    </>
  );
}
