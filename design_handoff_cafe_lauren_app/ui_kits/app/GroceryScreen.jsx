(() => {
const { Card, GroceryItem, Tabs, SegmentedControl, Button, Select, Switch, Dialog, Badge, Icon } = window.CafeLaurenDesignSystem_9f0e0a;

function GroceryScreen({ data, checked, toggle, ordered, onOrder }) {
  const [tab, setTab] = React.useState('buy');
  const [view, setView] = React.useState('aisle');
  const [confirm, setConfirm] = React.useState(false);
  const [subs, setSubs] = React.useState(true);
  const all = data.sections.flatMap(s => s.items.map(it => ({ ...it, section: s.name, key: s.name + it.name })));
  const filtered = all.filter(it => tab === 'buy' ? !it.staple : tab === 'staples' ? it.staple : checked[it.key]);
  const groups = view === 'aisle'
    ? data.sections.map(s => ({ name: s.name, icon: s.icon, items: filtered.filter(it => it.section === s.name) }))
    : [...new Set(filtered.map(it => it.note || (it.staple ? 'Staples' : 'Requests')))].map(n => ({ name: n, icon: 'utensils', items: filtered.filter(it => (it.note || (it.staple ? 'Staples' : 'Requests')) === n) }));
  const left = all.filter(it => !checked[it.key]).length;
  const sale = all.filter(it => it.sale).length;
  return (
    <div style={{ padding: 'var(--page-pad)', maxWidth: 1240 }}>
      <PageHeader overline={data.week} title="Grocery list" sub="Sorted the way Cermak is laid out. Every recipe ingredient and staple is accounted for." />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'flex-start' }}>
        <div style={{ flex: '999 1 520px', minWidth: 0 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 24 }}>
            <Tabs style={{ flex: '1 1 300px' }} value={tab} onChange={setTab} tabs={[{ id: 'buy', label: 'To buy', count: all.filter(i => !i.staple).length }, { id: 'staples', label: 'Staples', count: all.filter(i => i.staple).length }, { id: 'got', label: 'Got it', count: Object.values(checked).filter(Boolean).length }]} />
            <SegmentedControl size="s" value={view} onChange={setView} options={[{ value: 'aisle', label: 'By aisle' }, { value: 'meal', label: 'By meal' }]} style={{ marginBottom: 8 }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {groups.filter(g => g.items.length).map(g => (
              <Card key={g.name} padding="l">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <Icon name={g.icon} size={20} style={{ color: 'var(--sage-600)' }} />
                  <h3 style={{ flex: 1, font: 'var(--type-h3)', color: 'var(--text-strong)' }}>{g.name}</h3>
                  <span style={{ font: '500 12px/1 var(--font-sans)', color: 'var(--text-muted)' }}>{g.items.length} items</span>
                </div>
                {g.items.map(it => <GroceryItem key={it.key} {...it} checked={!!checked[it.key]} onChange={() => toggle(it.key)} style={{ borderBottom: 0, borderTop: '1px solid var(--border-subtle)' }} />)}
              </Card>
            ))}
            {!groups.some(g => g.items.length) && <Card tone="sunken" padding="l"><span style={{ color: 'var(--text-muted)' }}>Nothing checked off yet.</span></Card>}
          </div>
        </div>
        <aside style={{ flex: '1 1 300px', maxWidth: '100%', position: 'sticky', top: 40, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card padding="l" elevation="raised">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ font: 'var(--type-overline)', letterSpacing: 'var(--ls-overline)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Order</span>
                <span style={{ font: '400 32px/1.1 var(--font-serif)', color: 'var(--text-strong)' }}>{left} items</span>
                <span style={{ font: '400 13px/1.4 var(--font-sans)', color: 'var(--text-muted)' }}>{sale} on sale this week · about $148</span>
              </div>
              <Select label="Delivery window" defaultValue="sat9" options={[{ value: 'sat9', label: 'Saturday, 9–11am' }, { value: 'sat1', label: 'Saturday, 1–3pm' }, { value: 'sun9', label: 'Sunday, 9–11am' }]} />
              <Switch checked={subs} onChange={setSubs} label="Allow substitutions" description="Shopper texts Lauren first" />
              {ordered
                ? <Badge tone="success" icon="circle-check" style={{ height: 40, justifyContent: 'center', fontSize: 13 }}>Sent to Instacart</Badge>
                : <Button variant="accent" size="l" icon="shopping-cart" fullWidth onClick={() => setConfirm(true)}>Send to Instacart</Button>}
            </div>
          </Card>
          <Card tone="sunken" padding="m">
            <div style={{ display: 'flex', gap: 10, font: '400 13px/1.45 var(--font-sans)', color: 'var(--text-body)' }}>
              <Icon name="chef-hat" size={18} style={{ color: 'var(--terra-500)', marginTop: 1 }} />
              <span>Leidy's meals for Thursday and Sunday are still pending. Her ingredients will be added here.</span>
            </div>
          </Card>
        </aside>
      </div>
      <Dialog open={confirm} onClose={() => setConfirm(false)} title="Send the list to Instacart?" description={`${left} items from Cermak Produce, delivered Saturday 9–11am. Unchecked items from last week are already sorted in.`}
        actions={<><Button variant="ghost" onClick={() => setConfirm(false)}>Not yet</Button><Button variant="accent" icon="shopping-cart" onClick={() => { setConfirm(false); onOrder(); }}>Place order</Button></>} />
    </div>
  );
}
window.GroceryScreen = GroceryScreen;
})();
