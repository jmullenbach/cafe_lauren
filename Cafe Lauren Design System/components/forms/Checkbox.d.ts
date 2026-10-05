/** Square sage checkbox — the core interaction of grocery lists, ingredients and recipe steps. */
export interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: React.ReactNode;
  size?: 'm' | 'l';
  /** Strike through the label when checked (grocery/ingredient lists) */
  strike?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function Checkbox(props: CheckboxProps): JSX.Element;
