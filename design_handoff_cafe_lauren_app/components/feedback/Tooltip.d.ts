/** Small charcoal hover label. */
export interface TooltipProps {
  label: React.ReactNode;
  children: React.ReactNode;
  placement?: 'top' | 'bottom';
  /** Force visible (docs) */
  open?: boolean;
  style?: React.CSSProperties;
}
export declare function Tooltip(props: TooltipProps): JSX.Element;
