(() => {
const { Button, Input, ChoiceChips, Stars, Sheet, PhotoTile, Card, Icon } = window.CafeLaurenDesignSystem_9f0e0a;
const MEAL_IDS = ['tacos', 'soup', 'shrimp', 'meatballs'];
const DRAFT = {
  title: 'Slow Cooker Chicken Tortilla Soup', description: 'The family tortilla soup, adapted for a morning start so it’s ready at dinner.', method: 'Slow cooker', time: '6 hr (15 min hands-on)', cost: '~$15', healthy: 8, delicious: 8,
  why: ['Based on your Instant Pot Tortilla Soup (5 stars)', 'Same ingredients, longer low cook', 'Amounts sized for 5 + 2 days of leftovers'],
  ingredients: [['2.5 lbs', 'chicken thighs', 'list'], ['1', 'onion, diced', 'list'], ['1 can', 'black beans', 'sale'], ['1 can', 'fire-roasted tomatoes', 'list'], ['1 can', 'corn', 'list'], ['4 cups', 'chicken broth', 'list'], ['1 tbsp', 'chili powder', 'have'], ['2', 'limes', 'sale']],
  steps: [['Add <b>2.5 lbs chicken thighs</b>, <b>1 diced onion</b>, <b>1 can black beans</b>, <b>1 can tomatoes</b>, <b>1 can corn</b> and <b>4 cups broth</b> to the slow cooker.', null], ['Season with <b>1 tbsp chili powder</b>, <b>1 tsp cumin</b>, salt and pepper.', null], ['Cook on Low.', '6 hr'], ['Shred the chicken with two forks, stir in <b>juice of 2 limes</b>.', null]],
  leftovers: 'Day 2: over rice for a tortilla soup bowl',
};

function RecipesScreen() {
  const a = useApp();
  const [q, setQ] = React.useState('');
  const [f, setF] = React.useState('All');
  const list = a.recipes.filter(r => (f === 'All' || (f === '5 stars' ? r.stars === 5 : r.tags.includes(f))) && r.title.toLowerCase().includes(q.toLowerCase()));
  return (
    <Screen>
      <LargeTitle overline={`${a.recipes.length} family recipes`} title="Recipe box" right={<Button size="s" icon="plus" onClick={() => a.openSheet({ type: 'add' })}>Add</Button>} />
      <Input icon="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search recipes" />
      <div style={{ margin: '14px -20px 8px', padding: '0 20px', overflowX: 'auto' }}><ChoiceChips size="s" multi={false} value={f} onChange={v => setF(v || 'All')} options={['All', '5 stars', 'Quick', 'Instant Pot', "Leidy's"]} style={{ flexWrap: 'nowrap' }} /></div>
      <div>
        {list.map((r, i) => (
          <div key={r.id} onClick={() => MEAL_IDS.includes(r.id) ? a.push({ type: 'meal', mealId: r.id }) : a.toast({ icon: 'book-open', title: r.title, message: 'Full recipe opens here' })} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '14px 0', borderBottom: i < list.length - 1 ? '1px solid var(--border-subtle)' : 0, cursor: 'pointer' }}>
            <MealPhoto height={64} style={{ width: 64, flex: 'none' }} radius="var(--radius-s)" />
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ font: '400 17px/1.25 var(--font-serif)', color: 'var(--text-strong)' }}>{r.title}</span>
              <span style={{ font: '400 12.5px/1.2 var(--font-sans)', color: 'var(--text-muted)' }}>{r.method} · {r.time} · last made {r.last}</span>
              {r.stars > 0 ? <Stars value={r.stars} size={13} /> : <span style={{ font: '600 11.5px/1 var(--font-sans)', color: 'var(--honey-700)' }}>Not rated yet</span>}
            </div>
            <Icon name="chevron-right" size={18} style={{ color: 'var(--text-faint)' }} />
          </div>
        ))}
        {!list.length && <p style={{ padding: '24px 0', font: '400 14px/1.5 var(--font-sans)', color: 'var(--text-muted)' }}>No recipes match. Try “Add” to bring one in.</p>}
      </div>
    </Screen>
  );
}

function AddRecipeSheet({ open }) {
  const a = useApp();
  const [mode, setMode] = React.useState('describe');
  const [val, setVal] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  React.useEffect(() => { if (open) { setVal(''); setBusy(false); } }, [open]);
  const go = () => { setBusy(true); setTimeout(() => { a.closeSheet(); a.push({ type: 'meal', draft: { ...DRAFT, title: mode === 'describe' ? DRAFT.title : 'Lemon Herb Chicken and Orzo', description: mode === 'describe' ? DRAFT.description : 'Imported recipe — rescaled to serve 5.' } }); }, 1200); };
  const label = { link: 'Read the page', photo: 'Read the photo', text: 'Tidy it up', describe: 'Write a draft' }[mode];
  return (
    <Sheet open={open} onClose={a.closeSheet} title="Add a recipe" subtitle="Café turns it into the family format. You check it before it's saved."
      footer={<Button size="l" fullWidth icon="sparkles" disabled={busy || (mode !== 'photo' && !val.trim())} onClick={go}>{busy ? 'Working on it…' : label}</Button>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <ChoiceChips size="s" multi={false} value={mode} onChange={v => v && setMode(v)} options={[{ value: 'describe', label: 'Describe it', icon: 'sparkles' }, { value: 'link', label: 'Link', icon: 'arrow-right' }, { value: 'photo', label: 'Photo', icon: 'camera' }, { value: 'text', label: 'Paste text', icon: 'clipboard-list' }]} />
        {mode === 'link' && <Input icon="search" value={val} onChange={e => setVal(e.target.value)} placeholder="https://" />}
        {mode === 'photo' && <PhotoTile empty aspect="16 / 9" label="Snap a cookbook page or recipe card" />}
        {mode === 'text' && <Input multiline rows={6} value={val} onChange={e => setVal(e.target.value)} placeholder="Paste the recipe here" />}
        {mode === 'describe' && <Input multiline rows={4} value={val} onChange={e => setVal(e.target.value)} placeholder="Our tortilla soup, but in the slow cooker so it's ready when we get home" />}
        <span style={{ display: 'flex', gap: 8, font: '400 12.5px/1.45 var(--font-sans)', color: 'var(--text-muted)' }}><Icon name="info" size={14} style={{ marginTop: 2 }} />Every amount is bolded in the step where it's used, sized for 5.</span>
      </div>
    </Sheet>
  );
}
Object.assign(window, { RecipesScreen, AddRecipeSheet });
})();
