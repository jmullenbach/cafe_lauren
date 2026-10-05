/** Charcoal snackbar for confirmations after an action. */
export interface ToastProps {
  tone?: 'neutral' | 'success' | 'sale' | 'warning' | 'danger';
  icon?: string;
  title?: React.ReactNode;
  message?: React.ReactNode;
  action?: string;
  onAction?: () => void;
  onClose?: () => void;
  style?: React.CSSProperties;
}
export declare function Toast(props: ToastProps): JSX.Element;
