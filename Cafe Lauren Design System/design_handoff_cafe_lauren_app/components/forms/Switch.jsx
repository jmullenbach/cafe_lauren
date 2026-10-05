import React from 'react';
export function Switch({ checked, onChange, label, description, disabled, style }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, ...style }}>
      <input type="checkbox" role="switch" checked={!!checked} disabled={disabled} onChange={e => onChange && onChange(e.target.checked)} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
      <span style={{ width: 38, height: 22, flex: 'none', borderRadius: 999, padding: 2, background: checked ? 'var(--sage-600)' : 'var(--linen-300)', transition: 'background var(--dur-base) var(--ease-out)' }}>
        <span style={{ display: 'block', width: 18, height: 18, borderRadius: 999, background: '#fff', boxShadow: '0 1px 2px rgba(36,34,31,.2)', transform: checked ? 'translateX(16px)' : 'none', transition: 'transform var(--dur-base) var(--ease-out)' }} />
      </span>
      {(label || description) && <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {label && <span style={{ font: '500 15px/1.3 var(--font-sans)', color: 'var(--text-strong)' }}>{label}</span>}
        {description && <span style={{ font: '400 13px/1.4 var(--font-sans)', color: 'var(--text-muted)' }}>{description}</span>}
      </span>}
    </label>
  );
}
