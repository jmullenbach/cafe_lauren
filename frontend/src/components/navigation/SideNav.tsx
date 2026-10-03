import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Icon } from '../core/Icon';

export interface SideNavItem {
  id?: string;
  label?: string;
  icon?: string;
  badge?: number | string;
  badgeTone?: 'accent' | 'sale';
  section?: string;
}

function Item({ it, on, onClick }: { it: SideNavItem; on: boolean; onClick: () => void }) {
  const [h, setH] = useState(false);
  return (
    <button type="button" onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} className="cl-focus"
      style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', height: 40, padding: '0 12px', border: 0, borderRadius: 'var(--radius-s)', cursor: 'pointer', textAlign: 'left',
        background: on ? 'var(--linen-200)' : h ? 'var(--linen-100)' : 'transparent', color: on ? 'var(--text-strong)' : 'var(--text-body)', font: `${on ? 600 : 500} 14px/1 var(--font-sans)`, transition: 'background var(--dur-fast)' }}>
      {it.icon && <Icon name={it.icon} size={20} style={{ color: on ? 'var(--sage-700)' : 'var(--text-muted)' }} />}
      <span style={{ flex: 1 }}>{it.label}</span>
      {it.badge != null && <span style={{ minWidth: 20, height: 20, padding: '0 6px', borderRadius: 999, display: 'inline-grid', placeItems: 'center', background: it.badgeTone === 'sale' ? 'var(--terra-500)' : 'var(--sage-600)', color: '#fff', font: '600 11px/1 var(--font-sans)' }}>{it.badge}</span>}
    </button>
  );
}

export interface SideNavProps {
  items: SideNavItem[];
  value?: string;
  onChange?: (id: string) => void;
  header?: ReactNode;
  footer?: ReactNode;
  style?: CSSProperties;
}

/** App sidebar on the linen "sunken" surface (desktop reference; not used in the phone shell). */
export function SideNav({ items = [], value, onChange, header, footer, style }: SideNavProps) {
  return (
    <nav style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 'var(--sidebar-w)', padding: '24px 16px', background: 'var(--surface-sunken)', borderRight: '1px solid var(--border-subtle)', height: '100%', ...style }}>
      {header}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map((it) => it.section
          ? <div key={it.section} style={{ padding: '16px 12px 6px', font: '600 11px/1 var(--font-sans)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>{it.section}</div>
          : <Item key={it.id} it={it} on={it.id === value} onClick={() => it.id && onChange && onChange(it.id)} />)}
      </div>
      <div style={{ marginTop: 'auto' }}>{footer}</div>
    </nav>
  );
}
