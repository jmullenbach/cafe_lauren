/** Square (or round) icon-only button. Always pass a label for accessibility. */
export interface IconButtonProps {
  icon: string;
  /** Accessible label + native tooltip */
  label: string;
  variant?: 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger';
  size?: 's' | 'm' | 'l';
  round?: boolean;
  /** Toggled-on state (sage tint) */
  active?: boolean;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}
export declare function IconButton(props: IconButtonProps): JSX.Element;
