/** Day-of-week label using the menu database's tag palette (Mon honey, Tue sage, Wed rose, Thu stone, Fri clay, Sat oak, Sun apricot). */
export interface DayTagProps {
  day: 'week' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun' | 'spare';
  /** Three-letter form: MON, TUE… */
  short?: boolean;
  /** Override text */
  label?: string;
  style?: React.CSSProperties;
}
export declare function DayTag(props: DayTagProps): JSX.Element;
