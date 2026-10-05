(() => {
const { Icon, IconButton, Avatar, TabBar, Toast } = window.CafeLaurenDesignSystem_9f0e0a;

function Screen({ children, bottom = 110, style }) {
  return <div className="clm-scroll" style={{ position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'none', padding: `58px 20px ${bottom}px`, ...style }}>{children}</div>;
}
function LargeTitle({ overline, title, right, sub }) {
  return (
    <header style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: '8px 0 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 28 }}>
        <span style={{ font: 'var(--type-overline)', letterSpacing: 'var(--ls-overline)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{overline}</span>
        <div style={{ display: 'flex', gap: 4 }}>{right}</div>
      </div>
      <h1 style={{ font: '300 36px/1.05 var(--font-serif)', letterSpacing: 'var(--ls-display)', color: 'var(--text-strong)' }}>{title}</h1>
      {sub && <p style={{ font: '400 14px/1.45 var(--font-sans)', color: 'var(--text-body)' }}>{sub}</p>}
    </header>
  );
}
function BackHeader({ title, onBack, right }) {
  return (
    <div style={{ position: 'sticky', top: -58, zIndex: 5, margin: '-58px -20px 12px', padding: '54px 12px 8px', display: 'flex', alignItems: 'center', gap: 4, background: 'var(--glass-bg)', backdropFilter: 'var(--blur-glass)', WebkitBackdropFilter: 'var(--blur-glass)', borderBottom: '1px solid var(--border-subtle)' }}>
      <IconButton icon="chevron-left" label="Back" onClick={onBack} />
      <span style={{ flex: 1, minWidth: 0, font: '600 15px/1.2 var(--font-sans)', color: 'var(--text-strong)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</span>
      {right}
    </div>
  );
}
function SectionHead({ title, aside, onAside }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, margin: '28px 0 12px' }}>
      <h2 style={{ font: '400 22px/1.2 var(--font-serif)', color: 'var(--text-strong)' }}>{title}</h2>
      {aside && <button type="button" onClick={onAside} style={{ background: 'none', border: 0, padding: 0, cursor: onAside ? 'pointer' : 'default', font: '600 13px/1 var(--font-sans)', color: onAside ? 'var(--sage-700)' : 'var(--text-muted)' }}>{aside}</button>}
    </div>
  );
}
function MealPhoto({ height = 160, radius = 'var(--radius-m)', children, style }) {
  return (
    <div style={{ position: 'relative', height, borderRadius: radius, background: 'var(--linen-200)', overflow: 'hidden', display: 'grid', placeItems: 'center', color: 'var(--linen-400)', ...style }}>
      <Icon name="cooking-pot" size={Math.min(44, height / 3)} stroke={1.25} />
      {children}
    </div>
  );
}
function Why({ items, basis }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '12px 14px', borderRadius: 'var(--radius-s)', background: 'var(--sage-50)' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: '600 12px/1 var(--font-sans)', color: 'var(--sage-700)' }}><Icon name="sparkles" size={13} stroke={2} />Why Café suggested this</span>
      {basis && <span style={{ font: '400 13px/1.4 var(--font-sans)', color: 'var(--sage-900)' }}>You said: “{basis}”</span>}
      {items.map(w => <span key={w} style={{ font: '400 13px/1.4 var(--font-sans)', color: 'var(--text-body)' }}>· {w}</span>)}
    </div>
  );
}
function ListRow({ icon, iconColor, title, sub, right, onClick, last }) {
  return (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 56, padding: '10px 0', borderBottom: last ? 0 : '1px solid var(--border-subtle)', cursor: onClick ? 'pointer' : undefined }}>
      {icon && <span style={{ width: 36, height: 36, flex: 'none', borderRadius: 'var(--radius-s)', display: 'grid', placeItems: 'center', background: 'var(--linen-100)', color: iconColor || 'var(--text-body)' }}><Icon name={icon} size={18} /></span>}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span style={{ font: '500 15px/1.3 var(--font-sans)', color: 'var(--text-strong)' }}>{title}</span>
        {sub && <span style={{ font: '400 13px/1.35 var(--font-sans)', color: 'var(--text-muted)' }}>{sub}</span>}
      </div>
      {right}{onClick && !right && <Icon name="chevron-right" size={18} style={{ color: 'var(--text-faint)' }} />}
    </div>
  );
}
function BottomBar({ children }) {
  return <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 20, display: 'flex', gap: 8, padding: '12px 20px 30px', background: 'var(--glass-bg)', backdropFilter: 'var(--blur-glass)', WebkitBackdropFilter: 'var(--blur-glass)', borderTop: '1px solid var(--border-subtle)' }}>{children}</div>;
}
function AskFab({ onClick }) {
  return (
    <button type="button" onClick={onClick} style={{ position: 'absolute', right: 16, bottom: 100, zIndex: 25, display: 'inline-flex', alignItems: 'center', gap: 8, height: 48, padding: '0 18px 0 14px', borderRadius: 999, border: 0, cursor: 'pointer', background: 'var(--char-900)', color: 'var(--linen-50)', boxShadow: 'var(--shadow-3)', font: '600 14px/1 var(--font-sans)' }}>
      <Icon name="sparkles" size={18} style={{ color: 'var(--sage-300)' }} />Ask Café
    </button>
  );
}

