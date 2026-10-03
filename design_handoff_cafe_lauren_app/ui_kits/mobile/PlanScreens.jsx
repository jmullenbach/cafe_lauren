(() => {
const { Button, IconButton, Badge, DayTag, SuggestedTag, ReviewActions, VoteButtons, Score, Card, Icon } = window.CafeLaurenDesignSystem_9f0e0a;

function Meta({ m }) {
  return <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px' }}>{[['cooking-pot', m.method], ['clock', m.time], ['receipt', m.cost]].map(([i, t]) => <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, font: '500 12.5px/1 var(--font-sans)', color: 'var(--text-body)' }}><Icon name={i} size={14} style={{ color: 'var(--text-muted)' }} />{t}</span>)}</div>;
}
function Votes({ a, s }) {
  const v = s.votes || {}; const vals = Object.values(v);
  return <VoteButtons value={v[a.user] || null} onChange={x => a.vote(s.day, x)} up={vals.filter(x => x === 'up').length} down={vals.filter(x => x === 'down').length} voters={Object.keys(v).map(k => a.D.people[k])} />;
}
function Thinking({ basis }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '6px 0' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, font: '500 14px/1.4 var(--font-sans)', color: 'var(--sage-700)' }}><Icon name="sparkles" size={16} />Finding something else…</span>
      {basis && <span style={{ font: '400 13px/1.4 var(--font-sans)', color: 'var(--text-muted)' }}>Working from: “{basis}”</span>}
      {[80, 60].map(w => <span key={w} style={{ height: 10, width: w + '%', borderRadius: 3, background: 'var(--linen-200)' }} />)}
    </div>
  );
}

