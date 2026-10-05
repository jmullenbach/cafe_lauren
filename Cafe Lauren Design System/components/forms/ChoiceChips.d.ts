/** Wrapping pill chips for quick picks: rejection reasons, swap preferences, recipe filters. */
export interface ChoiceChipsProps {
  options: Array<string | { value: string; label: string; icon?: string }>;
  /** Array when multi, single value otherwise */
  value?: string[] | string | null;
  onChange?: (value: any) => void;
  /** Default true */
  multi?: boolean;
  size?: 's' | 'm';
  style?: React.CSSProperties;
}
export declare function ChoiceChips(props: ChoiceChipsProps): JSX.Element;
