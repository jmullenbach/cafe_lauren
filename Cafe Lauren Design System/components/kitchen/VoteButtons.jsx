import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { AvatarStack } from '../display/Avatar.jsx';
function V({ on, icon, label, count, tone, onClick }) {
  const c = tone === 'up' ? ['var(--sage-100)', 'var(--sage-900)', 'var(--sage-500)'] : ['var(--terra-50)', 'var(--terra-700)', 'var(--terra-300)'];
  return (
    <button type="button" aria-pressed={on} aria-label={label} onClick={onClick} className="cl-focus"
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 32, padding: '0 12px', borderRadius: 999, cursor: 'pointer', border: `1px solid ${on ? c[2] : 'var(--border-default)'}`, background: on ? c[0] : 'var(--surface-raised)', color: on ? c[1] : 'var(--text-body)', font: '600 13px/1 var(--font-sans)', transition: 'all var(--dur-fast) var(--ease-out)' }}>
      <Icon name={icon} size={16} style={{ fill: on ? 'currentColor' : 'none', fillOpacity: 0.15 }} />{count != null && count}
    </button>
  );
}
export function VoteButtons({ value = null, onChange, up = 0, down = 0, voters = [], style }) {
  const set = v => onChange && onChange(value === v ? null : v);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, ...style }}>
      <V on={value === 'up'} icon="thumbs-up" label="Yes please" count={up} tone="up" onClick={() => set('up')} />
      <V on={value === 'down'} icon="thumbs-down" label="Not this week" count={down} tone="down" onClick={() => set('down')} />
      {voters.length > 0 && <AvatarStack people={voters} size={24} style={{ marginLeft: 'auto' }} />}
    </div>
  );
}
