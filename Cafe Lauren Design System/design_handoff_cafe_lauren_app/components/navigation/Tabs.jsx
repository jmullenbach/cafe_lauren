import React from 'react';
export function Tabs({ tabs = [], value, onChange, style }) {
  return (
    <div role="tablist" style={{ display: 'flex', gap: 28, borderBottom: '1px solid var(--border-default)', ...style }}>
      {tabs.map(t => { const on = t.id === value; return (
        <button key={t.id} role="tab" aria-selected={on} type="button" onClick={() => onChange && onChange(t.id)}
          style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 0 12px', background: 'none', border: 0, cursor: 'pointer', font: '600 14px/1.2 var(--font-sans)', color: on ? 'var(--text-strong)' : 'var(--text-muted)', transition: 'color var(--dur-fast)' }}>
          {t.label}
          {t.count != null && <span style={{ minWidth: 20, height: 18, padding: '0 6px', borderRadius: 999, display: 'inline-grid', placeItems: 'center', background: on ? 'var(--char-900)' : 'var(--linen-200)', color: on ? 'var(--linen-50)' : 'var(--text-body)', font: '600 11px/1 var(--font-sans)' }}>{t.count}</span>}
          <span style={{ position: 'absolute', left: 0, right: 0, bottom: -1, height: 2, background: on ? 'var(--char-900)' : 'transparent', transition: 'background var(--dur-fast)' }} />
        </button>); })}
    </div>
  );
}
