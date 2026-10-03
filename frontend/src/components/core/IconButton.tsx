import { useState } from 'react';
import type { CSSProperties, MouseEvent } from 'react';
import type { ControlVariant } from '../types';
import { Icon } from './Icon';

const PAL: Record<ControlVariant, { bg: string; hov: string; fg: string; bd: string }> = {
  primary: { bg: 'var(--action-primary)', hov: 'var(--action-primary-hover)', fg: 'var(--action-primary-text)', bd: 'transparent' },
  accent: { bg: 'var(--action-accent)', hov: 'var(--action-accent-hover)', fg: 'var(--action-accent-text)', bd: 'transparent' },
  secondary: { bg: 'var(--surface-raised)', hov: 'var(--linen-100)', fg: 'var(--text-strong)', bd: 'var(--border-default)' },
  ghost: { bg: 'transparent', hov: 'var(--linen-200)', fg: 'var(--text-strong)', bd: 'transparent' },
  danger: { bg: 'var(--tomato-500)', hov: 'var(--tomato-700)', fg: '#fff', bd: 'transparent' },
};
const SZ = { s: [32, 16], m: [40, 20], l: [48, 22] } as const;

export interface IconButtonProps {
  icon: string;
  /** Accessible label + native tooltip */
  label: string;
  variant?: ControlVariant;
  size?: 's' | 'm' | 'l';
  round?: boolean;
  /** Toggled-on state (sage tint) */
  active?: boolean;
  disabled?: boolean;
  onClick?: (e: MouseEvent) => void;
  style?: CSSProperties;
}

/** Square (or round) icon-only button. Always pass a label for accessibility. */
export function IconButton({ icon, label, variant = 'ghost', size = 'm', round, active, disabled, onClick, style }: IconButtonProps) {
  const [h, setH] = useState(false);
  const c = PAL[variant] || PAL.ghost;
  const [d, ic] = SZ[size] || SZ.m;
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="cl-focus"
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        width: d, height: d, display: 'inline-grid', placeItems: 'center', padding: 0, borderRadius: round ? 'var(--radius-pill)' : 'var(--radius-control)',
        background: active ? 'var(--sage-100)' : h && !disabled ? c.hov : c.bg, color: active ? 'var(--sage-900)' : c.fg, border: `1px solid ${c.bd}`,
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1, transition: 'background var(--dur-fast) var(--ease-out)', ...style,
      }}
    >
      <Icon name={icon} size={ic} />
    </button>
  );
}
