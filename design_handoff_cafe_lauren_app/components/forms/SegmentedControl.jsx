import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function SegmentedControl({ options = [], value, onChange, size = 'm', style }) {
  const h = size === 's' ? 30 : 36;
  const opts = options.map(o => typeof o === 'string' ? { value: o, label: o } : o);
  return (
    <div role="radiogroup" style={{ display: 'inline-flex', gap: 2, padding: 3, background: 'var(--linen-200)', borderRadius: 'var(--radius-pill)', ...style }}>
      {opts.map(o => { const on = o.value === value; return (
        <button key={o.value} type="button" role="radio" aria-checked={on} onClick={() => onChange && onChange(o.value)} className="cl-focus"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: h, padding: '0 14px', border: 0, borderRadius: 'var(--radius-pill)', cursor: 'pointer', background: on ? 'var(--surface-raised)' : 'transparent', boxShadow: on ? 'var(--shadow-1)' : 'none', color: on ? 'var(--text-strong)' : 'var(--text-muted)', font: `600 ${size === 's' ? 12 : 13}px/1 var(--font-sans)`, transition: 'background var(--dur-fast), color var(--dur-fast)' }}>
          {o.icon && <Icon name={o.icon} size={16} />}{o.label}
        </button>); })}
    </div>
  );
}
