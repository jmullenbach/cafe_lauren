import type { CSSProperties } from 'react';
import type { DayKey } from '../types';

const D: Record<DayKey, string> = { week: 'This week', mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday', spare: 'Spare' };

export interface DayTagProps {
  day: DayKey;
  /** Three-letter form: MON, TUE... */
  short?: boolean;
  /** Override text */
  label?: string;
  style?: CSSProperties;
}

/** Day-of-week label using the menu database's tag palette. */
export function DayTag({ day = 'mon', short, label, style }: DayTagProps) {
  const text = label || (short && day !== 'week' && day !== 'spare' ? D[day].slice(0, 3) : D[day]);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', height: 22, padding: '0 8px', borderRadius: 'var(--radius-xs)', background: `var(--day-${day})`, color: `var(--day-${day}-ink)`, font: '700 10.5px/1 var(--font-sans)', letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap', ...style }}>{text}</span>
  );
}
