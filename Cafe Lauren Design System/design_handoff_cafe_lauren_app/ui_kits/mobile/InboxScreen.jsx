(() => {
const { Button, IconButton, Badge, Avatar, Input, ChoiceChips, SegmentedControl, PhotoTile, SuggestedTag, Card, Icon } = window.CafeLaurenDesignSystem_9f0e0a;

function RequestRow({ a, r, last }) {
  const p = a.D.people[r.who];
  const isNew = r.status === 'new';
  return (
    <div style={{ display: 'flex', gap: 12, padding: '14px 0', borderBottom: last ? 0 : '1px solid var(--border-subtle)' }}>
      <Avatar {...p} size={32} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
          <span style={{ flex: 1, font: '600 13px/1 var(--font-sans)', color: 'var(--text-strong)' }}>{p.name}</span>
          <span style={{ font: '500 12px/1 var(--font-sans)', color: 'var(--text-faint)' }}>{r.when}</span>
        </div>
        <span style={{ font: '400 15px/1.45 var(--font-sans)', color: 'var(--text-strong)' }}>{r.text}</span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          <Badge tone={r.type === 'meal' ? 'accent' : 'warning'} icon={r.type === 'meal' ? 'sparkles' : 'package'}>{r.type === 'meal' ? 'Meal idea' : 'Ran out'}</Badge>
          {r.reply && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, font: '500 12px/1 var(--font-sans)', color: r.status === 'declined' ? 'var(--terra-700)' : 'var(--sage-700)' }}><Icon name={r.status === 'declined' ? 'x' : 'check'} size={13} stroke={2} />{r.reply}</span>}
        </div>
        {isNew && <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <Button size="s" variant="secondary" icon="x" onClick={() => a.answerRequest(r.id, 'declined', 'Not this week')}>Not this week</Button>
          <Button size="s" variant="accent" icon="check" onClick={() => { a.answerRequest(r.id, 'planned', r.type === 'meal' ? 'Café will work it in' : 'Added to the list'); a.toast({ tone: 'success', icon: 'check', title: r.type === 'meal' ? 'Café will suggest it' : 'Added to the list', message: `${p.name} will see the reply.` }); }}>{r.type === 'meal' ? 'Add to plan' : 'Add to list'}</Button>
        </div>}
      </div>
    </div>
  );
}

function InboxScreen() {
  const a = useApp();
  const [seg, setSeg] = React.useState('requests');
  const [type, setType] = React.useState('meal');
  const [text, setText] = React.useState('');
  const fresh = a.requests.filter(r => r.status === 'new');
  const old = a.requests.filter(r => r.status !== 'new');
  const unsure = a.pantry.filter(p => p.state === 'unsure').length;
  return (
    <Screen>
      <LargeTitle overline={a.D.week} title="Inbox" />
      <SegmentedControl value={seg} onChange={setSeg} options={[{ value: 'requests', label: `Requests${fresh.length ? ' · ' + fresh.length : ''}` }, { value: 'pantry', label: 'Pantry' }]} style={{ display: 'flex', marginBottom: 20 }} />
      {seg === 'requests' ? <>
        <Card padding="m">
          <form onSubmit={e => { e.preventDefault(); if (text.trim()) { a.addRequest({ type, text: text.trim() }); setText(''); } }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <ChoiceChips size="s" multi={false} value={type} onChange={v => v && setType(v)} options={[{ value: 'meal', label: 'Meal idea', icon: 'sparkles' }, { value: 'out', label: "We're out of", icon: 'package' }]} />
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <Input style={{ flex: 1, minWidth: 0 }} value={text} onChange={e => setText(e.target.value)} placeholder={type === 'meal' ? 'Something with salmon?' : 'Cornstarch, the big yogurt…'} />
              <IconButton icon="send" label="Send" variant="primary" type="submit" onClick={() => { if (text.trim()) { a.addRequest({ type, text: text.trim() }); setText(''); } }} />
            </div>
          </form>
        </Card>
        {fresh.length > 0 && <><SectionHead title="New" /><div>{fresh.map((r, i) => <RequestRow key={r.id} a={a} r={r} last={i === fresh.length - 1} />)}</div></>}
        <SectionHead title="Answered" />
        <div>{old.map((r, i) => <RequestRow key={r.id} a={a} r={r} last={i === old.length - 1} />)}</div>
      </> : <>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {a.D.photos.map(p => <PhotoTile key={p.src} {...p} aspect="1 / 1" />)}
          <PhotoTile empty aspect="1 / 1" label="Add photo" onClick={() => a.toast({ icon: 'camera', title: 'Camera would open here' })} />
        </div>
        <Card padding="m" tone={a.pantryDone ? 'accent' : 'default'} style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {a.pantryDone
              ? <span style={{ display: 'flex', gap: 8, alignItems: 'center', font: '500 14px/1.4 var(--font-sans)', color: 'var(--sage-900)' }}><Icon name="circle-check" size={18} />Confirmed by {a.P.name} today</span>
              : <><SuggestedTag label={`Café found ${a.pantry.length} items`} style={{ alignSelf: 'flex-start' }} />
                <span style={{ font: '400 14px/1.45 var(--font-sans)', color: 'var(--text-body)' }}>{unsure} it wasn't sure about. A quick check keeps them off the grocery list.</span></>}
            <Button variant={a.pantryDone ? 'secondary' : 'primary'} icon="refrigerator" onClick={() => a.push({ type: 'pantry' })}>{a.pantryDone ? 'View inventory' : 'Review what it found'}</Button>
          </div>
        </Card>
      </>}
    </Screen>
  );
}

function PantryRow({ a, p, last }) {
  const [edit, setEdit] = React.useState(false);
  const [name, setName] = React.useState(p.name.replace('?', ''));
  const [qty, setQty] = React.useState(p.qty);
  const gone = p.state === 'removed';
  if (edit) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 0', borderBottom: last ? 0 : '1px solid var(--border-subtle)' }}>
      <div style={{ display: 'flex', gap: 8 }}><Input size="s" style={{ flex: 2, minWidth: 0 }} value={name} onChange={e => setName(e.target.value)} /><Input size="s" style={{ flex: 1, minWidth: 0 }} value={qty} onChange={e => setQty(e.target.value)} placeholder="Amount" /></div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}><Button size="s" variant="ghost" onClick={() => setEdit(false)}>Cancel</Button><Button size="s" icon="check" onClick={() => { a.setPantryItem(p.id, { name, qty, state: 'confirmed', edited: true }); setEdit(false); }}>Save</Button></div>
    </div>
  );
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', borderBottom: last ? 0 : '1px solid var(--border-subtle)', opacity: gone ? 0.5 : 1 }}>
      <div onClick={() => !gone && setEdit(true)} style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4, cursor: gone ? 'default' : 'pointer' }}>
        <span style={{ font: '500 15px/1.3 var(--font-sans)', color: 'var(--text-strong)', textDecoration: gone ? 'line-through' : 'none' }}>{p.name}{p.qty && <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}> · {p.qty}</span>}</span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {p.state === 'unsure' && <Badge tone="warning">Not sure</Badge>}
          {p.state === 'confirmed' && <SuggestedTag status={p.edited || p.added ? 'edited' : 'kept'} label={p.added ? 'Added by you' : p.edited ? 'Fixed' : 'Confirmed'} />}
          {p.note && p.state === 'unsure' && <span style={{ font: '400 12px/1.3 var(--font-sans)', color: 'var(--text-muted)' }}>{p.note}</span>}
        </div>
      </div>
      {gone ? <Button size="s" variant="ghost" onClick={() => a.setPantryItem(p.id, { state: 'found' })}>Undo</Button> : <>
        <IconButton icon="x" label="Not there" size="s" variant="secondary" round onClick={() => a.setPantryItem(p.id, { state: 'removed' })} />
        <IconButton icon="check" label="Yes, we have it" size="s" variant={p.state === 'confirmed' ? 'accent' : 'secondary'} round onClick={() => a.setPantryItem(p.id, { state: 'confirmed' })} />
      </>}
    </div>
  );
}

