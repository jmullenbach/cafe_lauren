import type { CSSProperties } from 'react';
import { Icon } from '../core/Icon';

export interface StarsProps {
  value: number;
  max?: number;
  size?: number;
  onChange?: (value: number) => void;
  style?: CSSProperties;
}

/** 1-5 star family rating. Interactive when onChange is set. */
export function Stars({ value = 0, max = 5, size = 16, onChange, style }: StarsProps) {
  return (
    <span style={{ display: 'inline-flex', gap: 2, color: 'var(--rating)', ...style }} aria-label={`${value} of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} onClick={onChange ? () => onChange(i + 1) : undefined} style={{ cursor: onChange ? 'pointer' : undefined, display: 'inline-flex' }}>
          <Icon name="star" size={size} stroke={1.5} style={{ fill: i < value ? 'currentColor' : 'none', color: i < value ? 'var(--rating)' : 'var(--linen-400)' }} />
        </span>
      ))}
    </span>
  );
}
