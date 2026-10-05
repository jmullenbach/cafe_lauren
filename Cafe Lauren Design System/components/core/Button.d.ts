/**
 * Primary action control. Charcoal "primary" for the one main action per view; sage "accent" for confirm/approve; secondary/ghost for everything else.
 * @startingPoint section="Core" subtitle="Buttons in every variant and size" viewport="700x260"
 */
export interface ButtonProps {
  variant?: 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger';
  size?: 's' | 'm' | 'l';
  /** Lucide icon name shown before the label */
  icon?: string;
  /** Lucide icon name shown after the label */
  iconRight?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit';
  onClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Button(props: ButtonProps): JSX.Element;
