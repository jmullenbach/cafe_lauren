import type { CSSProperties } from 'react';
import { Icon } from '../core/Icon';

export type SuggestedStatus = 'suggested' | 'edited' | 'kept' | 'approved' | 'rejected' | 'thinking' | 'draft';

const S: Record<SuggestedStatus, { icon: string; bg: string; fg: string; bd: string; text: string }> = {
  suggested: { icon: 'sparkles', bg: 'transparent', fg: 'var(--sage-700)', bd: '1px dashed var(--sage-300)', text: 'Suggested' },
  edited: { icon: 'pencil', bg: 'var(--oak-200)', fg: 'var(--oak-700)', bd: '1px solid transparent', text: 'Edited' },
  kept: { icon: 'check', bg: 'var(--sage-100)', fg: 'var(--sage-900)', bd: '1px solid transparent', text: 'Kept' },
  approved: { icon: 'circle-check', bg: 'var(--sage-600)', fg: '#fff', bd: '1px solid transparent', text: 'Approved' },
  rejected: { icon: 'x', bg: 'var(--terra-50)', fg: 'var(--terra-700)', bd: '1px solid transparent', text: 'Not this week' },
  thinking: { icon: 'sparkles', bg: 'var(--sage-50)', fg: 'var(--sage-700)', bd: '1px solid transparent', text: 'Finding options…' },
  draft: { icon: 'notebook-pen', bg: 'var(--honey-100)', fg: 'var(--honey-700)', bd: '1px solid transparent', text: 'Draft — check it' },
};

export interface SuggestedTagProps {
  status?: SuggestedStatus;
  /** Who acted, e.g. "Lauren" gives "Kept by Lauren". For suggested: "Café". */
  by?: string;
  /** Override text */
  label?: string;
  style?: CSSProperties;
}

/** Provenance + review status for anything the AI produced. Starts "suggested" (dashed) until a person acts. */
export function SuggestedTag({ status = 'suggested', by, label, style }: SuggestedTagProps) {
  const s = S[status] || S.suggested;
  const text = label || (by && status !== 'suggested' && status !== 'thinking' ? `${s.text} by ${by}` : status === 'suggested' && by ? `Suggested by ${by}` : s.text);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 22, padding: '0 8px', borderRadius: 'var(--radius-xs)', background: s.bg, color: s.fg, border: s.bd, font: '600 11.5px/1 var(--font-sans)', whiteSpace: 'nowrap', ...style }}>
      <Icon name={s.icon} size={12} stroke={2} />{text}
    </span>
  );
}
