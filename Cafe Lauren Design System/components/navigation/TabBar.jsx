import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function TabBar({ items = [], value, onChange, safeArea = true, style }) {
  return (
    <nav style={{ display: 'flex', alignItems: 'stretch', padding: `6px 8px ${safeArea ? 26 : 6}px`, background: 'var(--glass-bg)', backdropFilter: 'var(--blur-glass)', WebkitBackdropFilter: 'var(--blur-glass)', borderTop: '1px solid var(--border-subtle)', ...style }}>
      {items.map(it => { const on = it.id === value; return (
        <button key={it.id} type="button" onClick={() => onChange && onChange(it.id)} aria-current={on ? 'page' : undefined}
          style={{ flex: 1, minWidth: 0, minHeight: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, background: 'none', border: 0, cursor: 'pointer', color: on ? 'var(--text-strong)' : 'var(--text-muted)', font: `${on ? 600 : 500} 11px/1 var(--font-sans)`, transition: 'color var(--dur-fast)' }}>
          <span style={{ position: 'relative', display: 'inline-flex' }}>
            <Icon name={it.icon} size={24} stroke={on ? 1.75 : 1.5} style={{ color: on ? 'var(--sage-700)' : 'currentColor' }} />
            {it.badge ? <span style={{ position: 'absolute', top: -4, right: -9, minWidth: 17, height: 17, padding: '0 5px', borderRadius: 999, display: 'grid', placeItems: 'center', background: 'var(--terra-500)', color: '#fff', font: '700 10px/1 var(--font-sans)', boxShadow: '0 0 0 2px var(--linen-50)' }}>{it.badge}</span> : null}
          </span>
          {it.label}
        </button>); })}
    </nav>
  );
}