function SlotCard({ a, s }) {
  const m = s.meal && a.D.meals[s.meal];
  if (s.kind !== 'cook') return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 'var(--radius-card)', background: s.kind === 'open' ? 'transparent' : 'var(--surface-sunken)', border: s.kind === 'open' ? '1.5px dashed var(--border-strong)' : '1px solid transparent' }}>
      <DayTag day={s.day} short style={{ width: 44, justifyContent: 'center' }} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span style={{ font: 'italic 400 15px/1.3 var(--font-serif)', color: s.kind === 'open' ? 'var(--text-strong)' : 'var(--text-body)' }}>{slotTitle(a, s)}</span>
        {s.kind === 'open' && s.basis && <span style={{ font: '400 12px/1.3 var(--font-sans)', color: 'var(--text-muted)' }}>Not this week: {s.basis}</span>}
        {s.kind === 'leidy' && <span style={{ font: '400 12px/1.3 var(--font-sans)', color: 'var(--text-muted)' }}>Waiting on what she's making</span>}
      </div>
      <Button size="s" variant={s.kind === 'open' ? 'primary' : 'ghost'} onClick={() => a.openSheet({ type: s.kind === 'open' ? 'swap' : 'edit', day: s.day })}>{s.kind === 'open' ? 'Pick a meal' : 'Change'}</Button>
    </div>
  );
  const review = s.status === 'suggested';
  return (
    <Card padding="none" selected={review} style={review ? { borderStyle: 'dashed', borderColor: 'var(--sage-300)', boxShadow: 'none' } : undefined}>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <DayTag day={s.day} />
          <SuggestedTag status={s.status} by={s.status === 'suggested' ? undefined : s.by} />
          <span style={{ flex: 1 }} />
          {!review && s.status !== 'thinking' && <IconButton icon="ellipsis" label="Change" size="s" onClick={() => a.openSheet({ type: 'edit', day: s.day })} />}
        </div>
        {s.status === 'thinking' ? <Thinking basis={s.basis} /> : <>
          <div onClick={() => a.push({ type: 'meal', day: s.day })} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <h3 style={{ font: '400 20px/1.2 var(--font-serif)', color: 'var(--text-strong)' }}>{m.title}</h3>
            <p style={{ font: 'italic 400 14px/1.4 var(--font-serif)', color: 'var(--text-body)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{m.description}</p>
          </div>
          <Meta m={m} />
          {review && <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', font: '400 13px/1.4 var(--font-sans)', color: 'var(--sage-900)' }}><Icon name="sparkles" size={14} style={{ color: 'var(--sage-600)', marginTop: 2 }} /><span>{s.basis ? `For “${s.basis}”: ` : ''}{m.why.slice(0, 2).join(' · ')}</span></div>}
          <div style={{ paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
            {review ? <ReviewActions size="s" onReject={() => a.openSheet({ type: 'reject', day: s.day })} onSwap={() => a.openSheet({ type: 'swap', day: s.day })} onApprove={() => a.keep(s.day)} /> : <Votes a={a} s={s} />}
          </div>
        </>}
      </div>
    </Card>
  );
}

function ApproveBar({ a }) {
  const pend = a.slots.filter(s => s.kind === 'cook' && s.status === 'suggested').length;
  if (a.approved) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 'var(--radius-m)', background: 'var(--sage-50)', marginBottom: 16 }}>
      <Icon name="circle-check" size={20} style={{ color: 'var(--sage-600)' }} />
      <span style={{ flex: 1, font: '400 13px/1.4 var(--font-sans)', color: 'var(--sage-900)' }}><b>Approved by {a.approved}.</b> Swaps are still welcome; the list updates with them.</span>
    </div>
  );
  return <div style={{ position: 'sticky', bottom: -8, zIndex: 4, margin: '20px -20px 0', padding: '12px 20px 14px', background: 'var(--glass-bg)', backdropFilter: 'var(--blur-glass)', WebkitBackdropFilter: 'var(--blur-glass)', borderTop: '1px solid var(--border-subtle)' }}>
    <Button size="l" variant="accent" fullWidth icon="circle-check" onClick={a.approveWeek}>{pend ? `Keep the other ${pend} and approve` : 'Approve the week'}</Button>
  </div>;
}

function PlanA() {
  const a = useApp();
  const cook = a.slots.filter(s => s.kind === 'cook');
  const pend = cook.filter(s => s.status === 'suggested').length;
  return (
    <Screen>
      <LargeTitle overline={a.D.week} title="The plan" sub={pend ? `Café suggested meals around this week's ${a.store.name} deals. ${pend} still need someone to keep, swap, or turn down.` : 'Every meal has been looked at by someone in the house.'}
        right={<IconButton icon="sparkles" label="Ask Café" onClick={() => a.openSheet({ type: 'chat' })} />} />
      {a.approved && <ApproveBar a={a} />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{a.slots.map(s => <SlotCard key={s.day} a={a} s={s} />)}</div>
      <UpNext a={a} />
      {!a.approved && <ApproveBar a={a} />}
    </Screen>
  );
}

function UpNext({ a }) {
  if (!a.queue.length) return null;
  return (<>
    <SectionHead title="Up next" aside="Recipe box" onAside={() => a.setTab('recipes')} />
    <p style={{ font: '400 13px/1.45 var(--font-sans)', color: 'var(--text-muted)', margin: '-4px 0 10px' }}>Meals the house wants soon. Café plans from these first; tap one to put it on a night.</p>
    <Card padding="none" style={{ padding: '0 14px' }}>{a.queue.map((q, i) => (
      <ListRow key={q.meal} icon="list" iconColor="var(--sage-700)" title={a.D.meals[q.meal].title} sub={`Added by ${q.by}`} onClick={() => a.openSheet({ type: 'schedule', meal: q.meal })} last={i === a.queue.length - 1}
        right={<IconButton icon="x" label="Remove" size="s" onClick={e => { e.stopPropagation(); a.queueRemove(q.meal); }} />} />))}
    </Card>
  </>);
}

function PlanB() {
  const a = useApp();
  const [overview, setOverview] = React.useState(false);
  const queue = a.slots.filter(s => s.kind === 'cook' && (s.status === 'suggested' || s.status === 'thinking'));
  const total = a.slots.filter(s => s.kind === 'cook').length;
  const s = queue[0];
  if (!s || overview) return (
    <Screen>
      <LargeTitle overline={a.D.week} title={queue.length ? 'The whole week' : 'All reviewed'} sub={queue.length ? `${queue.length} left to review.` : 'Every suggestion has been kept, swapped or turned down. Change anything below, then approve.'}
        right={queue.length ? <Button size="s" variant="secondary" onClick={() => setOverview(false)}>Back to review</Button> : null} />
      {a.approved && <ApproveBar a={a} />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{a.slots.map(x => <SlotCard key={x.day} a={a} s={x} />)}</div>
      <UpNext a={a} />
      {!a.approved && <ApproveBar a={a} />}
    </Screen>
  );
  const m = s.meal && a.D.meals[s.meal];
  const done = total - queue.length;
  return (
    <><Screen bottom={190}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '8px 0 16px' }}>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: `repeat(${total}, 1fr)`, gap: 4 }}>{Array.from({ length: total }, (_, i) => <span key={i} style={{ height: 4, borderRadius: 2, background: i < done ? 'var(--sage-500)' : i === done ? 'var(--char-900)' : 'var(--linen-300)' }} />)}</div>
        <span style={{ font: '600 12px/1 var(--font-sans)', color: 'var(--text-muted)' }}>{done + 1} of {total}</span>
        <Button size="s" variant="ghost" onClick={() => setOverview(true)}>Whole week</Button>
        <IconButton icon="sparkles" label="Ask Café" size="s" onClick={() => a.openSheet({ type: 'chat' })} />
      </div>
      {s.status === 'thinking' ? <Card padding="l"><Thinking basis={s.basis} /></Card> : <>
        <MealPhoto height={190}><div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}><DayTag day={s.day} />{m.onSale && <Badge tone="sale" variant="solid" icon="tag">On sale</Badge>}</div></MealPhoto>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
          <SuggestedTag style={{ alignSelf: 'flex-start' }} />
          <h1 onClick={() => a.push({ type: 'meal', day: s.day })} style={{ font: '300 30px/1.1 var(--font-serif)', letterSpacing: 'var(--ls-display)', color: 'var(--text-strong)', cursor: 'pointer' }}>{m.title}</h1>
          <p style={{ font: 'var(--type-description)', fontSize: 16, color: 'var(--text-body)' }}>{m.description}</p>
          <Meta m={m} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}><Score label="Healthy" value={m.healthy} /><Score label="Delicious" value={m.delicious} tone="terra" /></div>
          <Why items={m.why} basis={s.basis} />
          <div><span style={{ display: 'block', font: '600 12px/1 var(--font-sans)', color: 'var(--text-muted)', marginBottom: 8 }}>The house so far</span><Votes a={a} s={s} /></div>
        </div>
      </>}
      </Screen>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 84, zIndex: 20, padding: '12px 20px', background: 'var(--glass-bg)', backdropFilter: 'var(--blur-glass)', WebkitBackdropFilter: 'var(--blur-glass)', borderTop: '1px solid var(--border-subtle)' }}>
        <ReviewActions size="l" onReject={() => a.openSheet({ type: 'reject', day: s.day })} onSwap={() => a.openSheet({ type: 'swap', day: s.day })} onApprove={() => a.keep(s.day)} />
      </div>
    </>
  );
}
Object.assign(window, { PlanA, PlanB, SlotCard, MealMeta: Meta });
})();
