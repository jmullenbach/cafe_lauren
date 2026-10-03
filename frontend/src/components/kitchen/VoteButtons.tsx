import type { CSSProperties } from 'react';
import type { PersonColor } from '../types';
import { Icon } from '../core/Icon';
import { AvatarStack } from '../display/Avatar';

function V({ on, icon, label, count, tone, onClick }: { on: boolean; icon: string; label: string; count?: number; tone: 'up' | 'down'; onClick: () => void }) {
  const c = tone === 'up' ? ['var(--sage-100)', 'var(--sage-900)', 'var(--sage-500)'] : ['var(--terra-50)', 'var(--terra-700)', 'var(--terra-300)'];
  return (
    <button type="button" aria-pressed={on} aria-label={label} onClick={onClick} className="cl-focus"
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 32, padding: '0 12px', borderRadius: 999, cursor: 'pointer', border: `1px solid ${on ? c[2] : 'var(--border-default)'}`, background: on ? c[0] : 'var(--surface-raised)', color: on ? c[1] : 'var(--text-body)', font: '600 13px/1 var(--font-sans)', transition: 'all var(--dur-fast) var(--ease-out)' }}>
      <Icon name={icon} size={16} style={{ fill: on ? 'currentColor' : 'none', fillOpacity: 0.15 }} />{count != null && count}
    </button>
  );
}

export interface VoteButtonsProps {
  value?: 'up' | 'down' | null;
  onChange?: (value: 'up' | 'down' | null) => void;
  up?: number;
  down?: number;
  /** Members who have voted */
  voters?: Array<{ name: string; color?: PersonColor }>;
  style?: CSSProperties;
}

/** Household consensus control on a suggested meal: thumbs up / down with counts and who has voted. */
export function VoteButtons({ value = null, onChange, up = 0, down = 0, voters = [], style }: VoteButtonsProps) {
  const set = (v: 'up' | 'down') => onChange && onChange(value === v ? null : v);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, ...style }}>
      <V on={value === 'up'} icon="thumbs-up" label="Yes please" count={up} tone="up" onClick={() => set('up')} />
      <V on={value === 'down'} icon="thumbs-down" label="Not this week" count={down} tone="down" onClick={() => set('down')} />
      {voters.length > 0 && <AvatarStack people={voters} size={24} style={{ marginLeft: 'auto' }} />}
    </div>
  );
}