function AddPantryRow({ a, area }) {
  const [open, setOpen] = React.useState(false);
  const [n, setN] = React.useState('');
  const [q, setQ] = React.useState('');
  const add = e => { e.preventDefault(); if (!n.trim()) return; a.addPantryItem(n.trim(), area, q.trim()); setN(''); setQ(''); setOpen(false); };
  if (!open) return (
    <button type="button" onClick={() => setOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', minHeight: 48, padding: '0', border: 0, borderTop: '1px solid var(--border-subtle)', background: 'none', cursor: 'pointer', color: 'var(--sage-700)', font: '600 14px/1 var(--font-sans)' }}>
      <Icon name="plus" size={18} />Add to {area.toLowerCase()}
    </button>
  );
  return (
    <form onSubmit={add} style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 0', borderTop: '1px solid var(--border-subtle)' }}>
      <div style={{ display: 'flex', gap: 8 }}><Input size="s" style={{ flex: 2, minWidth: 0 }} value={n} onChange={e => setN(e.target.value)} placeholder="What is it?" /><Input size="s" style={{ flex: 1, minWidth: 0 }} value={q} onChange={e => setQ(e.target.value)} placeholder="Amount" /></div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}><Button size="s" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button size="s" type="submit" icon="plus" disabled={!n.trim()}>Add</Button></div>
    </form>
  );
}

function PantryReview() {
  const a = useApp();
  const [n, setN] = React.useState('');
  const [area, setArea] = React.useState('Pantry');
  const areas = [...new Set(a.pantry.map(p => p.area))];
  const keep = a.pantry.filter(p => p.state !== 'removed').length;
  const unsure = a.pantry.filter(p => p.state === 'unsure').length;
  return (
    <>
      <Screen bottom={120}>
        <BackHeader title="What's on hand" onBack={a.pop} />
        <p style={{ font: '400 14px/1.5 var(--font-sans)', color: 'var(--text-body)', margin: '8px 0 4px' }}>Café read {a.D.photos.length} photos from today. Tap anything to fix it, or mark what isn't really there.</p>
        {areas.map(ar => { const items = a.pantry.filter(p => p.area === ar); return (
          <div key={ar}><SectionHead title={ar} aside={`${items.length} items`} />
            <Card padding="none" style={{ padding: '0 14px' }}>{items.map(p => <PantryRow key={p.id} a={a} p={p} />)}<AddPantryRow a={a} area={ar} /></Card></div>); })}
        <SectionHead title="Anything it missed?" />
        <form onSubmit={e => { e.preventDefault(); if (n.trim()) { a.addPantryItem(n.trim(), area); setN(''); } }} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <ChoiceChips size="s" multi={false} value={area} onChange={v => v && setArea(v)} options={['Pantry', 'Fridge', 'Freezer', 'Counter']} />
          <div style={{ display: 'flex', gap: 8 }}><Input style={{ flex: 1, minWidth: 0 }} value={n} onChange={e => setN(e.target.value)} placeholder="Half a bag of rice" /><Button type="submit" variant="secondary" icon="plus">Add</Button></div>
        </form>
      </Screen>
      <BottomBar><Button size="l" variant="accent" fullWidth icon="check" onClick={a.confirmPantry}>{unsure ? `Confirm ${keep} items (${unsure} unsure)` : `Confirm ${keep} items`}</Button></BottomBar>
    </>
  );
}
Object.assign(window, { InboxScreen, PantryReview });
})();
