import { useState } from 'react';
import type { CSSProperties, MouseEvent, ReactNode } from 'react';

const PAD = { none: 0, s: 12, m: 20, l: 28 };

export interface CardProps {
  children?: ReactNode;
  padding?: 'none' | 's' | 'm' | 'l' | number;
  /** Lifts on hover */
  interactive?: boolean;
  selected?: boolean;
  elevation?: 'flat' | 'raised';
  tone?: 'default' | 'sunken' | 'accent';
  onClick?: (e: MouseEvent) => void;
  style?: CSSProperties;
}

/** Base surface: warm white, hairline linen border, whisper shadow, 10px radius. */
export function Card({ children, padding = 'm', interactive, selected, elevation = 'flat', tone = 'default', onClick, style }: CardProps) {
  const [h, setH] = useState(false);
  const bg = tone === 'sunken' ? 'var(--surface-sunken)' : tone === 'accent' ? 'var(--surface-accent)' : 'var(--surface-card)';
  const sh = elevation === 'raised' || (interactive && h) ? 'var(--shadow-2)' : tone === 'sunken' ? 'none' : 'var(--shadow-1)';
  const pad = typeof padding === 'number' ? padding : PAD[padding] ?? padding;
  return (
    <div onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ background: bg, border: `1px solid ${selected ? 'var(--sage-500)' : 'var(--border-subtle)'}`, borderRadius: 'var(--radius-card)', padding: pad, overflow: 'hidden',
        boxShadow: selected ? `0 0 0 2px var(--sage-100), ${sh}` : sh, cursor: interactive ? 'pointer' : undefined, transform: interactive && h ? 'translateY(-1px)' : 'none',
        transition: 'box-shadow var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out), border-color var(--dur-fast)', ...style }}>
      {children}
    </div>
  );
}
