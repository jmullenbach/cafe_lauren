(() => {
const { MealCard, VoteButtons, DayTag, Button, Badge, Icon } = window.CafeLaurenDesignSystem_9f0e0a;

function ScheduleStrip({ schedule }) {
  return (
    <div style={{ overflowX: 'auto', marginBottom: 40, borderRadius: 'var(--radius-card)' }}><div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(130px, 1fr))', minWidth: 910, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-card)', background: 'var(--surface-card)', boxShadow: 'var(--shadow-1)', overflow: 'hidden' }}>
      {schedule.map((s, i) => (
        <div key={s.day} style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 16, borderLeft: i ? '1px solid var(--border-subtle)' : 0, background: s.kind === 'cook' ? 'transparent' : 'var(--surface-sunken)' }}>
          <DayTag day={s.day} short />
          <span style={{ font: s.kind === 'cook' ? '400 15px/1.3 var(--font-serif)' : 'italic 400 14px/1.35 var(--font-serif)', color: s.kind === 'cook' ? 'var(--text-strong)' : 'var(--text-muted)' }}>{s.title}</span>
          <span style={{ marginTop: 'auto', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 5, font: '500 12px/1 var(--font-sans)', color: 'var(--text-muted)' }}>
            <Icon name={s.kind === 'cook' ? 'cooking-pot' : s.kind === 'leidy' ? 'chef-hat' : 'refresh-cw'} size={14} />
            {s.kind === 'cook' ? s.method : s.kind === 'leidy' ? 'Leidy cooks' : 'Leftovers'}
          </span>
        </div>
      ))}
    </div></div>
  );
}

function WeekScreen({ data, votes, setVote, approved, onApprove, onCook }) {
  const P = data.people;
  const pending = data.meals.filter(m => Object.keys(votes[m.id]).length < 3).length;
  return (
    <div style={{ padding: 'var(--page-pad)', maxWidth: 1240 }}>
      <PageHeader overline={data.week} title="This week's menu" sub={data.dealsLine}
        actions={approved
          ? <><Badge tone="success" icon="check" style={{ height: 40, padding: '0 14px', fontSize: 13 }}>Menu approved</Badge><Button variant="secondary" icon="shopping-basket" onClick={() => onApprove('list')}>See the list</Button></>
          : <><Button variant="secondary" icon="refresh-cw">Suggest another</Button><Button variant="accent" icon="check" onClick={() => onApprove()}>Approve menu</Button></>} />
      <ScheduleStrip schedule={data.schedule} />
      <SectionTitle aside={pending ? `Waiting on ${pending} vote${pending > 1 ? 's' : ''}` : 'Everyone has voted'}>Cooking fresh</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--gutter)' }}>
        {data.meals.map(m => {
          const v = votes[m.id]; const vals = Object.values(v);
          return <MealCard key={m.id} {...m} onClick={m.id === 'chops' ? onCook : undefined}
            footer={<div onClick={e => e.stopPropagation()}><VoteButtons value={v.lauren || null} onChange={x => setVote(m.id, x)} up={vals.filter(x => x === 'up').length} down={vals.filter(x => x === 'down').length} voters={Object.keys(v).map(k => P[k])} /></div>} />;
        })}
      </div>
    </div>
  );
}
window.WeekScreen = WeekScreen;
})();
