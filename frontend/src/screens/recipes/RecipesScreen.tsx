import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/screens-b.css';
import { Screen, LargeTitle, MealPhoto, SectionHead } from '../../components/layout/Layout';
import { Button } from '../../components/core/Button';
import { Icon } from '../../components/core/Icon';
import { Input } from '../../components/forms/Input';
import { ChoiceChips } from '../../components/forms/ChoiceChips';
import { Stars } from '../../components/display/Stars';
import { SuggestedTag } from '../../components/kitchen/SuggestedTag';
import { useRecipes } from '../../api/hooks';
import { useUi } from '../../state/UiContext';
import { shortDate } from '../../lib/listText';
import type { RecipeSummary } from '../../api/models';

const FILTERS = ['All', '5 stars', 'Quick', 'Instant Pot', "Leidy's"];

function useDebounced<T>(v: T, ms = 200): T {
  const [d, setD] = useState(v);
  useEffect(() => { const t = setTimeout(() => setD(v), ms); return () => clearTimeout(t); }, [v, ms]);
  return d;
}

export function RecipeRow({ r, last, draft }: { r: RecipeSummary; last?: boolean; draft?: boolean }) {
  const nav = useNavigate();
  const meta = [r.method, r.total_min ? `${r.total_min} min` : null, draft ? null : `last made ${shortDate(r.last_made)}`].filter(Boolean).join(' · ');
  return (
    <div data-testid="recipe-row" onClick={() => nav(`/recipes/${r.id}`)} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '14px 0', borderBottom: last ? 0 : '1px solid var(--border-subtle)', cursor: 'pointer' }}>
      <MealPhoto height={64} style={{ width: 64, flex: 'none' }} radius="var(--radius-s)" />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 5 }}>
        <span style={{ font: '400 17px/1.25 var(--font-serif)', color: 'var(--text-strong)' }}>{r.title}</span>
        <span style={{ font: '400 12.5px/1.2 var(--font-sans)', color: 'var(--text-muted)' }}>{meta}</span>
        {draft ? <SuggestedTag status="draft" style={{ alignSelf: 'flex-start' }} /> : (r.stars ?? 0) > 0 ? <Stars value={r.stars!} size={13} /> : <span style={{ font: '600 11.5px/1 var(--font-sans)', color: 'var(--honey-700)' }}>Not rated yet</span>}
      </div>
      <Icon name="chevron-right" size={18} style={{ color: 'var(--text-faint)' }} />
    </div>
  );
}

export function RecipesScreen() {
  const { openSheet } = useUi();
  const [q, setQ] = useState('');
  const [f, setF] = useState('All');
  const dq = useDebounced(q);
  const { data: all = [] } = useRecipes();
  const { data, isFetching } = useRecipes({ q: dq || undefined, filter: f === 'All' ? undefined : f });
  // Keep the previous results on screen while a new search loads, so the list does not flash empty.
  const prev = useRef<RecipeSummary[]>([]);
  if (data) prev.current = data;
  const list = data ?? prev.current;
  const { data: drafts = [] } = useRecipes({ status: 'draft', sort: 'recent' });
  const searching = !!dq || f !== 'All';
  return (
    <Screen>
      <LargeTitle overline={`${all.length} family recipes`} title="Recipe box" right={<Button size="s" icon="plus" onClick={() => openSheet({ type: 'add-recipe' })}>Add</Button>} />
      <Input icon="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search recipes" />
      <div className="b-chips-scroll"><ChoiceChips size="s" multi={false} value={f} onChange={(v) => setF(v || 'All')} options={FILTERS} style={{ flexWrap: 'nowrap' }} /></div>
      <div data-testid="recipe-list" data-busy={isFetching}>
        {list.map((r, i) => <RecipeRow key={r.id} r={r} last={i === list.length - 1} />)}
        {!list.length && !isFetching && <p style={{ padding: '24px 0', font: '400 14px/1.5 var(--font-sans)', color: 'var(--text-muted)' }}>No recipes match. Try “Add” to bring one in.</p>}
      </div>
      {drafts.length > 0 && !searching && (
        <>
          <SectionHead title="Drafts to check" aside={`${drafts.length}`} />
          <div>{drafts.map((r, i) => <RecipeRow key={r.id} r={r} draft last={i === drafts.length - 1} />)}</div>
        </>
      )}
    </Screen>
  );
}
