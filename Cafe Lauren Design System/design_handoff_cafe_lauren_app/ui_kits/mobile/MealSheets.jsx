(() => {
const { Sheet, Button, ChoiceChips, Input, Switch, Badge, Icon, Card } = window.CafeLaurenDesignSystem_9f0e0a;
const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const RB = { soup: 'soup', meatballs: 'meatballs', shrimp: 'shrimp', tacos: 'tacos' };

function OptionCard({ m, onUse, basis }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 14, borderRadius: 'var(--radius-m)', background: 'var(--surface-card)', border: '1px dashed var(--sage-300)' }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <span style={{ flex: 1, font: '400 18px/1.2 var(--font-serif)', color: 'var(--text-strong)' }}>{m.title}</span>
        {m.onSale && <Badge tone="sale" icon="tag">Sale</Badge>}
      </div>
      <span style={{ font: '500 12.5px/1 var(--font-sans)', color: 'var(--text-muted)' }}>{m.method} · {m.time} · {m.cost}</span>
      <span style={{ display: 'flex', gap: 6, font: '400 13px/1.4 var(--font-sans)', color: 'var(--sage-900)' }}><Icon name="sparkles" size={13} style={{ color: 'var(--sage-600)', marginTop: 3 }} />{basis ? `${basis}: ` : ''}{m.why[0]}</span>
      <Button size="s" variant="secondary" icon="check" onClick={onUse} style={{ alignSelf: 'flex-start' }}>Use this</Button>
    </div>
  );
}

function SwapSheet({ open, day }) {
  const a = useApp();
  const [prefs, setPrefs] = React.useState([]);
  const [note, setNote] = React.useState('');
  const [phase, setPhase] = React.useState('ready');
  React.useEffect(() => { if (open) { setPrefs([]); setNote(''); setPhase('ready'); } }, [open, day]);
  if (!day) return <Sheet open={false} />;
  const s = a.slotOf(day); const cur = s.meal && a.D.meals[s.meal];
  const used = a.slots.map(x => x.meal);
  let opts = a.D.alternatives.filter(id => !used.includes(id));
  if (prefs.includes('Quicker') || prefs.includes('Use what we have')) opts = [...opts].sort((x, y) => parseInt(a.D.meals[x].time) - parseInt(a.D.meals[y].time));
  if (prefs.includes('Cheaper')) opts = [...opts].sort((x, y) => parseInt(a.D.meals[x].cost.slice(2)) - parseInt(a.D.meals[y].cost.slice(2)));
  if (prefs.includes('Weekly specials')) opts = [...opts].sort((x, y) => (a.D.meals[y].onSale ? 1 : 0) - (a.D.meals[x].onSale ? 1 : 0));
  const basis = [...prefs, note].filter(Boolean).join(' · ');
  const refine = () => { setPhase('thinking'); setTimeout(() => setPhase('ready'), 900); };
  return (
    <Sheet open={open} onClose={a.closeSheet} title={`Swap ${DAYNAME[day]}`} subtitle={cur ? `Instead of ${cur.title}` : 'Pick something for this night'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <ChoiceChips size="s" value={prefs} onChange={p => { setPrefs(p); refine(); }} options={a.D.swapPrefs} />
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <Input style={{ flex: 1, minWidth: 0 }} value={note} onChange={e => setNote(e.target.value)} placeholder="Or say it: “use the freezer meatballs”" />
          <Button variant="secondary" icon="sparkles" onClick={refine} disabled={!note}>Ask</Button>
        </div>
        <span style={{ font: 'var(--type-overline)', letterSpacing: 'var(--ls-overline)', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: 4 }}>Café's options</span>
        {phase === 'thinking'
          ? <div style={{ padding: 16, borderRadius: 'var(--radius-m)', background: 'var(--sage-50)', font: '500 14px/1.4 var(--font-sans)', color: 'var(--sage-700)', display: 'flex', gap: 8, alignItems: 'center' }}><Icon name="sparkles" size={16} />Looking at deals and the pantry…</div>
          : opts.slice(0, 3).map(id => <OptionCard key={id} m={a.D.meals[id]} basis={basis} onUse={() => a.swap(day, id, basis)} />)}
        {a.queue.filter(q => !used.includes(q.meal)).length > 0 && <><span style={{ font: 'var(--type-overline)', letterSpacing: 'var(--ls-overline)', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: 8 }}>Up next</span>
        <Card padding="none" style={{ padding: '0 14px' }}>{a.queue.filter(q => !used.includes(q.meal)).map((q, i, arr) => <ListRow key={q.meal} icon="list" iconColor="var(--sage-700)" title={a.D.meals[q.meal].title} sub={`Queued by ${q.by}`} onClick={() => a.swap(day, q.meal, 'From Up next')} last={i === arr.length - 1} />)}</Card></>}
        <span style={{ font: 'var(--type-overline)', letterSpacing: 'var(--ls-overline)', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: 8 }}>From the recipe box</span>
        <Card padding="none" style={{ padding: '0 14px' }}>
          {a.recipes.filter(r => RB[r.id] && !used.includes(RB[r.id])).slice(0, 3).map((r, i, arr) => <ListRow key={r.id} title={r.title} sub={`${r.method} · ${r.time} · last made ${r.last}`} onClick={() => a.swap(day, RB[r.id], 'Picked from the recipe box')} last={i === arr.length - 1} />)}
        </Card>
        <span style={{ font: 'var(--type-overline)', letterSpacing: 'var(--ls-overline)', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: 8 }}>Or make it</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[['refresh-cw', 'Leftovers night'], ['chef-hat', 'Leidy cooks'], ['utensils', 'Eating out']].map(([ic, t]) => <Button key={t} size="s" variant="secondary" icon={ic} onClick={() => { a.setText(day, t); a.closeSheet(); a.toast({ icon: ic, title: `${DAYNAME[day]}: ${t}` }); }}>{t}</Button>)}
        </div>
      </div>
    </Sheet>
  );
}

