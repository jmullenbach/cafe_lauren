(() => {
const { Button, IconButton, Input, Badge, GroceryItem, ChoiceChips, SuggestedTag, Sheet, Card, Icon } = window.CafeLaurenDesignSystem_9f0e0a;
const ALT = { c2: 'Center Cut Pork Chops, boneless · 2.4 lb · $6.21', c6: 'Fage Total 0% Greek Yogurt · 35 oz · $7.29' };

function EditableItem({ a, it }) {
  const [edit, setEdit] = React.useState(false);
  const [qty, setQty] = React.useState(it.qty || '');
  const [name, setName] = React.useState(it.name);
  const [note, setNote] = React.useState(it.note || '');
  if (edit) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <div style={{ display: 'flex', gap: 8 }}><Input size="s" style={{ flex: 1, minWidth: 0 }} value={qty} onChange={e => setQty(e.target.value)} placeholder="Amount" /><Input size="s" style={{ flex: 2.2, minWidth: 0 }} value={name} onChange={e => setName(e.target.value)} placeholder="Item" /></div>
      <Input size="s" value={note} onChange={e => setNote(e.target.value)} placeholder="Note, e.g. brand or which meal" />
      <div style={{ display: 'flex', gap: 8 }}>
        <Button size="s" variant="ghost" icon="trash-2" style={{ color: 'var(--tomato-500)' }} onClick={() => a.removeListItem(it.key, it.name)}>Remove</Button>
        <span style={{ flex: 1 }} />
        <Button size="s" variant="ghost" onClick={() => setEdit(false)}>Cancel</Button>
        <Button size="s" icon="check" disabled={!name.trim()} onClick={() => { a.editListItem(it.key, { qty: qty.trim(), name: name.trim(), note: note.trim() }); setEdit(false); }}>Save</Button>
      </div>
    </div>
  );
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <GroceryItem {...it} checked={!!a.checked[it.key]} onChange={() => a.toggleCheck(it.key)} style={{ flex: 1, minWidth: 0 }} />
      <IconButton icon="pencil" label={`Edit ${it.name}`} size="s" onClick={() => setEdit(true)} style={{ color: 'var(--text-muted)' }} />
    </div>
  );
}
function AddListRow({ a, section }) {
  const [open, setOpen] = React.useState(false);
  const [qty, setQty] = React.useState('');
  const [name, setName] = React.useState('');
  const submit = e => { e.preventDefault(); if (!name.trim()) return; a.addListItem(name.trim(), qty.trim(), section); setName(''); setQty(''); };
  if (!open) return <button type="button" onClick={() => setOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', minHeight: 44, padding: 0, border: 0, background: 'none', cursor: 'pointer', color: 'var(--sage-700)', font: '600 14px/1 var(--font-sans)' }}><Icon name="plus" size={18} />Add to {section.split(' / ')[0].toLowerCase()}</button>;
  return (
    <form onSubmit={submit} style={{ display: 'flex', gap: 8, padding: '10px 0', alignItems: 'center' }}>
      <Input size="s" style={{ width: 80, flex: 'none' }} value={qty} onChange={e => setQty(e.target.value)} placeholder="Amount" />
      <Input size="s" style={{ flex: 1, minWidth: 0 }} value={name} onChange={e => setName(e.target.value)} placeholder="Item" />
      <IconButton icon="plus" label="Add" variant="primary" size="s" onClick={submit} />
      <IconButton icon="x" label="Done" size="s" onClick={() => setOpen(false)} />
    </form>
  );
}
function listText(a) {
  const lines = [`Grocery list — ${a.store.name}`, ''];
  a.list.forEach(sec => { const items = sec.items.filter(i => !a.checked[i.key]); if (!items.length) return; lines.push(sec.name); items.forEach(i => lines.push('☐ ' + [i.qty, i.name].filter(Boolean).join(' ') + (i.note ? ' — ' + i.note : ''))); lines.push(''); });
  return lines.join('\n').trim();
}
function copyList(a) {
  const t = listText(a);
  const done = () => a.toast({ tone: 'success', icon: 'clipboard-list', title: 'List copied', message: 'Paste it into Google Keep, Notes or a text.' });
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, () => { fallbackCopy(t); done(); }); else { fallbackCopy(t); done(); }
}
function fallbackCopy(t) { const ta = document.createElement('textarea'); ta.value = t; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e) {} ta.remove(); }

