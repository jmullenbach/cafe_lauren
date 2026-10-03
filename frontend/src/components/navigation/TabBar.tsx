import type { CSSProperties } from 'react';
import { Icon } from '../core/Icon';

export interface TabBarItem {
  id: string;
  label: string;
  icon: string;
  /** Terracotta count; a string such as "!" is also accepted */
  badge?: number | string | null;
}

export interface TabBarProps {
  items: TabBarItem[];
  value?: string;
  onChange?: (id: string) => void;
  /** Adds bottom padding for the home indicator. Default true. */
  safeArea?: boolean;
  style?: CSSProperties;
}

/** Phone bottom tab bar on frosted linen. 4-5 items; badge shows a terracotta count. */
export function TabBar({ items = [], value, onChange, safeArea = true, style }: TabBarProps) {
  return (
    <nav aria-label="Main" style={{ display: 'flex', alignItems: 'stretch', padding: `6px 8px ${safeArea ? 'max(26px, env(safe-area-inset-bottom))' : '6px'}`, background: 'var(--glass-bg)', backdropFilter: 'var(--blur-glass)', WebkitBackdropFilter: 'var(--blur-glass)', borderTop: '1px solid var(--border-subtle)', ...style }}>
      {items.map((it) => {
        const on = it.id === value;
        return (
          <button key={it.id} type="button" onClick={() => onChange && onChange(it.id)} aria-current={on ? 'page' : undefined} data-tab={it.id}
            style={{ flex: 1, minWidth: 0, minHeight: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, background: 'none', border: 0, cursor: 'pointer', color: on ? 'var(--text-strong)' : 'var(--text-muted)', font: `${on ? 600 : 500} 11px/1 var(--font-sans)`, transition: 'color var(--dur-fast)' }}>
            <span style={{ position: 'relative', display: 'inline-flex' }}>
              <Icon name={it.icon} size={24} stroke={on ? 1.75 : 1.5} style={{ color: on ? 'var(--sage-700)' : 'currentColor' }} />
              {it.badge ? <span style={{ position: 'absolute', top: -4, right: -9, minWidth: 17, height: 17, padding: '0 5px', borderRadius: 999, display: 'grid', placeItems: 'center', background: 'var(--terra-500)', color: '#fff', font: '700 10px/1 var(--font-sans)', boxShadow: '0 0 0 2px var(--linen-50)' }}>{it.badge}</span> : null}
            </span>
            {it.label}
          </button>
        );
      })}
    </nav>
  );
}
