import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function Checkbox({ checked, onChange, label, description, size = 'm', strike, disabled, style }) {
  const d = size === 'l' ? 24 : 20;
  return (
    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, ...style }}>
      <input type="checkbox" checked={!!checked} disabled={disabled} onChange={e => onChange && onChange(e.target.checked)} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
      <span style={{ width: d, height: d, flex: 'none', marginTop: label ? (size === 'l' ? 0 : 1) : 0, display: 'grid', placeItems: 'center', borderRadius: 5, border: `1.5px solid ${checked ? 'var(--sage-600)' : 'var(--border-strong)'}`, background: checked ? 'var(--sage-600)' : 'var(--surface-raised)', color: '#fff', transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast)' }}>
        {checked && <Icon name="check" size={d - 6} stroke={2.5} />}
      </span>
      {(label || description) && (
        <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
          {label && <span style={{ font: `400 ${size === 'l' ? 17 : 15}px/1.4 var(--font-sans)`, color: strike && checked ? 'var(--text-muted)' : 'var(--text-strong)', textDecoration: strike && checked ? 'line-through' : 'none', textDecorationColor: 'var(--text-faint)' }}>{label}</span>}
          {description && <span style={{ font: '400 13px/1.4 var(--font-sans)', color: 'var(--text-muted)' }}>{description}</span>}
        </span>
      )}
    </label>
  );
}
