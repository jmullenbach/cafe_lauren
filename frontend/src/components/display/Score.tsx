import type { CSSProperties } from 'react';

export interface ScoreProps {
  label?: string;
  value: number;
  max?: number;
  /** sage = healthy, terra = delicious, honey = other */
  tone?: 'sage' | 'terra' | 'honey';
  /** Inline value only, no bar */
  compact?: boolean;
  style?: CSSProperties;
}

/** x/10 rating with a segmented bar: Healthiness and Deliciousness on every meal. */
export function Score({ label, value = 0, max = 10, tone = 'sage', compact, style }: ScoreProps) {
  const col = tone === 'terra' ? 'var(--terra-500)' : tone === 'honey' ? 'var(--honey-500)' : 'var(--sage-500)';
  return (
    <span style={{ display: 'inline-flex', flexDirection: compact ? 'row' : 'column', alignItems: compact ? 'center' : 'stretch', gap: compact ? 8 : 6, minWidth: compact ? 0 : 96, ...style }}>
      <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
        {label && <span style={{ font: '600 11px/1 var(--font-sans)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{label}</span>}
        <span style={{ font: '500 14px/1 var(--font-sans)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>{value}<span style={{ color: 'var(--text-faint)' }}>/{max}</span></span>
      </span>
      {!compact && (
        <span style={{ display: 'grid', gridTemplateColumns: `repeat(${max}, 1fr)`, gap: 2 }}>
          {Array.from({ length: max }, (_, i) => <span key={i} style={{ height: 4, borderRadius: 1, background: i < value ? col : 'var(--linen-300)' }} />)}
        </span>
      )}
    </span>
  );
}
