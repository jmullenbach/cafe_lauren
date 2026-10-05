import React from 'react';
import { IconButton } from '../core/IconButton.jsx';
export function Dialog({ open = true, onClose, title, description, children, actions, width = 480, inline, style }) {
  if (!open) return null;
  const box = (
    <div role="dialog" aria-modal="true" style={{ width, maxWidth: '100%', background: 'var(--surface-card)', borderRadius: 'var(--radius-dialog)', boxShadow: 'var(--shadow-3)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', ...style }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '24px 24px 0' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {title && <h2 style={{ font: '400 24px/1.2 var(--font-serif)', color: 'var(--text-strong)', letterSpacing: '-0.01em' }}>{title}</h2>}
          {description && <p style={{ font: '400 15px/1.5 var(--font-sans)', color: 'var(--text-body)' }}>{description}</p>}
        </div>
        {onClose && <IconButton icon="x" label="Close" size="s" onClick={onClose} />}
      </div>
      {children && <div style={{ padding: '20px 24px 0' }}>{children}</div>}
      {actions && <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: 24 }}>{actions}</div>}
      {!actions && <div style={{ height: 24 }} />}
    </div>
  );
  if (inline) return box;
  return (
    <div onClick={e => { if (e.target === e.currentTarget && onClose) onClose(); }} style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'grid', placeItems: 'center', padding: 24, background: 'var(--scrim)', backdropFilter: 'blur(2px)' }}>{box}</div>
  );
}
