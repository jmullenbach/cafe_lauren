/** Native select styled to match Input. */
export interface SelectProps {
  label?: string;
  options: Array<string | { value: string; label: string }>;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  size?: 's' | 'm' | 'l';
  style?: React.CSSProperties;
}
export declare function Select(props: SelectProps): JSX.Element;
