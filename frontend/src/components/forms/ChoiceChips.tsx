import type { CSSProperties } from 'react';
import { Icon } from '../core/Icon';

export type ChipOption = string | { value: string; label: string; icon?: string };

export interface ChoiceChipsProps {
  options: ChipOption[];
  /** Array when multi, single value otherwise */
  value?: string[] | string | null;
  /** Receives string[] when multi, string | null otherwise */
  onChange?: (value: any) => void;
  /** Default true */
  multi?: boolean;
  size?: 's' | 'm';
  style?: CSSProperties;
}

/** Wrapping pill chips for quick picks: rejection reasons, swap preferences, recipe filters. */
export function ChoiceChips({ options = [], value = [], onChange, multi = true, size = 'm', style }: ChoiceChipsProps) {
  const opts = options.map((o) => (typeof o === 'string' ? { value: o, label: o, icon: undefined as string | undefined } : o));
  const sel: string[] = Array.isArray(value) ? value : value == null ? [] : [value];
  const toggle = (v: string) => {
    if (!onChange) return;
    if (multi) onChange(sel.includes(v) ? sel.filter((x) => x !== v) : [...sel, v]);
    else onChange(sel[0] === v ? null : v);
  };
  const h = size === 's' ? 30 : 36;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, ...style }}>
      {opts.map((o) => {
        const on = sel.includes(o.value);
        return (
          <button key={o.value} type="button" aria-pressed={on} onClick={() => toggle(o.value)} className="cl-focus"
            style={{ display: 'inline-flex', flex: 'none', whiteSpace: 'nowrap', alignItems: 'center', gap: 6, height: h, padding: '0 14px', borderRadius: 999, cursor: 'pointer', border: `1px solid ${on ? 'var(--char-900)' : 'var(--border-default)'}`, background: on ? 'var(--char-900)' : 'var(--surface-raised)', color: on ? 'var(--linen-50)' : 'var(--text-strong)', font: `500 ${size === 's' ? 13 : 14}px/1 var(--font-sans)`, transition: 'background var(--dur-fast), border-color var(--dur-fast), color var(--dur-fast)' }}>
            {on && multi ? <Icon name="check" size={14} stroke={2.25} /> : o.icon ? <Icon name={o.icon} size={15} /> : null}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
