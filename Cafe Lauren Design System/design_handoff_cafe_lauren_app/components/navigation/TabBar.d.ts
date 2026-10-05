/** Phone bottom tab bar on frosted linen. 4–5 items; badge shows a terracotta count. */
export interface TabBarProps {
  items: Array<{ id: string; label: string; icon: string; badge?: number }>;
  value?: string;
  onChange?: (id: string) => void;
  /** Adds bottom padding for the home indicator. Default true. */
  safeArea?: boolean;
  style?: React.CSSProperties;
}
export declare function TabBar(props: TabBarProps): JSX.Element;
