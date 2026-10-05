/** Text field with optional label, leading icon, hint and error. Set multiline for notes/feedback. */
export interface InputProps {
  label?: string;
  hint?: string;
  error?: string;
  /** Leading Lucide icon */
  icon?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  multiline?: boolean;
  rows?: number;
  size?: 's' | 'm' | 'l';
  type?: string;
  style?: React.CSSProperties;
}
export declare function Input(props: InputProps): JSX.Element;
