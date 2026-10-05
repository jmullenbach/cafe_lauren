(() => {
const { Button, Badge, DayTag, Avatar, AvatarStack, SuggestedTag, Card, Icon } = window.CafeLaurenDesignSystem_9f0e0a;
const DAYNAME = { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday' };
const slotTitle = (a, s) => s.meal ? a.D.meals[s.meal].title : s.text || (s.kind === 'open' ? 'Open night' : '');

function needs(a) {
  const n = [];
  const pend = a.slots.filter(s => s.kind === 'cook' && s.status === 'suggested');
  if (pend.length) n.push({ icon: 'sparkles', color: 'var(--sage-700)', title: `${pend.length} suggested meal${pend.length > 1 ? 's' : ''} to review`, sub: pend.map(s => DAYNAME[s.day]).join(', '), go: () => a.setTab('plan') });
  if (!a.pantryDone) n.push({ icon: 'refrigerator', color: 'var(--honey-700)', title: 'Check what Café found in the pantry', sub: '2 items it wasn\'t sure about', go: () => a.push({ type: 'pantry' }) });
  const req = a.requests.filter(r => r.status === 'new');
  if (req.length) n.push({ icon: 'message-circle', color: 'var(--slate-500)', title: `${req.length} new request${req.length > 1 ? 's' : ''}`, sub: req.map(r => a.D.people[r.who].name).filter((v, i, x) => x.indexOf(v) === i).join(', '), go: () => a.setTab('inbox') });
  if (a.diff.length) n.push({ icon: 'shopping-basket', color: 'var(--terra-500)', title: 'Plan changed since approval', sub: 'Review the grocery list changes', go: () => a.setTab('list') });
  if (a.order === 'shopping' && a.sub === 'pending') n.push({ icon: 'refresh-cw', color: 'var(--terra-500)', title: 'Shopper needs a decision', sub: 'Queso fresco is out', go: () => a.push({ type: 'track' }) });
  return n;
}

function NeedsCard({ items }) {
  if (!items.length) return <Card tone="accent" padding="m"><div style={{ display: 'flex', gap: 10, alignItems: 'center', font: '500 14px/1.4 var(--font-sans)', color: 'var(--sage-900)' }}><Icon name="circle-check" size={20} />Nothing needs you right now.</div></Card>;
  return <Card padding="none" style={{ padding: '0 16px' }}>{items.map((n, i) => <ListRow key={n.title} icon={n.icon} iconColor={n.color} title={n.title} sub={n.sub} onClick={n.go} last={i === items.length - 1} />)}</Card>;
}

function WeekMini({ a }) {
  return (
    <Card padding="none" style={{ padding: '0 16px' }}>
      {a.slots.map((s, i) => (
        <div key={s.day} onClick={() => s.meal && a.push({ type: 'meal', day: s.day })} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < 6 ? '1px solid var(--border-subtle)' : 0, cursor: s.meal ? 'pointer' : 'default' }}>
          <DayTag day={s.day} short style={{ width: 44, justifyContent: 'center' }} />
          <span style={{ flex: 1, minWidth: 0, font: s.kind === 'cook' ? '400 15px/1.3 var(--font-serif)' : 'italic 400 14px/1.3 var(--font-serif)', color: s.kind === 'cook' ? 'var(--text-strong)' : 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{slotTitle(a, s)}</span>
          {s.kind === 'cook' && s.status !== 'approved' && s.status !== 'kept' && <SuggestedTag status={s.status} label={s.status === 'edited' ? 'Edited' : undefined} />}
          {(s.status === 'approved' || s.status === 'kept') && <Icon name="check" size={16} style={{ color: 'var(--sage-600)' }} />}
        </div>
      ))}
    </Card>
  );
}

function Tonight({ a, compact }) {
  const s = a.slotOf('wed'); const m = s.meal && a.D.meals[s.meal];
  if (!m) return <Card tone="sunken"><span style={{ font: 'italic 400 16px/1.4 var(--font-serif)', color: 'var(--text-muted)' }}>{slotTitle(a, s) || 'Nothing planned tonight'}</span></Card>;
  if (compact) return <Card padding="none" style={{ padding: '0 16px' }}><ListRow icon="chef-hat" iconColor="var(--terra-500)" title={m.title} sub={`Tonight · ${m.method} · ${m.time}`} onClick={() => a.push({ type: 'meal', day: 'wed' })} last /></Card>;
  return (
    <Card padding="none">
      <MealPhoto height={150} radius="0"><div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}><DayTag day="wed" label="Tonight" />{m.onSale && <Badge tone="sale" variant="solid" icon="tag">On sale</Badge>}</div></MealPhoto>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <h3 style={{ font: '400 22px/1.2 var(--font-serif)', color: 'var(--text-strong)' }}>{m.title}</h3>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: '500 13px/1 var(--font-sans)', color: 'var(--text-body)' }}><Icon name="clock" size={15} style={{ color: 'var(--text-muted)' }} />Start by 5:20 for dinner at 6</span>
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <Button variant="secondary" icon="refresh-cw" style={{ flex: 1 }} onClick={() => a.openSheet({ type: 'swap', day: 'wed' })}>Swap</Button>
          <Button icon="chef-hat" style={{ flex: 1.4 }} onClick={() => a.push({ type: 'meal', day: 'wed' })}>Start cooking</Button>
        </div>
      </div>
    </Card>
  );
}

