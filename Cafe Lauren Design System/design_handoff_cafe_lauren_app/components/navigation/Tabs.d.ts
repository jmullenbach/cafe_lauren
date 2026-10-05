/** Underlined text tabs with optional counts. */
export interface TabsProps {
  tabs: Array<{ id: string; label: string; count?: number }>;
  value?: string;
  onChange?: (id: string) => void;
  style?: React.CSSProperties;
}
export declare function Tabs(props: TabsProps): JSX.Element;