function QuickAdd({ a }) {
  const [v, setV] = React.useState('');
  const submit = e => { e.preventDefault(); const t = v.trim(); if (!t) return; const m = t.match(/^([\d.\/]+\s*(?:lbs?|oz|cans?|jars?|bags?|bunch(?:es)?|heads?|cups?|dozen)?)\s+(.+)$/i); a.addListItem(m ? m[2] : t, m ? m[1] : '', null); setV(''); };
  return (
    <form onSubmit={submit} style={{ display: 'flex', gap: 8, margin: '4px 0 0' }}>
      <Input icon="plus" style={{ flex: 1, minWidth: 0 }} value={v} onChange={e => setV(e.target.value)} placeholder="Add anything: “2 lbs apples”" />
      <Button type="submit" variant="secondary" disabled={!v.trim()}>Add</Button>
    </form>
  );
}

function ListScreen({ left }) {
  const a = useApp();
  const total = a.list.flatMap(s => s.items).length;
  return (
    <Screen>
      <LargeTitle overline={a.store.name} title="Grocery list" sub={`${left} of ${total} still to get · sorted by aisle`} right={<Button size="s" variant="secondary" icon="clipboard-list" onClick={() => copyList(a)}>Copy</Button>} />
      {!a.approved && <div style={{ display: 'flex', gap: 10, padding: '12px 14px', borderRadius: 'var(--radius-s)', background: 'var(--honey-100)', color: 'var(--honey-700)', font: '400 13px/1.45 var(--font-sans)', marginBottom: 16 }}><Icon name="info" size={16} style={{ marginTop: 2 }} /><span>Draft list. It follows the plan, and you can order once the week is approved. <b style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => a.setTab('plan')}>Go to plan</b></span></div>}
      {a.diff.length > 0 && <Card padding="m" style={{ marginBottom: 16, background: 'var(--terra-50)', borderColor: 'var(--terra-100)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ font: '600 14px/1.3 var(--font-sans)', color: 'var(--terra-700)' }}>The plan changed after approval</span>
          {a.diff.map((d, i) => <span key={i} style={{ font: '400 13px/1.3 var(--font-sans)', color: 'var(--text-body)' }}><b style={{ color: d.sign === '+' ? 'var(--sage-700)' : 'var(--terra-700)', display: 'inline-block', width: 14 }}>{d.sign}</b>{d.text}</span>)}
          <Button size="s" variant="secondary" icon="check" style={{ alignSelf: 'flex-start', marginTop: 4 }} onClick={a.clearDiff}>Looks right</Button>
        </div>
      </Card>}
      <Card padding="none" style={{ padding: '0 14px', marginBottom: 12 }}>
        <ListRow icon="store" iconColor="var(--sage-700)" title={a.store.name} sub={`Weekly ad ${a.store.ad} · ${a.via.label}`} onClick={() => a.openSheet({ type: 'store' })} right={<span style={{ font: '600 13px/1 var(--font-sans)', color: 'var(--sage-700)' }}>Change</span>} last />
      </Card>
      {a.orderVia === 'share' ? <Button size="l" fullWidth variant="accent" icon="send" onClick={() => a.openSheet({ type: 'send' })} style={{ marginBottom: 8 }}>Send the list · {left} items</Button>
        : a.orderVia === 'self' ? <p style={{ display: 'flex', gap: 8, font: '400 13px/1.45 var(--font-sans)', color: 'var(--text-muted)', margin: '0 0 8px' }}><Icon name="shopping-basket" size={16} style={{ marginTop: 1 }} />Sorted by {a.store.name}'s aisles. Check things off as you go.</p>
        : a.approved && <Button size="l" fullWidth variant={a.order ? 'secondary' : 'accent'} icon={a.order ? 'truck' : 'shopping-cart'} onClick={() => a.push({ type: a.order ? 'track' : 'order' })} style={{ marginBottom: 8 }}>{a.order ? (a.orderVia === 'pickup' ? 'Track pickup' : 'Track delivery') : `Review ${a.orderVia === 'pickup' ? 'pickup' : a.orderVia === 'amazon' ? 'Amazon' : 'Instacart'} order · ${left} items`}</Button>}
      <QuickAdd a={a} />
      {a.list.map(sec => (
        <div key={sec.name}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '24px 0 4px' }}><Icon name={sec.icon} size={18} style={{ color: 'var(--sage-600)' }} /><h2 style={{ flex: 1, font: 'var(--type-h3)', fontSize: 16, color: 'var(--text-strong)' }}>{sec.name}</h2><span style={{ font: '500 12px/1 var(--font-sans)', color: 'var(--text-muted)' }}>{sec.items.length}</span></div>
          {sec.items.map(it => <EditableItem key={it.key + (it.name || '')} a={a} it={it} />)}
          <AddListRow a={a} section={sec.name} />
        </div>
      ))}
    </Screen>
  );
}

