(() => {
const D = window.CLM;
const SHORT = { tofu: 'Tofu stir fry', tacos: 'Tacos', chops: 'Pork chops', shrimp: 'Basil shrimp', chicken: 'Citrus chicken', salmon: 'Salmon', meatballs: 'Meatballs', soup: 'Tortilla soup', stirfry: 'Stir fry' };
const SECTIONS = [
  { name: 'Produce', icon: 'carrot', kw: ['tofu', 'green beans', 'lettuce', 'corn', 'potato', 'onion', 'tomato', 'basil', 'lemon', 'orange', 'garlic', 'bok choy', 'avocado', 'salad', 'banana', 'lime'] },
  { name: 'Frozen', icon: 'snowflake', kw: ['frozen'] },
  { name: 'Meat / Deli / Bakery', icon: 'beef', kw: ['pork', 'chicken', 'shrimp', 'salmon', 'meatball', 'bread', 'tortillas'] },
  { name: 'Dry Goods / Canned', icon: 'wheat', kw: ['beans', 'salsa', 'orzo', 'spaghetti', 'marinara', 'broth', 'rice', 'cornstarch', 'tomatoes'] },
  { name: 'Dairy / Eggs', icon: 'milk', kw: ['queso', 'feta', 'yogurt', 'cheese', 'milk', 'egg'] },
  { name: 'Beverages', icon: 'cup-soda', kw: ['soda'] },
];
const sectionOf = n => { const s = n.toLowerCase(); if (s.includes('fire-roasted')) return 'Dry Goods / Canned'; return (SECTIONS.find(x => x.kw.some(k => s.includes(k))) || SECTIONS[3]).name; };
const STAPLES = [{ name: 'Bananas' }, { name: 'Eggs' }, { name: 'Milk' }, { name: 'Bread' }, { name: 'Frozen fruit' }, { name: 'Soda water', from: 'Joe' }, { name: 'Yogurt', from: 'Leidy' }, { name: 'Cornstarch', from: 'Leidy' }];

function addQty(a, b) {
  const p = q => { const m = String(q).match(/^([\d.]+)\s*(.*)$/); return m ? [parseFloat(m[1]), m[2]] : null; };
  const x = p(a), y = p(b);
  if (x && y && x[1].replace(/s$/, '') === y[1].replace(/s$/, '')) { const n = Math.round((x[0] + y[0]) * 100) / 100; const u = x[1].replace(/s$/, ''); return n + (u ? ' ' + u + (n > 1 && /^(lb|can|jar|bag|cup|ear|head|bunch|block|tray|clove)$/.test(u) ? (u === 'bunch' ? 'es' : 's') : '') : ''); }
  return a + ' + ' + b;
}
function buildList(slots, edits = {}, adds = []) {
  const map = {};
  slots.forEach(s => { if (s.kind !== 'cook' || !s.meal) return; const m = D.meals[s.meal];
    m.ingredients.forEach(([qty, name, tag]) => { if (tag === 'have') return; const k = name.toLowerCase();
      if (map[k]) { map[k].qty = addQty(map[k].qty, qty); map[k].note += ' + ' + SHORT[s.meal]; }
      else map[k] = { key: k, qty, name, note: SHORT[s.meal], sale: tag === 'sale' ? 'On sale' : null, section: sectionOf(name) }; }); });
  STAPLES.forEach(st => { const k = st.name.toLowerCase(); if (!map[k]) map[k] = { key: k, name: st.name, staple: true, from: st.from, section: sectionOf(st.name) }; });
  adds.forEach(it => { map[it.key] = { ...it, added: true }; });
  Object.entries(edits).forEach(([k, e]) => { if (!map[k]) return; if (e.removed) delete map[k]; else map[k] = { ...map[k], ...e, edited: true }; });
  return SECTIONS.map(sec => ({ ...sec, items: Object.values(map).filter(i => i.section === sec.name) })).filter(s => s.items.length);
}

const Ctx = React.createContext(null);
const CHAT = {
  'Make Thursday vegetarian': { text: "Thursday is Leidy's night. If she's open to it, here's a vegetarian option that uses what's on sale. It replaces nothing until you apply it.", proposal: { day: 'thu', meal: 'tofu', label: 'Thursday → Bok Choy and Tofu Stir Fry', detail: 'Vegetarian. Tofu, bok choy, garlic over rice. 25 min, ~$11.' } },
  'We have leftover rice': { text: 'Good to know. I can turn Sunday into fried rice with the leftover chicken instead of wraps, so we skip the deli cheese.', proposal: { day: 'sun', text: 'Chicken fried rice (leftovers)', label: 'Sunday → Chicken fried rice', detail: 'Uses leftover rice + Saturday chicken. Removes deli cheese from the list.' } },
  'Something cheaper than shrimp': { text: 'Shrimp is the priciest meal this week (~$26). Two cheaper ideas that keep the same Friday feel:', proposal: { day: 'fri', meal: 'stirfry', label: 'Friday → Pork and Bok Choy Stir Fry', detail: '~$13, 20 min. Saves about $13.' } },
  'What can Leidy make?': { text: "Leidy offered arroz con pollo for Thursday in the inbox. It's in the recipe box (4 stars). Want me to put it on Thursday and add her ingredients to the list?", proposal: { day: 'thu', text: 'Arroz con Pollo (Leidy)', label: 'Thursday → Arroz con Pollo', detail: 'Adds chicken thighs, rice, peppers, peas to the list.' } },
};

function AppProvider({ user, children }) {
  const P = D.people[user];
  const [tab, setTabRaw] = React.useState(() => localStorage.getItem('clm-tab') || 'home');
  const [stack, setStack] = React.useState([]);
  const [sheet, setSheet] = React.useState(null);
  const [slots, setSlots] = React.useState(D.slots);
  const [approved, setApproved] = React.useState(null);
  const [diff, setDiff] = React.useState([]);
  const [requests, setRequests] = React.useState(D.requests);
  const [pantry, setPantry] = React.useState(D.pantry.map(p => ({ ...p, state: p.sure ? 'found' : 'unsure' })));
  const [pantryDone, setPantryDone] = React.useState(false);
  const [recipes, setRecipes] = React.useState(D.recipes);
  const [storeId, setStoreId] = React.useState('cermak');
  const [orderVia, setOrderVia] = React.useState('delivery');
  const [listEdits, setListEdits] = React.useState({});
  const [listAdds, setListAdds] = React.useState([]);
  const [queue, setQueue] = React.useState([{ meal: 'soup', by: 'Joe' }]);
  const [checked, setChecked] = React.useState({});
  const [cart, setCart] = React.useState({});
  const [order, setOrder] = React.useState(null);
  const [sub, setSub] = React.useState('pending');
  const [toast, setToastRaw] = React.useState(null);
  const [chat, setChat] = React.useState([{ from: 'cafe', text: "Hi " + P.name + ". I can swap meals, work around what's in the fridge, or plan around a busy night. Nothing changes until you say so." }]);
  const tRef = React.useRef();
  const toastMsg = t => { setToastRaw(t); clearTimeout(tRef.current); tRef.current = setTimeout(() => setToastRaw(null), 3000); };
  const setTab = t => { setTabRaw(t); setStack([]); localStorage.setItem('clm-tab', t); };
  const slotOf = day => slots.find(s => s.day === day);
  const patch = (day, p) => setSlots(ss => ss.map(s => s.day === day ? { ...s, ...(typeof p === 'function' ? p(s) : p) } : s));
  const used = () => slots.map(s => s.meal).filter(Boolean);
  const logDiff = (removed, added) => { if (!approved) return; setDiff(d => [...d, removed && { sign: '−', text: SHORT[removed] + ' ingredients' }, added && { sign: '+', text: SHORT[added] + ' ingredients' }].filter(Boolean)); };

  const api = {
    D, user, P, tab, setTab, stack, sheet, slots, approved, diff, requests, pantry, pantryDone, recipes, checked, cart, order, sub, queue, orderVia, store: D.stores.find(x => x.id === storeId), via: D.orderVia.find(x => x.id === orderVia), toastState: toast, chat, SHORT,
    list: buildList(slots, listEdits, listAdds), SECTION_NAMES: SECTIONS.map(s => s.name),
    editListItem: (key, p) => setListEdits(e => ({ ...e, [key]: { ...e[key], ...p } })),
    removeListItem: (key, name) => { setListEdits(e => ({ ...e, [key]: { removed: true } })); setListAdds(xs => xs.filter(x => x.key !== key)); toastMsg({ icon: 'trash-2', title: `Removed ${name}` }); },
    addListItem: (name, qty, section) => { const key = 'add-' + Date.now(); setListAdds(xs => [...xs, { key, name, qty, section: section || sectionOf(name), from: P.name }]); toastMsg({ tone: 'success', icon: 'plus', title: `Added ${name}`, message: section || sectionOf(name) }); },
    push: v => setStack(s => [...s, v]), pop: () => setStack(s => s.slice(0, -1)),
    openSheet: s => setSheet(s), closeSheet: () => setSheet(null),
    toast: toastMsg, slotOf,
    keep: day => { patch(day, s => ({ status: 'kept', by: P.name, votes: { ...s.votes, [user]: 'up' } })); toastMsg({ tone: 'success', icon: 'check', title: 'Kept', message: 'Others can still vote or swap it.' }); },
    vote: (day, v) => patch(day, s => { const votes = { ...s.votes }; if (v) votes[user] = v; else delete votes[user]; return { votes }; }),
    swap: (day, meal, basis) => { setQueue(q => q.filter(x => x.meal !== meal)); const old = slotOf(day).meal; patch(day, { meal, kind: 'cook', status: 'edited', by: P.name, basis, votes: { [user]: 'up' }, text: undefined }); logDiff(old, meal); setSheet(null); toastMsg({ icon: 'refresh-cw', title: 'Swapped', message: 'Votes reset so everyone can weigh in.' }); },
    setText: (day, text) => { const old = slotOf(day).meal; patch(day, { meal: undefined, kind: 'custom', text, status: 'edited', by: P.name, votes: {} }); logDiff(old, null); },
    reject: (day, reasons, note, mode) => {
      const old = slotOf(day).meal; setSheet(null);
      const basis = [...reasons, note].filter(Boolean).join(' · ');
      if (mode === 'open') { patch(day, { meal: undefined, kind: 'open', status: 'rejected', by: P.name, basis, votes: {} }); logDiff(old, null); toastMsg({ icon: 'x', title: 'Night left open', message: 'Café will remember: ' + (basis || 'no reason given') }); return; }
      patch(day, { status: 'thinking', basis });
      setTimeout(() => { const next = D.alternatives.find(a => !used().includes(a) && a !== old) || 'meatballs'; patch(day, { meal: next, kind: 'cook', status: 'suggested', by: undefined, votes: {}, basis }); logDiff(old, next); }, 1400);
    },
    approveWeek: () => { setApproved(P.name); setSlots(ss => ss.map(s => s.kind === 'cook' && s.status !== 'rejected' ? { ...s, status: 'approved', by: s.by || P.name } : s)); toastMsg({ tone: 'success', icon: 'circle-check', title: 'Week approved', message: 'The grocery list is ready. You can still swap anything.' }); },
    moveSlot: (from, to) => { setSlots(ss => { const A = ss.find(s => s.day === from), B = ss.find(s => s.day === to); return ss.map(s => s.day === from ? { ...B, day: from } : s.day === to ? { ...A, day: to, status: A.kind === 'cook' ? 'edited' : A.status, by: P.name } : s); }); setSheet(null); toastMsg({ icon: 'calendar-days', title: 'Moved', message: 'Swapped with ' + to.toUpperCase() }); },
    setCook: (day, who) => patch(day, { cook: who }),
    clearDiff: () => { setDiff([]); toastMsg({ tone: 'success', icon: 'check', title: 'List updated' }); },
    addRequest: r => { setRequests(rs => [{ id: Date.now(), who: user, when: 'Now', status: 'new', ...r }, ...rs]); toastMsg({ icon: 'send', title: 'Sent to the household', message: 'Café will consider it in this week\'s plan.' }); },
    answerRequest: (id, status, reply) => setRequests(rs => rs.map(r => r.id === id ? { ...r, status, reply } : r)),
    setPantryItem: (id, p) => setPantry(ps => ps.map(x => x.id === id ? { ...x, ...p } : x)),
    addPantryItem: (name, area, qty = '') => setPantry(ps => [...ps, { id: 'n' + Date.now(), area, name, qty, state: 'confirmed', added: true }]),
    confirmPantry: () => { setPantry(ps => ps.map(p => p.state === 'found' ? { ...p, state: 'confirmed' } : p)); setPantryDone(true); setStack([]); toastMsg({ tone: 'success', icon: 'refrigerator', title: 'Pantry confirmed', message: "We won't buy what you already have." }); },
    setStore: id => { if (id === storeId) return; const st = D.stores.find(x => x.id === id); setStoreId(id); toastMsg({ icon: 'store', title: `Reading ${st.name}'s weekly ad…` }); setTimeout(() => toastMsg({ tone: 'success', icon: 'tag', title: `${st.deals} deals found`, message: 'Café will flag any plan changes for you to review.' }), 1400); },
    setOrderVia: id => { setOrderVia(id); if (id === 'amazon' && storeId !== 'amazon') { setStoreId('amazon'); toastMsg({ icon: 'store', title: 'Switched ads to Amazon Fresh', message: 'So the deals match where you order.' }); } else if ((id === 'delivery' || id === 'pickup') && storeId === 'amazon') { setStoreId('cermak'); toastMsg({ icon: 'store', title: 'Switched ads to Cermak Produce', message: 'Amazon Fresh isn\'t on Instacart.' }); } },
    shareList: (how, who) => { setSheet(null); toastMsg({ tone: 'success', icon: 'send', title: how === 'notion' ? 'Notion page updated' : how === 'copy' ? 'List copied' : `List sent to ${who.join(' and ') || 'you'}`, message: how === 'notion' ? 'Grocery List · To Buy + Staples' : 'Checked items stay in sync here.' }); },
    queueAdd: meal => { setQueue(q => q.some(x => x.meal === meal) ? q : [...q, { meal, by: P.name }]); toastMsg({ tone: 'success', icon: 'list', title: 'Added to Up next', message: 'Café will work it into an upcoming week.' }); },
    queueRemove: meal => setQueue(q => q.filter(x => x.meal !== meal)),
    addRecipe: r => { setRecipes(rs => [r, ...rs]); toastMsg({ tone: 'success', icon: 'book-open', title: 'Saved to the recipe box' }); },
    toggleCheck: k => setChecked(c => ({ ...c, [k]: !c[k] })),
    setCartItem: (id, v) => setCart(c => ({ ...c, [id]: v })),
    placeOrder: () => { setOrder('placed'); setStack([{ type: 'track' }]); toastMsg({ tone: 'success', icon: 'truck', title: 'Order placed', message: 'Saturday, 9–11am' }); },
    advanceOrder: () => setOrder(o => ({ placed: 'shopping', shopping: 'delivering', delivering: 'delivered' })[o] || o),
    decideSub: v => { setSub(v); toastMsg({ tone: v === 'approved' ? 'success' : 'neutral', icon: v === 'approved' ? 'check' : 'x', title: v === 'approved' ? 'Cotija approved' : "Refunded — we'll skip it" }); },
    chatSend: text => {
      setChat(c => [...c, { from: 'me', text }, { from: 'cafe', typing: true }]);
      const r = CHAT[text] || { text: "Here's one way to do that. Take a look before I change anything.", proposal: { day: 'wed', meal: 'meatballs', label: 'Wednesday → Instant Pot Meatballs', detail: 'Uses freezer meatballs. 25 min, ~$12.' } };
      setTimeout(() => setChat(c => [...c.filter(m => !m.typing), { from: 'cafe', text: r.text, proposal: { ...r.proposal, state: 'pending' } }]), 1100);
    },
    resolveProposal: (i, how) => setChat(c => c.map((m, j) => { if (j !== i) return m; if (how === 'apply') { const p = m.proposal; if (p.meal) { const old = slots.find(s => s.day === p.day).meal; patch(p.day, { meal: p.meal, kind: 'cook', status: 'edited', by: P.name + ' via Café', votes: { [user]: 'up' } }); logDiff(old, p.meal); } else api.setText(p.day, p.text); toastMsg({ tone: 'success', icon: 'check', title: 'Plan updated', message: p.label }); } return { ...m, proposal: { ...m.proposal, state: how === 'apply' ? 'applied' : 'dismissed' } }; })),
  };
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
const useApp = () => React.useContext(Ctx);
Object.assign(window, { AppProvider, useApp });
})();