function PhoneApp({ homeVariant, planVariant }) {
  const a = useApp();
  const top = a.stack[a.stack.length - 1];
  const newReq = a.requests.filter(r => r.status === 'new').length + (a.pantryDone ? 0 : 1);
  const pending = a.slots.filter(s => s.kind === 'cook' && (s.status === 'suggested' || s.status === 'thinking')).length;
  const listLeft = a.list.flatMap(s => s.items).filter(i => !a.checked[i.key]).length;
  const tabs = [
    { id: 'home', label: 'Home', icon: 'house' },
    { id: 'plan', label: 'Plan', icon: 'calendar-days', badge: pending || null },
    { id: 'list', label: 'List', icon: 'shopping-basket', badge: a.diff.length ? '!' : null },
    { id: 'recipes', label: 'Recipes', icon: 'book-open' },
    { id: 'inbox', label: 'Inbox', icon: 'message-circle', badge: newReq || null },
  ];
  let body;
  if (top) body = top.type === 'meal' ? <MealDetail {...top} /> : top.type === 'pantry' ? <PantryReview /> : top.type === 'order' ? <OrderReview /> : <Tracking />;
  else body = a.tab === 'home' ? (homeVariant === 'B' ? <HomeB /> : <HomeA />)
    : a.tab === 'plan' ? (planVariant === 'B' ? <PlanB /> : <PlanA />)
    : a.tab === 'list' ? <ListScreen left={listLeft} /> : a.tab === 'recipes' ? <RecipesScreen /> : <InboxScreen />;
  const s = a.sheet;
  return (
    <div style={{ position: 'relative', height: '100%', background: 'var(--surface-page)', overflow: 'hidden', fontFamily: 'var(--font-sans)' }}>
      {body}
      {!top && a.tab !== 'plan' && <AskFab onClick={() => a.openSheet({ type: 'chat' })} />}
      {!top && <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 30 }}><TabBar items={tabs} value={a.tab} onChange={a.setTab} /></div>}
      <SwapSheet open={s && s.type === 'swap'} day={s && s.day} />
      <RejectSheet open={s && s.type === 'reject'} day={s && s.day} />
      <EditMealSheet open={s && s.type === 'edit'} day={s && s.day} />
      <AddRecipeSheet open={s && s.type === 'add'} />
      <ScheduleSheet open={s && s.type === 'schedule'} meal={s && s.meal} />
      <ChatSheet open={s && s.type === 'chat'} />
      <StoreSheet open={s && s.type === 'store'} />
      <SendSheet open={s && s.type === 'send'} />
      {a.toastState && <div style={{ position: 'absolute', left: 12, right: 12, top: 56, zIndex: 120, display: 'flex', justifyContent: 'center' }}><Toast {...a.toastState} style={{ width: '100%' }} /></div>}
    </div>
  );
}
Object.assign(window, { Screen, LargeTitle, BackHeader, SectionHead, MealPhoto, Why, ListRow, BottomBar, AskFab, PhoneApp });
})();
