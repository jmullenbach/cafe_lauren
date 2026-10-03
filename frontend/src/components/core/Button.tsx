import { useState } from 'react';
import type { CSSProperties, MouseEvent, ReactNode } from 'react';
import type { ControlVariant } from '../types';
import { Icon } from './Icon';

const PAL: Record<ControlVariant, { bg: string; hov: string; fg: string; bd: string }> = {
  primary: { bg: 'var(--action-primary)', hov: 'var(--action-primary-hover)', fg: 'var(--action-primary-text)', bd: 'transparent' },
  accent: { bg: 'var(--action-accent)', hov: 'var(--action-accent-hover)', fg: 'var(--action-accent-text)', bd: 'transparent' },
  secondary: { bg: 'var(--surface-raised)', hov: 'var(--linen-100)', fg: 'var(--text-strong)', bd: 'var(--border-default)' },
  ghost: { bg: 'transparent', hov: 'var(--linen-200)', fg: 'var(--text-strong)', bd: 'transparent' },
  danger: { bg: 'var(--tomato-500)', hov: 'var(--tomato-700)', fg: '#fff', bd: 'transparent' },
};
const SZ = {
  s: { h: 32, px: 12, fs: 13, ic: 16, gap: 6 },
  m: { h: 40, px: 16, fs: 14, ic: 18, gap: 8 },
  l: { h: 48, px: 22, fs: 15, ic: 20, gap: 8 },
};

export interface ButtonProps {
  variant?: ControlVariant;
  size?: 's' | 'm' | 'l';
  /** Lucide icon name shown before the label */
  icon?: string;
  /** Lucide icon name shown after the label */
  iconRight?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit';
  onClick?: (e: MouseEvent) => void;
  children?: ReactNode;
  style?: CSSProperties;
}

/** Primary action control. Charcoal "primary" for the one main action per view; sage "accent" for confirm/approve. */
export function Button({ variant = 'primary', size = 'm', icon, iconRight, fullWidth, disabled, children, onClick, type = 'button', style }: ButtonProps) {
  const [h, setH] = useState(false);
  const [p, setP] = useState(false);
  const c = PAL[variant] || PAL.primary;
  const s = SZ[size] || SZ.m;
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="cl-focus"
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => { setH(false); setP(false); }}
      onMouseDown={() => setP(true)}
      onMouseUp={() => setP(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: s.gap, height: s.h, padding: `0 ${s.px}px`,
        width: fullWidth ? '100%' : undefined, font: `600 ${s.fs}px/1 var(--font-sans)`, letterSpacing: 'var(--ls-button)', whiteSpace: 'nowrap',
        borderRadius: 'var(--radius-control)', background: h && !disabled ? c.hov : c.bg, color: c.fg,
        border: `1px solid ${h && variant === 'secondary' ? 'var(--border-strong)' : c.bd}`, opacity: disabled ? 0.45 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer', transform: p && !disabled ? 'scale(0.98)' : 'none',
        transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast), transform var(--dur-fast) var(--ease-out)', ...style,
      }}
    >
      {icon && <Icon name={icon} size={s.ic} />}
      {children}
      {iconRight && <Icon name={iconRight} size={s.ic} />}
    </button>
  );
}