function OrderReview() {
  const a = useApp();
  const [win, setWin] = React.useState('Sat 9–11am');
  const [subs, setSubs] = React.useState('Ask me first');
  const flagged = a.D.cart.filter(c => !c.sure);
  const open = flagged.filter(c => !a.cart[c.id]).length;
  const sure = a.D.cart.filter(c => c.sure);
  return (
    <>
      <Screen bottom={120}>
        <BackHeader title="Review order" onBack={a.pop} />
        <p style={{ font: '400 14px/1.5 var(--font-sans)', color: 'var(--text-body)', margin: '8px 0 0' }}>Café matched each list item to a {a.store.name} product on {a.orderVia === 'amazon' ? 'Amazon' : 'Instacart'}. It flagged the ones it wasn't sure about.</p>
        <SectionHead title="Check these" aside={open ? `${open} to check` : 'All checked'} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {flagged.map(c => { const d = a.cart[c.id]; return (
            <Card key={c.id} padding="m" style={d ? undefined : { borderStyle: 'dashed', borderColor: 'var(--honey-300)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ font: '500 12px/1 var(--font-sans)', color: 'var(--text-muted)' }}>For “{c.item}”</span>
                <span style={{ font: '500 15px/1.35 var(--font-sans)', color: 'var(--text-strong)' }}>{d === 'changed' ? ALT[c.id] : `${c.product} · ${c.size} · $${c.price.toFixed(2)}`}</span>
                {!d && <span style={{ display: 'flex', gap: 6, font: '400 13px/1.4 var(--font-sans)', color: 'var(--honey-700)' }}><Icon name="triangle-alert" size={14} style={{ marginTop: 2 }} />{c.note}</span>}
                {d ? <SuggestedTag status={d === 'changed' ? 'edited' : 'kept'} by={a.P.name} style={{ alignSelf: 'flex-start' }} />
                  : <div style={{ display: 'flex', gap: 8 }}><Button size="s" variant="secondary" icon="refresh-cw" onClick={() => a.setCartItem(c.id, 'changed')}>Change</Button><Button size="s" variant="accent" icon="check" onClick={() => a.setCartItem(c.id, 'ok')}>Looks right</Button></div>}
              </div>
            </Card>); })}
        </div>
        <SectionHead title="Matched" aside={`${sure.length + a.D.cartMore} items`} />
        <Card padding="none" style={{ padding: '0 14px' }}>
          {sure.map(c => <div key={c.id} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '11px 0', borderBottom: '1px solid var(--border-subtle)' }}><span style={{ flex: 1, minWidth: 0, font: '400 14px/1.35 var(--font-sans)', color: 'var(--text-strong)' }}>{c.product} <span style={{ color: 'var(--text-muted)' }}>· {c.size}</span></span><span style={{ font: '500 14px/1 var(--font-sans)', fontVariantNumeric: 'tabular-nums' }}>${c.price.toFixed(2)}</span></div>)}
          <div style={{ padding: '12px 0', font: '500 13px/1 var(--font-sans)', color: 'var(--sage-700)' }}>+ {a.D.cartMore} more</div>
        </Card>
        <SectionHead title="Delivery" />
        <ChoiceChips size="s" multi={false} value={win} onChange={v => v && setWin(v)} options={['Sat 9–11am', 'Sat 1–3pm', 'Sun 9–11am']} />
        <span style={{ display: 'block', font: '600 13px/1 var(--font-sans)', color: 'var(--text-strong)', margin: '20px 0 10px' }}>If something's out</span>
        <ChoiceChips size="s" multi={false} value={subs} onChange={v => v && setSubs(v)} options={['Ask me first', "Shopper's choice", "Don't replace"]} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border-default)' }}>
          {[['Groceries', '$' + a.D.cartTotal.toFixed(2)], ['Delivery + service', '$7.48'], ['Estimated total', '$' + (a.D.cartTotal + 7.48).toFixed(2)]].map(([k, v], i) => <div key={k} style={{ display: 'flex', justifyContent: 'space-between', font: `${i === 2 ? 600 : 400} ${i === 2 ? 16 : 14}px/1.3 var(--font-sans)`, color: i === 2 ? 'var(--text-strong)' : 'var(--text-body)' }}><span>{k}</span><span style={{ fontVariantNumeric: 'tabular-nums' }}>{v}</span></div>)}
        </div>
      </Screen>
      <BottomBar><Button size="l" variant="accent" fullWidth icon="shopping-cart" disabled={open > 0} onClick={a.placeOrder}>{open ? `Check ${open} flagged item${open > 1 ? 's' : ''} first` : `Place order · ${win}`}</Button></BottomBar>
    </>
  );
}

