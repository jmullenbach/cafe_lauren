import React, { useState } from 'react';
import { Icon } from '../core/Icon.jsx';
export function PhotoTile({ src, label, meta, aspect = '3 / 4', onRemove, onClick, empty, style }) {
  const [h, setH] = useState(false);
  if (empty) return (
    <button type="button" onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ aspectRatio: aspect, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 'var(--radius-photo)', border: `1.5px dashed ${h ? 'var(--sage-500)' : 'var(--border-strong)'}`, background: h ? 'var(--sage-50)' : 'var(--surface-sunken)', color: h ? 'var(--sage-700)' : 'var(--text-muted)', cursor: 'pointer', font: '600 13px/1.3 var(--font-sans)', transition: 'all var(--dur-fast)', ...style }}>
      <Icon name="camera" size={28} stroke={1.25} />{label || 'Add photo'}
    </button>
  );
  return (
    <figure onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ position: 'relative', margin: 0, aspectRatio: aspect, borderRadius: 'var(--radius-photo)', overflow: 'hidden', background: 'var(--linen-200)', cursor: onClick ? 'pointer' : undefined, ...style }}>
      {src && <img src={src} alt={label || ''} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
      {(label || meta) && <figcaption style={{ position: 'absolute', inset: 'auto 0 0 0', padding: '28px 12px 10px', background: 'var(--photo-protect)', color: '#fff', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {label && <span style={{ font: '600 13px/1.25 var(--font-sans)' }}>{label}</span>}
        {meta && <span style={{ font: '400 12px/1.25 var(--font-sans)', opacity: 0.85 }}>{meta}</span>}
      </figcaption>}
      {onRemove && <button type="button" aria-label="Remove photo" onClick={e => { e.stopPropagation(); onRemove(); }} style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: 999, border: 0, display: 'grid', placeItems: 'center', background: 'var(--glass-bg)', backdropFilter: 'var(--blur-glass)', color: 'var(--text-strong)', cursor: 'pointer', opacity: h ? 1 : 0, transition: 'opacity var(--dur-fast)' }}><Icon name="x" size={14} /></button>}
    </figure>
  );
}
