import React, { useState } from 'react';
import { Icon } from '../core/Icon.jsx';
export function Select({ label, options = [], value, defaultValue, onChange, size = 'm', style }) {
  const [f, setF] = useState(false);
  const h = size === 's' ? 32 : size === 'l' ? 48 : 40;
  const opts = options.map(o => typeof o === 'string' ? { value: o, label: o } : o);
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label && <span style={{ font: '600 13px/1.2 var(--font-sans)', color: 'var(--text-strong)' }}>{label}</span>}
      <span style={{ position: 'relative', display: 'flex' }}>
        <select value={value} defaultValue={defaultValue} onChange={onChange} onFocus={() => setF(true)} onBlur={() => setF(false)}
          style={{ appearance: 'none', WebkitAppearance: 'none', width: '100%', height: h, padding: '0 36px 0 12px', background: 'var(--surface-raised)', color: 'var(--text-strong)', font: '400 15px/1 var(--font-sans)', border: `1px solid ${f ? 'var(--border-focus)' : 'var(--border-default)'}`, borderRadius: 'var(--radius-control)', boxShadow: f ? 'var(--focus-ring)' : 'none', outline: 0, cursor: 'pointer' }}>
          {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}><Icon name="chevron-down" size={18} /></span>
      </span>
    </label>
  );
}
