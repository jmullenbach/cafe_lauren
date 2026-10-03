import { useState } from 'react';
import type { CSSProperties } from 'react';
import { Checkbox } from '../forms/Checkbox';
import { Badge } from '../display/Badge';

export interface GroceryItemProps {
  /** Bold quantity, e.g. "2 lbs" */
  qty?: string;
  name: string;
  /** Which meals it's for, e.g. "Pork chops + citrus chicken" */
  note?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  /** Sale price text; shows a terracotta tag, e.g. "$0.99/lb" */
  sale?: string;
  /** Recurring household staple */
  staple?: boolean;
  /** Who asked for it, e.g. "Joe" */
  from?: string;
  style?: CSSProperties;
}

/** One line on the grocery list: checkbox, bold quantity + item, meal note, sale price. */
export function GroceryItem({ qty, name, note, checked, onChange, sale, staple, from, style }: GroceryItemProps) {
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
