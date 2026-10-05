/** Small status label. "sale" (terracotta) flags grocery deals; "success" for approved/in stock. */
export interface BadgeProps {
  tone?: 'neutral' | 'sale' | 'success' | 'warning' | 'danger' | 'info' | 'accent';
  variant?: 'soft' | 'solid';
  icon?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Badge(props: BadgeProps): JSX.Element;
