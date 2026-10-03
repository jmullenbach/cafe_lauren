(() => {
const { Card, Input, Button, Avatar, Badge, PhotoTile, SegmentedControl, Icon } = window.CafeLaurenDesignSystem_9f0e0a;

function IntakeScreen({ data, requests, addRequest }) {
  const [text, setText] = React.useState('');
  const [type, setType] = React.useState('meal');
  const [photos, setPhotos] = React.useState(data.pantry);
  const submit = e => { e.preventDefault(); if (!text.trim()) return; addRequest({ who: 'lauren', type, text: text.trim(), when: 'Now' }); setText(''); };
  return (
    <div style={{ padding: 'var(--page-pad)', maxWidth: 1240 }}>
      <PageHeader overline={data.week} title="Requests & pantry" sub="Meal ideas and things we've run out of, plus photos of what's on hand. All of it feeds Sunday's plan." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: 32, alignItems: 'start' }}>
        <section>
          <SectionTitle aside={`${requests.length} this week`}>Requests</SectionTitle>
          <Card padding="l">
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <SegmentedControl size="s" value={type} onChange={setType} options={[{ value: 'meal', label: 'Meal idea', icon: 'sparkles' }, { value: 'out', label: "We're out of", icon: 'package' }]} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'flex-end' }}>
                <Input style={{ flex: '1 1 200px', minWidth: 0 }} value={text} onChange={e => setText(e.target.value)} placeholder={type === 'meal' ? 'Something with salmon?' : 'Cornstarch, the big yogurt…'} />
                <Button type="submit" icon="send">Add</Button>
              </div>
            </form>
            <div style={{ marginTop: 20 }}>
              {requests.map((r, i) => { const p = data.people[r.who]; return (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '14px 0', borderTop: '1px solid var(--border-subtle)' }}>
                  <Avatar {...p} size={32} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ font: '400 15px/1.45 var(--font-sans)', color: 'var(--text-strong)' }}>{r.text}</span>
                    <span style={{ font: '500 12px/1 var(--font-sans)', color: 'var(--text-muted)' }}>{p.name} · {r.when}</span>
                  </div>
                  <Badge tone={r.type === 'meal' ? 'accent' : 'warning'} icon={r.type === 'meal' ? 'sparkles' : 'package'}>{r.type === 'meal' ? 'Meal idea' : 'Ran out'}</Badge>
                </div>); })}
            </div>
          </Card>
        </section>
        <section style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div>
            <SectionTitle aside="Newest: March 1">Pantry photos</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10 }}>
              {photos.map((p, i) => <PhotoTile key={p.src} {...p} onRemove={() => setPhotos(photos.filter((_, j) => j !== i))} />)}
              <PhotoTile empty label="Add photo" onClick={() => setPhotos([...photos, data.pantry[photos.length % 3]])} />
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginTop: 14, padding: '12px 14px', borderRadius: 'var(--radius-s)', background: 'var(--status-warning-bg)', color: 'var(--honey-700)', font: '400 13px/1.45 var(--font-sans)' }}>
              <Icon name="triangle-alert" size={16} style={{ marginTop: 2 }} />
              <span>These photos are from March. Add fresh ones of the fridge, freezer and pantry so we don't buy what you already have.</span>
            </div>
          </div>
          <div>
            <SectionTitle>On hand</SectionTitle>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{data.onHand.map(x => <Badge key={x} tone="success" icon="check">{x}</Badge>)}</div>
          </div>
          <div>
            <SectionTitle aside="Cermak · Aug 13–26">On sale</SectionTitle>
            <Card padding="none">
              {data.deals.map(([n, p], i) => (
                <div key={n} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderTop: i ? '1px solid var(--border-subtle)' : 0 }}>
                  <span style={{ font: '400 14px/1.3 var(--font-sans)', color: 'var(--text-strong)' }}>{n}</span><Badge tone="sale" icon="tag">{p}</Badge>
                </div>))}
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
window.IntakeScreen = IntakeScreen;
})();
