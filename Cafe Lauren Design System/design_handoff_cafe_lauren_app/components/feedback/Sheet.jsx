import React, { useEffect, useState } from 'react';
export function Sheet({ open, onClose, title, subtitle, children, footer, maxHeight = '88%', style }) {
  const [shown, setShown] = useState(false);
  const [mounted, setMounted] = useState(open);
  useEffect(() => {
    if (open) { setMounted(true); const r = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true))); return () => cancelAnimationFrame(r); }
    setShown(false); const t = setTimeout(() => setMounted(false), 260); return () => clearTimeout(t);
  }, [open]);
  if (!mounted) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 80, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'var(--scrim)', opacity: shown ? 1 : 0, transition: 'opacity var(--dur-base) var(--ease-out)' }} />
      <div role="dialog" aria-modal="true" style={{ position: 'relative', maxHeight, display: 'flex', flexDirection: 'column', background: 'var(--surface-page)', borderRadius: '20px 20px 0 0', boxShadow: 'var(--shadow-3)', transform: shown ? 'none' : 'translateY(100%)', transition: 'transform var(--dur-slow) var(--ease-out)', ...style }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 4px' }}><span style={{ width: 36, height: 5, borderRadius: 999, background: 'var(--linen-300)' }} /></div>
        {(title || subtitle) && <div style={{ padding: '8px 20px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {title && <h2 style={{ font: '400 24px/1.2 var(--font-serif)', letterSpacing: '-0.01em', color: 'var(--text-strong)' }}>{title}</h2>}
          {subtitle && <p style={{ font: '400 14px/1.45 var(--font-sans)', color: 'var(--text-muted)' }}>{subtitle}</p>}
        </div>}
        <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '4px 20px 20px' }}>{children}</div>
        {footer && <div style={{ display: 'flex', gap: 8, padding: '12px 20px 30px', borderTop: '1px solid var(--border-subtle)', background: 'var(--surface-page)' }}>{footer}</div>}
      </div>
    </div>
  );
}
