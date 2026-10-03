import React, { useState } from 'react';
import { Icon } from '../core/Icon.jsx';
export function Input({ label, hint, error, icon, value, defaultValue, onChange, placeholder, multiline, rows = 3, size = 'm', type = 'text', style }) {
  const [f, setF] = useState(false);
  const h = size === 's' ? 32 : size === 'l' ? 48 : 40;
  const bd = error ? 'var(--status-danger)' : f ? 'var(--border-focus)' : 'var(--border-default)';
  const field = { flex: 1, minWidth: 0, border: 0, outline: 0, background: 'transparent', color: 'var(--text-strong)', font: `400 ${size === 'l' ? 16 : 15}px/1.4 var(--font-sans)`, padding: multiline ? '10px 0' : 0, resize: 'vertical' };
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label && <span style={{ font: '600 13px/1.2 var(--font-sans)', color: 'var(--text-strong)' }}>{label}</span>}
      <span style={{ display: 'flex', alignItems: multiline ? 'flex-start' : 'center', gap: 10, minHeight: h, padding: '0 12px', background: 'var(--surface-raised)', border: `1px solid ${bd}`, borderRadius: 'var(--radius-control)', boxShadow: f ? 'var(--focus-ring)' : 'var(--shadow-inset)', transition: 'border-color var(--dur-fast), box-shadow var(--dur-fast)' }}>
        {icon && <span style={{ color: 'var(--text-muted)', paddingTop: multiline ? 11 : 0 }}><Icon name={icon} size={18} /></span>}
        <Tag type={multiline ? undefined : type} rows={multiline ? rows : undefined} value={value} defaultValue={defaultValue} onChange={onChange} placeholder={placeholder} onFocus={() => setF(true)} onBlur={() => setF(false)} style={field} />
      </span>
      {(error || hint) && <span style={{ font: '400 12px/1.4 var(--font-sans)', color: error ? 'var(--status-danger)' : 'var(--text-muted)' }}>{error || hint}</span>}
    </label>
  );
}
