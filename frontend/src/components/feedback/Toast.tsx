import type { CSSProperties, ReactNode } from 'react';
import { Icon } from '../core/Icon';

export type ToastTone = 'neutral' | 'success' | 'sale' | 'warning' | 'danger';
const TONE: Record<ToastTone, string> = { neutral: 'var(--linen-300)', success: 'var(--sage-300)', sale: 'var(--terra-300)', warning: 'var(--honey-300)', danger: '#E79A8C' };

export interface ToastProps {
  tone?: ToastTone;
  icon?: string;
  title?: ReactNode;
  message?: ReactNode;
  action?: string;
  onAction?: () => void;
  onClose?: () => void;
  style?: CSSProperties;
}

/** Charcoal snackbar for confirmations after an action. */
export function Toast({ tone = 'neutral', icon, title, message, action, onAction, onClose, style }: ToastProps) {
  return (
    <div role="status" style={{ display: 'flex', alignItems: 'flex-start', gap: 12, width: 380, maxWidth: '100%', padding: '14px 16px', background: 'var(--surface-inverse)', color: 'var(--text-inverse)', borderRadius: 'var(--radius-m)', boxShadow: 'var(--shadow-3)', ...style }}>
      {icon && <Icon name={icon} size={20} style={{ color: TONE[tone], marginTop: 1 }} />}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {title && <span style={{ font: '600 14px/1.35 var(--font-sans)' }}>{title}</span>}
        {message && <span style={{ font: '400 13px/1.45 var(--font-sans)', color: 'var(--linen-300)' }}>{message}</span>}
      </div>
      {action && <button type="button" onClick={onAction} style={{ background: 'none', border: 0, padding: '2px 0', cursor: 'pointer', color: TONE[tone] === TONE.neutral ? 'var(--sage-300)' : TONE[tone], font: '600 13px/1.3 var(--font-sans)' }}>{action}</button>}
      {onClose && <button type="button" aria-label="Dismiss" onClick={onClose} style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer', color: 'var(--char-300)' }}><Icon name="x" size={16} /></button>}
    </div>
  );
}
