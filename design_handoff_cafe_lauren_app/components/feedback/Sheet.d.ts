/** Phone bottom sheet. Positions absolutely inside the nearest positioned ancestor (the phone screen), with a scrim. */
export interface SheetProps {
  open: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  /** Sticky action row; buttons usually flex:1 */
  footer?: React.ReactNode;
  maxHeight?: string;
  style?: React.CSSProperties;
}
export declare function Sheet(props: SheetProps): JSX.Element | null;