function ScheduleSheet({ open, meal }) {
  const a = useApp();
  if (!meal) return <Sheet open={false} />;
  const m = a.D.meals[meal];
  return (
    <Sheet open={open} onClose={a.closeSheet} title="Put on a night" subtitle={m.title + ' replaces what\'s planned. Votes reset for that night.'}>
      <Card padding="none" style={{ padding: '0 14px' }}>
        {a.slots.map((s, i) => <ListRow key={s.day} title={DAYNAME[s.day]} sub={slotTitle(a, s)} onClick={() => a.swap(s.day, meal, 'Picked from the recipe box')} last={i === 6} />)}
      </Card>
    </Sheet>
  );
}

function RejectSheet({ open, day }) {
  const a = useApp();
  const [why, setWhy] = React.useState([]);
  const [note, setNote] = React.useState('');
  const [remember, setRemember] = React.useState(true);
  React.useEffect(() => { if (open) { setWhy([]); setNote(''); } }, [open, day]);
  if (!day) return <Sheet open={false} />;
  const s = a.slotOf(day); const m = s.meal && a.D.meals[s.meal];
  return (
    <Sheet open={open} onClose={a.closeSheet} title={m ? `Not ${m.title.split(' with ')[0]}?` : 'Not this?'} subtitle="Tell Café why. It's fine to skip this, but a reason makes the next idea better."
      footer={<><Button variant="secondary" style={{ flex: 1 }} onClick={() => a.reject(day, why, note, 'open')}>Leave night open</Button><Button icon="sparkles" style={{ flex: 1.2 }} onClick={() => a.reject(day, why, note, 'another')}>Suggest another</Button></>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <ChoiceChips value={why} onChange={setWhy} options={a.D.rejectReasons} />
        <Input multiline rows={2} value={note} onChange={e => setNote(e.target.value)} placeholder="Anything else? “We had pork twice already”" />
        <Switch checked={remember} onChange={setRemember} label="Remember this" description="Café will weigh it in future weeks. You can see and clear these in settings." />
      </div>
    </Sheet>
  );
}

function EditMealSheet({ open, day }) {
  const a = useApp();
  if (!day) return <Sheet open={false} />;
  const s = a.slotOf(day);
  const title = slotTitle(a, s);
  const cook = s.cook || (s.kind === 'leidy' ? 'Leidy' : 'Lauren');
  return (
    <Sheet open={open} onClose={a.closeSheet} title={`Change ${DAYNAME[day]}`} subtitle={title}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div><span style={{ display: 'block', font: '600 13px/1 var(--font-sans)', color: 'var(--text-strong)', marginBottom: 10 }}>Move to another day</span>
          <ChoiceChips size="s" multi={false} value={day} onChange={to => to && to !== day && a.moveSlot(day, to)} options={DAYS.map(d => ({ value: d, label: DAYNAME[d].slice(0, 3) }))} /></div>
        {s.kind === 'cook' && <div><span style={{ display: 'block', font: '600 13px/1 var(--font-sans)', color: 'var(--text-strong)', marginBottom: 10 }}>Who's cooking</span>
          <ChoiceChips size="s" multi={false} value={cook} onChange={w => w && a.setCook(day, w)} options={['Lauren', 'Joe', 'Leidy']} /></div>}
        <Card padding="none" style={{ padding: '0 14px' }}>
          <ListRow icon="refresh-cw" title="Swap for a different meal" onClick={() => a.openSheet({ type: 'swap', day })} />
          {s.meal && <ListRow icon="pencil" title="Edit ingredients or servings" onClick={() => { a.closeSheet(); a.push({ type: 'meal', day, edit: true }); }} />}
          <ListRow icon="refresh-cw" title="Make it a leftovers night" onClick={() => { a.setText(day, 'Leftovers night'); a.closeSheet(); }} />
          {s.meal && <ListRow icon="x" iconColor="var(--terra-500)" title="Take it off the plan" sub="Tell Café why" onClick={() => a.openSheet({ type: 'reject', day })} last />}
        </Card>
      </div>
    </Sheet>
  );
}
Object.assign(window, { SwapSheet, RejectSheet, EditMealSheet, ScheduleSheet });
})();
