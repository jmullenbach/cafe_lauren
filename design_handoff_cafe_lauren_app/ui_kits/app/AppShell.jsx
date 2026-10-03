(() => {
const { SideNav, Avatar, Icon } = window.CafeLaurenDesignSystem_9f0e0a;

function Wordmark() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '4px 12px 8px' }}>
      <span style={{ font: '400 26px/1 var(--font-serif)', letterSpacing: '-0.01em', color: 'var(--text-strong)' }}>Café Lauren</span>
      <span style={{ font: '500 12px/1 var(--font-sans)', color: 'var(--text-muted)' }}>{window.CL_DATA.week}</span>
    </div>
  );
}

function DeliveryNote({ ordered }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 10, padding: 12, borderRadius: 'var(--radius-m)', background: 'var(--surface-card)', border: '1px solid var(--border-subtle)' }}>
        <Icon name="truck" size={18} style={{ color: ordered ? 'var(--sage-600)' : 'var(--text-muted)', marginTop: 1 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{ font: '600 13px/1.2 var(--font-sans)', color: 'var(--text-strong)' }}>{ordered ? 'Delivery booked' : 'Delivery not booked'}</span>
          <span style={{ font: '400 12px/1.3 var(--font-sans)', color: 'var(--text-muted)' }}>{ordered ? 'Saturday, 9–11am · Instacart' : 'Usually Saturday morning'}</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 4px' }}>
        <Avatar name="Lauren" color="sage" size={30} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ font: '600 13px/1 var(--font-sans)', color: 'var(--text-strong)' }}>Lauren</span>
          <span style={{ font: '400 12px/1 var(--font-sans)', color: 'var(--text-muted)' }}>Household of 5</span>
        </div>
      </div>
    </div>
  );
}

function AppShell({ screen, onNav, listCount, requestCount, ordered, children }) {
  const items = [
    { section: 'Gather' },
    { id: 'intake', label: 'Requests & pantry', icon: 'message-circle', badge: requestCount || null },
    { section: 'Plan' },
    { id: 'week', label: 'This week', icon: 'calendar-days' },
    { id: 'list', label: 'Grocery list', icon: 'shopping-basket', badge: listCount || null },
    { section: 'Cook' },
    { id: 'cook', label: 'Tonight', icon: 'chef-hat' },
  ];
  return (
    <div style={{ display: 'flex', height: '100vh', minHeight: 640 }}>
      <SideNav items={items} value={screen} onChange={onNav} header={<Wordmark />} footer={<DeliveryNote ordered={ordered} />} style={{ flex: 'none' }} />
      <main style={{ flex: 1, minWidth: 0, overflow: 'auto' }}>{children}</main>
    </div>
  );
}

function PageHeader({ overline, title, sub, actions }) {
  return (
    <header style={{ display: 'flex', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap', marginBottom: 32 }}>
      <div style={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {overline && <span style={{ font: 'var(--type-overline)', letterSpacing: 'var(--ls-overline)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{overline}</span>}
        <h1 style={{ font: '300 44px/1.05 var(--font-serif)', letterSpacing: 'var(--ls-display)', color: 'var(--text-strong)' }}>{title}</h1>
        {sub && <p style={{ font: '400 15px/1.5 var(--font-sans)', color: 'var(--text-body)', maxWidth: 640 }}>{sub}</p>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 8 }}>{actions}</div>}
    </header>
  );
}

function SectionTitle({ children, aside }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, margin: '0 0 16px' }}>
      <h2 style={{ font: '400 24px/1.2 var(--font-serif)', color: 'var(--text-strong)' }}>{children}</h2>
      {aside && <span style={{ font: '500 13px/1 var(--font-sans)', color: 'var(--text-muted)' }}>{aside}</span>}
    </div>
  );
}

Object.assign(window, { AppShell, PageHeader, SectionTitle });
})();
