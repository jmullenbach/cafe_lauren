import type { CSSProperties, ReactNode } from 'react';
import { Icon } from '../core/Icon';

export interface RecipeStepProps {
  index: number;
  children: ReactNode;
  done?: boolean;
  /** Current step (cook mode) */
  active?: boolean;
  onToggle?: () => void;
  /** e.g. "15 min": renders a honey timer chip */
  timer?: string;
  size?: 'm' | 'l';
  style?: CSSProperties;
}

/** Numbered recipe instruction. Wrap quantities + ingredients in <strong> inline. size="l" for cook mode. */
export function RecipeStep({ index, children, done, active, onToggle, timer, size = 'm', style }: RecipeStepProps) {
  const big = size === 'l';
  return (
    <div onClick={onToggle} style={{ display: 'flex', gap: big ? 20 : 14, alignItems: 'flex-start', padding: big ? '20px 24px' : '12px 0', borderRadius: big ? 'var(--radius-m)' : 0, cursor: onToggle ? 'pointer' : undefined,
      background: big && active ? 'var(--surface-card)' : 'transparent', boxShadow: big && active ? 'var(--shadow-2)' : 'none', border: big ? `1px solid ${active ? 'var(--border-subtle)' : 'transparent'}` : 0, transition: 'background var(--dur-base), box-shadow var(--dur-base)', ...style }}>
      <span style={{ width: big ? 36 : 26, height: big ? 36 : 26, flex: 'none', borderRadius: 999, display: 'grid', placeItems: 'center', background: done ? 'var(--sage-600)' : active ? 'var(--char-900)' : 'transparent', border: done || active ? 0 : '1.5px solid var(--border-strong)', color: done || active ? '#fff' : 'var(--text-muted)', font: `600 ${big ? 15 : 12}px/1 var(--font-sans)`, transition: 'background var(--dur-fast)' }}>
        {done ? <Icon name="check" size={big ? 18 : 14} stroke={2.5} /> : index}
      </span>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, paddingTop: big ? 4 : 2 }}>
        <div style={{ font: `400 ${big ? 22 : 15}px/1.5 var(--font-sans)`, color: done ? 'var(--text-muted)' : 'var(--text-strong)' }}>{children}</div>
        {timer && <span style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 6, height: big ? 32 : 26, padding: '0 10px', borderRadius: 999, background: 'var(--honey-100)', color: 'var(--honey-700)', font: `600 ${big ? 14 : 12}px/1 var(--font-sans)` }}><Icon name="timer" size={big ? 16 : 14} />{timer}</span>}
      </div>
    </div>
  );
}