function HomeA() {
  const a = useApp();
  return (
    <Screen>
      <LargeTitle overline="Wednesday, Aug 26" title={`Good afternoon, ${a.P.name}`} right={<Avatar {...a.P} size={30} />} />
      <Tonight a={a} />
      <SectionHead title="Needs you" />
      <NeedsCard items={needs(a)} />
      <SectionHead title="This week" aside="Edit plan" onAside={() => a.setTab('plan')} />
      <WeekMini a={a} />
      <SectionHead title="Delivery" />
      <Card padding="none" style={{ padding: '0 16px' }}><ListRow icon="truck" iconColor={a.order ? 'var(--sage-700)' : undefined} title={a.order ? 'Saturday, 9–11am' : 'Not ordered yet'} sub={a.order ? `${a.via.label} · ${a.store.name}` : 'Usually Saturday morning'} onClick={() => a.order ? a.push({ type: 'track' }) : a.setTab('list')} last /></Card>
    </Screen>
  );
}

const STAGES = [['Gather', 'message-circle'], ['Plan', 'calendar-days'], ['List', 'shopping-basket'], ['Order', 'truck'], ['Cook', 'chef-hat']];
function HomeB() {
  const a = useApp();
  const done = [a.pantryDone, !!a.approved, !!a.order, a.order === 'delivered', false];
  const cur = done.findIndex(d => !d);
  const pend = a.slots.filter(s => s.kind === 'cook' && s.status === 'suggested').length;
  const stage = [
    { title: 'Check the pantry', body: "Café read today's photos. Confirm what's really there so we don't double-buy.", cta: 'Review pantry', go: () => a.push({ type: 'pantry' }) },
    { title: pend ? `${pend} meal${pend > 1 ? 's' : ''} still need a decision` : 'Ready to approve', body: pend ? 'Keep them, swap them, or tell Café why not.' : 'Everyone has weighed in. Approve to build the list.', cta: pend ? 'Review the plan' : 'Approve week', go: () => pend ? a.setTab('plan') : a.approveWeek() },
    { title: 'Send the list to Instacart', body: 'Check the product matches, then pick a delivery window.', cta: 'Review order', go: () => a.push({ type: 'order' }) },
    { title: 'Groceries on the way', body: 'Saturday, 9–11am. You may get a substitution question.', cta: 'Track order', go: () => a.push({ type: 'track' }) },
    { title: "Tonight's dinner", body: 'Sheet Pan Pork Chops, 40 min.', cta: 'Start cooking', go: () => a.push({ type: 'meal', day: 'wed' }) },
  ][cur];
  const P = a.D.people;
  const feed = [
    { who: P.joe, text: 'kept Basil Shrimp for Friday', when: '2h' },
    { who: P.leidy, text: 'is out of cornstarch and the big yogurt', when: 'Tue' },
    { who: P.joe, text: 'voted no on Citrus Chicken: “Had chicken twice already”', when: 'Tue' },
  ];
  return (
    <Screen>
      <LargeTitle overline="Café Lauren" title={a.D.week} right={<AvatarStack people={Object.values(P)} size={26} />} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4, marginBottom: 16 }}>
        {STAGES.map(([l, ic], i) => (
          <div key={l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <span style={{ width: '100%', height: 4, borderRadius: 2, background: done[i] ? 'var(--sage-500)' : i === cur ? 'var(--char-900)' : 'var(--linen-300)' }} />
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, font: `${i === cur ? 700 : 500} 11px/1 var(--font-sans)`, color: i === cur ? 'var(--text-strong)' : done[i] ? 'var(--sage-700)' : 'var(--text-faint)' }}>{done[i] && <Icon name="check" size={11} stroke={2.5} />}{l}</span>
          </div>
        ))}
      </div>
      <Card padding="l" elevation="raised">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: 'var(--type-overline)', letterSpacing: 'var(--ls-overline)', textTransform: 'uppercase', color: 'var(--sage-700)' }}><Icon name={STAGES[cur][1]} size={14} />Step {cur + 1} of 5</span>
          <h2 style={{ font: '400 26px/1.15 var(--font-serif)', color: 'var(--text-strong)' }}>{stage.title}</h2>
          <p style={{ font: '400 14px/1.5 var(--font-sans)', color: 'var(--text-body)' }}>{stage.body}</p>
          <Button size="l" fullWidth iconRight="arrow-right" onClick={stage.go} style={{ marginTop: 6 }}>{stage.cta}</Button>
        </div>
      </Card>
      <SectionHead title="Tonight" />
      <Tonight a={a} compact />
      <SectionHead title="Around the house" aside="Inbox" onAside={() => a.setTab('inbox')} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {feed.map((f, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: i < feed.length - 1 ? '1px solid var(--border-subtle)' : 0 }}>
            <Avatar {...f.who} size={30} />
            <span style={{ flex: 1, font: '400 14px/1.45 var(--font-sans)', color: 'var(--text-body)' }}><b style={{ color: 'var(--text-strong)', fontWeight: 600 }}>{f.who.name}</b> {f.text}</span>
            <span style={{ font: '500 12px/1.6 var(--font-sans)', color: 'var(--text-faint)' }}>{f.when}</span>
          </div>
        ))}
      </div>
    </Screen>
  );
}
Object.assign(window, { HomeA, HomeB, slotTitle, DAYNAME });
})();
