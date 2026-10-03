(() => {
const { Button, IconButton, Badge, DayTag, SuggestedTag, ReviewActions, Score, Stars, Input, RecipeStep, Card, Icon } = window.CafeLaurenDesignSystem_9f0e0a;
const STEPS = {
  chops: [['Heat the oven to 425°F. Toss <b>1.5 lbs quartered potatoes</b> and <b>1 onion, in wedges</b> with <b>2 tbsp olive oil</b>, salt and pepper.', null], ['Spread on a sheet pan and roast until the edges brown.', '15 min'], ['Rub <b>5 pork chops</b> with <b>1 tbsp olive oil</b>, <b>2 tsp smoked paprika</b> and <b>1 tsp dried thyme</b>.', null], ['Push potatoes aside; add chops and <b>1 lb green beans</b>. Roast to 145°F.', '15 min'], ['Rest 5 minutes. Save 2 chops for tomorrow.', '5 min']],
};
const TAG = { have: ['success', 'On hand'], list: ['neutral', 'On list'], sale: ['sale', 'On sale'] };

function MealDetail({ day, mealId, edit: startEdit, draft }) {
  const a = useApp();
  const s = day ? a.slotOf(day) : null;
  const id = mealId || (s && s.meal);
  const m = draft || a.D.meals[id] || { title: 'Open night', description: 'This meal was taken off the plan.', ingredients: [] };
  const [ings, setIngs] = React.useState(m.ingredients);
  const [editing, setEditing] = React.useState(!!startEdit);
  const [newIng, setNewIng] = React.useState('');
  const [serves, setServes] = React.useState(5);
  const [cooking, setCooking] = React.useState(-1);
  const [rated, setRated] = React.useState(0);
  const steps = (draft && draft.steps) || STEPS[id];
  const status = draft ? 'draft' : s ? s.status : null;
  const dirty = ings !== m.ingredients || serves !== 5;
  const save = () => { setEditing(false); if (s) { a.toast({ tone: 'success', icon: 'check', title: 'Saved', message: 'Marked as edited. The grocery list follows.' }); } };
  const done = steps && cooking >= steps.length;
  return (
    <>
      <Screen bottom={120}>
        <BackHeader title={m.title} onBack={a.pop} right={day && <IconButton icon="ellipsis" label="Change" onClick={() => a.openSheet({ type: 'edit', day })} />} />
        <MealPhoto height={200} radius="var(--radius-m)">{s && <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}><DayTag day={s.day} />{m.onSale && <Badge tone="sale" variant="solid" icon="tag">On sale</Badge>}</div>}</MealPhoto>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
          {status && <SuggestedTag status={status} by={status === 'suggested' || status === 'draft' ? undefined : s.by} style={{ alignSelf: 'flex-start' }} />}
          <h1 style={{ font: '300 30px/1.1 var(--font-serif)', letterSpacing: 'var(--ls-display)', color: 'var(--text-strong)' }}>{m.title}</h1>
          <p style={{ font: 'var(--type-description)', fontSize: 16, color: 'var(--text-body)' }}>{m.description}</p>
          <MealMeta m={m} />
          {draft && <div style={{ display: 'flex', gap: 10, padding: '12px 14px', borderRadius: 'var(--radius-s)', background: 'var(--honey-100)', color: 'var(--honey-700)', font: '400 13px/1.45 var(--font-sans)' }}><Icon name="notebook-pen" size={16} style={{ marginTop: 2 }} /><span>Café wrote this from your description. Check the amounts and steps before cooking it. Nothing is saved until you do.</span></div>}
          {m.healthy && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}><Score label="Healthy" value={m.healthy} /><Score label="Delicious" value={m.delicious} tone="terra" /></div>}
          {m.why && (status === 'suggested' || status === 'edited' || draft) && <Why items={m.why} basis={s && s.basis} />}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '28px 0 12px' }}>
          <h2 style={{ font: '400 22px/1.2 var(--font-serif)', color: 'var(--text-strong)' }}>Ingredients</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {editing && <><IconButton icon="minus" label="Fewer" size="s" variant="secondary" onClick={() => setServes(Math.max(1, serves - 1))} /><span style={{ font: '600 13px/1 var(--font-sans)', minWidth: 58, textAlign: 'center' }}>Serves {serves}</span><IconButton icon="plus" label="More" size="s" variant="secondary" onClick={() => setServes(serves + 1)} /></>}
            {!editing && <Button size="s" variant="ghost" icon="pencil" onClick={() => setEditing(true)}>Edit</Button>}
          </div>
        </div>
        <Card padding="none" style={{ padding: '0 14px' }}>
          {ings.map(([q, n, t], i) => (
            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', borderBottom: i < ings.length - 1 || editing ? '1px solid var(--border-subtle)' : 0 }}>
              <span style={{ flex: 1, minWidth: 0, font: '400 15px/1.35 var(--font-sans)', color: 'var(--text-strong)' }}><b style={{ fontWeight: 650 }}>{q}</b> {n}</span>
              {t && <Badge tone={TAG[t][0]}>{TAG[t][1]}</Badge>}
              {editing && <IconButton icon="x" label={`Remove ${n}`} size="s" onClick={() => setIngs(ings.filter((_, j) => j !== i))} />}
            </div>
          ))}
          {editing && <form onSubmit={e => { e.preventDefault(); if (newIng.trim()) { setIngs([...ings, ['', newIng.trim(), 'list']]); setNewIng(''); } }} style={{ display: 'flex', gap: 8, padding: '12px 0' }}>
            <Input size="s" style={{ flex: 1, minWidth: 0 }} value={newIng} onChange={e => setNewIng(e.target.value)} placeholder="Add an ingredient" />
            <Button size="s" type="submit" variant="secondary" icon="plus">Add</Button>
          </form>}
        </Card>
        {steps && <>
          <SectionHead title="Steps" aside={cooking >= 0 && !done ? `Step ${cooking + 1} of ${steps.length}` : null} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {steps.map(([h, t], i) => <RecipeStep key={i} index={i + 1} done={cooking > i} active={cooking === i} timer={t} onToggle={cooking >= 0 ? () => setCooking(i) : undefined}><span dangerouslySetInnerHTML={{ __html: h }} /></RecipeStep>)}
          </div>
        </>}
        {done && <Card tone="accent" padding="m" style={{ marginTop: 16 }}><div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}><span style={{ font: '400 20px/1.2 var(--font-serif)', color: 'var(--text-strong)' }}>How was it?</span><Stars value={rated} onChange={v => { setRated(v); a.toast({ tone: 'success', icon: 'star', title: `Saved — ${v} stars`, message: 'Joe and Leidy can add theirs.' }); }} size={28} /></div></Card>}
        {m.leftovers && <><SectionHead title="Leftovers" /><div style={{ display: 'flex', gap: 10, font: '400 14px/1.45 var(--font-sans)', color: 'var(--text-body)' }}><Icon name="refresh-cw" size={16} style={{ color: 'var(--sage-600)', marginTop: 2 }} />{m.leftovers}</div></>}
      </Screen>
      <BottomBar>
        {editing ? <><Button variant="secondary" style={{ flex: 1 }} onClick={() => { setIngs(m.ingredients); setServes(5); setEditing(false); }}>Cancel</Button><Button style={{ flex: 1.4 }} icon="check" disabled={!dirty} onClick={save}>Save changes</Button></>
          : draft ? <><Button variant="secondary" style={{ flex: 1 }} icon="x" onClick={a.pop}>Discard</Button><Button variant="accent" style={{ flex: 1.4 }} icon="book-open" onClick={() => { a.addRecipe({ id: 'new' + Date.now(), title: m.title, stars: 0, method: m.method, time: m.time, last: 'Never', tags: ['New'] }); a.pop(); }}>Save to recipe box</Button></>
          : s && s.status === 'suggested' ? <ReviewActions style={{ flex: 1 }} onReject={() => a.openSheet({ type: 'reject', day })} onSwap={() => a.openSheet({ type: 'swap', day })} onApprove={() => a.keep(day)} />
          : steps && cooking >= 0 && !done ? <><Button variant="secondary" icon="arrow-left" style={{ flex: 1 }} disabled={cooking === 0} onClick={() => setCooking(cooking - 1)}>Back</Button><Button style={{ flex: 1.4 }} iconRight="arrow-right" onClick={() => setCooking(cooking + 1)}>{cooking === steps.length - 1 ? 'Done cooking' : 'Next step'}</Button></>
          : !day && id ? <>{a.slots.some(x => x.meal === id)
              ? <Button variant="secondary" icon="calendar-days" style={{ flex: 1 }} disabled>On this week</Button>
              : a.queue.some(q => q.meal === id)
              ? <Button variant="secondary" icon="check" style={{ flex: 1 }} onClick={() => { a.queueRemove(id); a.toast({ icon: 'x', title: 'Removed from Up next' }); }}>In Up next</Button>
              : <Button variant="secondary" icon="plus" style={{ flex: 1 }} onClick={() => a.queueAdd(id)}>Add to Up next</Button>}
            <Button icon="calendar-days" style={{ flex: 1 }} onClick={() => a.openSheet({ type: 'schedule', meal: id })}>Put on a night</Button></>
          : <Button size="l" fullWidth icon="chef-hat" disabled={!steps || done} onClick={() => setCooking(0)}>{done ? 'Enjoy dinner' : steps ? 'Start cooking' : 'Full steps in the recipe box'}</Button>}
      </BottomBar>
    </>
  );
}
window.MealDetail = MealDetail;
})();
