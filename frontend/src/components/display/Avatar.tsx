import type { CSSProperties } from 'react';
import type { PersonColor } from '../types';

const C: Record<PersonColor, [string, string]> = {
  sage: ['var(--sage-100)', 'var(--sage-900)'],
  terra: ['var(--terra-100)', 'var(--terra-700)'],
  oak: ['var(--oak-200)', 'var(--oak-700)'],
  honey: ['var(--honey-100)', 'var(--honey-700)'],
  slate: ['var(--slate-100)', 'var(--slate-700)'],
};

export interface AvatarProps {
  name: string;
  color?: PersonColor;
  size?: number;
  src?: string;
  /** White separation ring, used in stacks */
  ring?: boolean;
  style?: CSSProperties;
}

/** Household member initials (or photo) in an earthy tint. */
export function Avatar({ name = '', color = 'sage', size = 32, src, ring, style }: AvatarProps) {
  const [bg, fg] = C[color] || C.sage;
  const ini = name.split(/\s+/).map((w) => w[0] ?? '').join('').slice(0, 2).toUpperCase();
  return (
    <span title={name} style={{ width: size, height: size, flex: 'none', borderRadius: 999, display: 'inline-grid', placeItems: 'center', overflow: 'hidden', background: bg, color: fg, font: `600 ${Math.round(size * 0.4)}px/1 var(--font-sans)`, boxShadow: ring ? '0 0 0 2px var(--surface-card)' : 'none', ...style }}>
      {src ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : ini}
    </span>
  );
}

export interface AvatarStackProps {
  people: AvatarProps[];
  size?: number;
  max?: number;
  style?: CSSProperties;
}

export function AvatarStack({ people = [], size = 28, max = 4, style }: AvatarStackProps) {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', ...style }}>
      {shown.map((p, i) => <Avatar key={p.name + i} {...p} size={size} ring style={{ marginLeft: i ? -size * 0.28 : 0 }} />)}
      {extra > 0 && <span style={{ marginLeft: 6, font: '600 12px/1 var(--font-sans)', color: 'var(--text-muted)' }}>+{extra}</span>}
    </span>
  );
}
