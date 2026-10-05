/** Modal on a warm charcoal scrim. Serif title, sans body, right-aligned actions. */
export interface DialogProps {
  open?: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  /** Buttons, right-aligned; primary last */
  actions?: React.ReactNode;
  width?: number;
  /** Render without the fixed scrim (for docs/previews) */
  inline?: boolean;
  style?: React.CSSProperties;
}
export declare function Dialog(props: DialogProps): JSX.Element | null;