const STEPS = [['placed', 'Order placed', 'receipt'], ['shopping', 'Shopper at the store', 'shopping-cart'], ['delivering', 'On the way', 'truck'], ['delivered', 'Delivered', 'house']];
function Tracking() {
  const a = useApp();
  const idx = STEPS.findIndex(s => s[0] === a.order);
  return (
    <Screen>
      <BackHeader title="Delivery" onBack={a.pop} right={a.order !== 'delivered' && <Button size="s" variant="ghost" onClick={a.advanceOrder}>Next step (demo)</Button>} />
      <div style={{ margin: '12px 0 20px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ font: 'var(--type-overline)', letterSpacing: 'var(--ls-overline)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Saturday, 9–11am</span>
        <h1 style={{ font: '300 34px/1.1 var(--font-serif)', color: 'var(--text-strong)' }}>{STEPS[idx][1]}</h1>
      </div>
      {a.order === 'shopping' && a.sub === 'pending' && <Card padding="m" elevation="raised" style={{ marginBottom: 20, borderColor: 'var(--terra-100)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: '600 12px/1 var(--font-sans)', color: 'var(--terra-700)' }}><Icon name="refresh-cw" size={14} />Shopper is asking</span>
          <span style={{ font: '400 15px/1.45 var(--font-sans)', color: 'var(--text-strong)' }}><b>Queso fresco 10 oz</b> is out. Replace with <b>Cotija 10 oz</b> for $2.49?</span>
          <span style={{ font: '400 13px/1.4 var(--font-sans)', color: 'var(--text-muted)' }}>For Taco Tuesday. Cotija is saltier and crumbles the same way.</span>
          <div style={{ display: 'flex', gap: 8 }}><Button size="s" variant="secondary" icon="x" style={{ flex: 1 }} onClick={() => a.decideSub('refunded')}>Refund it</Button><Button size="s" variant="accent" icon="check" style={{ flex: 1 }} onClick={() => a.decideSub('approved')}>Use cotija</Button></div>
        </div>
      </Card>}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {STEPS.map(([k, l, ic], i) => (
          <div key={k} style={{ display: 'flex', gap: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ width: 32, height: 32, borderRadius: 999, display: 'grid', placeItems: 'center', background: i < idx ? 'var(--sage-600)' : i === idx ? 'var(--char-900)' : 'var(--linen-200)', color: i <= idx ? '#fff' : 'var(--text-faint)' }}><Icon name={i < idx ? 'check' : ic} size={16} stroke={i < idx ? 2.5 : 1.75} /></span>
              {i < STEPS.length - 1 && <span style={{ width: 2, height: 32, background: i < idx ? 'var(--sage-300)' : 'var(--linen-300)' }} />}
            </div>
            <div style={{ paddingTop: 6, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span style={{ font: `${i === idx ? 600 : 500} 15px/1.2 var(--font-sans)`, color: i <= idx ? 'var(--text-strong)' : 'var(--text-faint)' }}>{l}</span>
              {i === 1 && a.sub !== 'pending' && i <= idx && <span style={{ font: '400 12px/1.3 var(--font-sans)', color: 'var(--text-muted)' }}>{a.sub === 'approved' ? 'Cotija instead of queso fresco' : 'Queso fresco refunded'}</span>}
            </div>
          </div>
        ))}
      </div>
      {a.order === 'delivered' && <Card tone="accent" padding="m" style={{ marginTop: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ font: '400 20px/1.2 var(--font-serif)', color: 'var(--text-strong)' }}>Putting things away?</span>
          <span style={{ font: '400 14px/1.45 var(--font-sans)', color: 'var(--text-body)' }}>Café can mark everything delivered as on hand, so it won't come back on next week's list.</span>
          <Button icon="refrigerator" onClick={() => a.toast({ tone: 'success', icon: 'refrigerator', title: '38 items added to the pantry' })}>Update pantry</Button>
        </div>
      </Card>}
    </Screen>
  );
}
function Choice({ icon, title, sub, on, onClick, last }) {
  return <ListRow icon={icon} iconColor={on ? 'var(--sage-700)' : undefined} title={title} sub={sub} onClick={onClick} last={last}
    right={<span style={{ width: 22, height: 22, borderRadius: 999, flex: 'none', display: 'grid', placeItems: 'center', border: on ? 0 : '1.5px solid var(--border-strong)', background: on ? 'var(--sage-600)' : 'transparent', color: '#fff' }}>{on && <Icon name="check" size={13} stroke={2.5} />}</span>} />;
}
function StoreSheet({ open }) {
  const a = useApp();
  return (
    <Sheet open={open} onClose={a.closeSheet} title="Store & ordering" subtitle="Café reads this store's weekly ad when it plans, and sorts the list by its aisles."
      footer={<Button size="l" fullWidth onClick={a.closeSheet}>Done</Button>}>
      <span style={{ display: 'block', font: 'var(--type-overline)', letterSpacing: 'var(--ls-overline)', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '4px 0 6px' }}>Weekly ads from</span>
      <Card padding="none" style={{ padding: '0 14px' }}>
        {a.D.stores.map((st, i) => <Choice key={st.id} icon="store" title={st.name} sub={`Ad ${st.ad} · ${st.deals} deals`} on={a.store.id === st.id} onClick={() => a.setStore(st.id)} />)}
        <ListRow icon="plus" iconColor="var(--sage-700)" title="Add another store" sub="Paste its weekly ad link" onClick={() => a.toast({ icon: 'store', title: 'Store search would open here' })} last />
      </Card>
      <span style={{ display: 'block', font: 'var(--type-overline)', letterSpacing: 'var(--ls-overline)', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '20px 0 6px' }}>Get the groceries by</span>
      <Card padding="none" style={{ padding: '0 14px' }}>
        {a.D.orderVia.map((o, i) => <Choice key={o.id} icon={o.icon} title={o.label} sub={o.sub} on={a.orderVia === o.id} onClick={() => a.setOrderVia(o.id)} last={i === a.D.orderVia.length - 1} />)}
      </Card>
    </Sheet>
  );
}
function SendSheet({ open }) {
  const a = useApp();
  const [who, setWho] = React.useState(['Joe']);
  const others = Object.values(a.D.people).map(p => p.name).filter(n => n !== a.P.name);
  const n = a.list.flatMap(s => s.items).filter(i => !a.checked[i.key]).length;
  return (
    <Sheet open={open} onClose={a.closeSheet} title="Send the list" subtitle={`${n} items for ${a.store.name}, sorted by aisle. Whoever shops can check things off from their phone.`}
      footer={<Button size="l" fullWidth variant="accent" icon="send" disabled={!who.length} onClick={() => a.shareList('text', who)}>Text it to {who.join(' and ') || '…'}</Button>}>
      <span style={{ display: 'block', font: '600 13px/1 var(--font-sans)', color: 'var(--text-strong)', margin: '4px 0 10px' }}>Who's shopping?</span>
      <ChoiceChips value={who} onChange={setWho} options={others} />
      <span style={{ display: 'block', font: 'var(--type-overline)', letterSpacing: 'var(--ls-overline)', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '24px 0 6px' }}>Or</span>
      <Card padding="none" style={{ padding: '0 14px' }}>
        <ListRow icon="notebook-pen" title="Update the Notion page" sub="Grocery List · To Buy + Staples" onClick={() => a.shareList('notion')} />
        <ListRow icon="clipboard-list" title="Copy as text" sub="Paste anywhere" onClick={() => a.shareList('copy')} last />
      </Card>
    </Sheet>
  );
}
Object.assign(window, { ListScreen, OrderReview, Tracking, StoreSheet, SendSheet });
})();
