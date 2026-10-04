import type { CSSProperties, MouseEvent } from 'react';
import type { PersonColor } from '../types';
import { useWeekData } from '../../state/useWeekSlots';

/** Tints per person color: dot and edge, soft fill, ink. Lauren sage, Joe slate, Leidy terra. */
export const COOK_TONE: Record<PersonColor, { dot: string; bg: string; ink: string; edge: string }> = {
  sage: { dot: 'var(--sage-600)', bg: 'var(--sage-100)', ink: 'var(--sage-900)', edge: 'var(--sage-500)' },
  slate: { dot: 'var(--slate-500)', bg: 'var(--slate-100)', ink: 'var(--slate-700)', edge: 'var(--slate-500)' },
  terra: { dot: 'var(--terra-500)', bg: 'var(--terra-100)', ink: 'var(--terra-700)', edge: 'var(--terra-500)' },
  oak: { dot: 'var(--oak-500)', bg: 'var(--oak-200)', ink: 'var(--oak-700)', edge: 'var(--oak-500)' },
  honey: { dot: 'var(--honey-500)', bg: 'var(--honey-100)', ink: 'var(--honey-700)', edge: 'var(--honey-500)' },
};

/** The person who cooks, with their color, or undefined when unset or unknown. */
export function useCookPerson(cook?: string | null) {
  const { personOf } = useWeekData();
  const p = cook ? personOf(cook) : undefined;
  return p ? { key: p.key, name: p.name, tone: COOK_TONE[(p.color as PersonColor)] ?? COOK_TONE.sage } : undefined;
}

export interface CookChipProps {
  /** Person key, or empty when nobody is chosen yet. */
  cook?: string | null;
  onClick?: (e: MouseEvent) => void;
  /** Just the name ("Lauren") instead of "Lauren cooks"; unset shows "?". For dense rows. */
  compact?: boolean;
  style?: CSSProperties;
}

/** Who's cooking tonight: a pill with a color dot in the person's color. Dashed and neutral while unset. */
export function CookChip({ cook, onClick, compact, style }: CookChipProps) {
  const p = useCookPerson(cook);
  const unset = !p;
  const label = p ? (compact ? p.name : `${p.name} cooks`) : compact ? '?' : "Who's cooking?";
  const aria = p ? `${p.name} cooks. Pick who cooks` : "Who's cooking? Pick who cooks";
  return (
    <button type="button" data-testid="cook-chip" data-cook={p?.key ?? ''} aria-label={aria} onClick={onClick} disabled={!onClick} className="cl-focus"
      style={{ display: 'inline-flex', flex: 'none', alignItems: 'center', gap: 6, height: 24, padding: compact ? '0 8px 0 6px' : '0 10px 0 7px', borderRadius: 'var(--radius-pill)', whiteSpace: 'nowrap', cursor: onClick ? 'pointer' : 'default', font: '600 12px/1 var(--font-sans)',
        background: p ? p.tone.bg : 'transparent', color: p ? p.tone.ink : 'var(--text-muted)', border: p ? '1px solid transparent' : '1px dashed var(--border-strong)', ...style }}>
      {p && <span aria-hidden style={{ width: 10, height: 10, borderRadius: 999, background: p.tone.dot, flex: 'none' }} />}
      {unset && !compact && <span aria-hidden style={{ width: 10, height: 10, borderRadius: 999, border: '1.5px dashed var(--char-300)', flex: 'none' }} />}
      {label}
    </button>
  );
}
