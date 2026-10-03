/** Pill-shaped single-choice switcher for 2–4 view modes. */
export interface SegmentedControlProps {
  options: Array<string | { value: string; label: string; icon?: string }>;
  value?: string;
  onChange?: (value: string) => void;
  size?: 's' | 'm';
  style?: React.CSSProperties;
}
export declare function SegmentedControl(props: SegmentedControlProps): JSX.Element;
