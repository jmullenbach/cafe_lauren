import React, { useState } from 'react';
import { Checkbox } from '../forms/Checkbox.jsx';
import { Badge } from '../display/Badge.jsx';
export function GroceryItem({ qty, name, note, checked, onChange, sale, staple, from, style }) {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 8px', margin: '0 -8px', borderBottom: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)', background: h ? 'var(--linen-100)' : 'transparent', transition: 'background var(--dur-fast)', ...style }}>
      <Checkbox checked={checked} onChange={onChange} strike style={{ flex: 1, minWidth: 0 }}
        label={<>{qty && <strong style={{ fontWeight: 650, color: checked ? 'inherit' : 'var(--text-strong)' }}>{qty} </strong>}{name}</>}
        description={note} />
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', flex: 'none' }}>
        {from && <span style={{ font: '500 12px/1 var(--font-sans)', color: 'var(--text-muted)' }}>{from}</span>}
        {staple && <Badge>Staple</Badge>}
        {sale && <Badge tone="sale" icon="tag">{sale}</Badge>}
      </div>
    </div>
  );
}
