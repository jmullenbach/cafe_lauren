import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

export interface TooltipProps {
  label: ReactNode;
  children: ReactNode;
  placement?: 'top' | 'bottom';
  /** Force visible (docs) */
  open?: boolean;
  style?: CSSProperties;
}

/** Small charcoal hover label. */
export function Tooltip({ label, children, placement = 'top', open, style }: TooltipProps) {
  const [h, setH] = useState(false);
  const show = open ?? h;
  const pos: CSSProperties = placement === 'bottom' ? { top: 'calc(100% + 8px)' } : { bottom: 'calc(100% + 8px)' };
  return (
    <span onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ position: 'relative', display: 'inline-flex', ...style }}>
      {children}
      <span role="tooltip" style={{ position: 'absolute', left: '50%', ...pos, transform: `translateX(-50%) translateY(${show ? 0 : placement === 'bottom' ? -4 : 4}px)`, opacity: show ? 1 : 0, pointerEvents: 'none', whiteSpace: 'nowrap', padding: '6px 10px', borderRadius: 'var(--radius-s)', background: 'var(--surface-inverse)', color: 'var(--text-inverse)', font: '500 12px/1.3 var(--font-sans)', boxShadow: 'var(--shadow-2)', transition: 'opacity var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)', zIndex: 50 }}>{label}</span>
    </span>
  );
}
