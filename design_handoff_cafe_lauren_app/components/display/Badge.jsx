import React from 'react';
import { Icon } from '../core/Icon.jsx';
const T = {
  neutral: ['var(--linen-200)', 'var(--char-700)', 'var(--char-700)'],
  sale: ['var(--status-sale-bg)', 'var(--terra-700)', 'var(--status-sale)'],
  success: ['var(--status-success-bg)', 'var(--sage-700)', 'var(--status-success)'],
  warning: ['var(--status-warning-bg)', 'var(--honey-700)', 'var(--honey-500)'],
  danger: ['var(--status-danger-bg)', 'var(--tomato-700)', 'var(--status-danger)'],
  info: ['var(--status-info-bg)', 'var(--slate-700)', 'var(--status-info)'],
  accent: ['var(--sage-100)', 'var(--sage-900)', 'var(--sage-600)'],
};
export function Badge({ tone = 'neutral', variant = 'soft', icon, children, style }) {
  const [bg, fg, solid] = T[tone] || T.neutral;
  const s = variant === 'solid';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, height: 22, padding: '0 8px', borderRadius: 'var(--radius-xs)', background: s ? solid : bg, color: s ? '#fff' : fg, font: '600 12px/1 var(--font-sans)', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums', ...style }}>
      {icon && <Icon name={icon} size={13} stroke={2} />}{children}
    </span>
  );
}
