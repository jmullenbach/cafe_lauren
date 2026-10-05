/** The standard review row for any AI suggestion: reject (with reason), swap, edit, keep. Pass only the handlers that apply. */
export interface ReviewActionsProps {
  onReject?: () => void;
  onSwap?: () => void;
  onEdit?: () => void;
  onApprove?: () => void;
  rejectLabel?: string;
  swapLabel?: string;
  editLabel?: string;
  approveLabel?: string;
  size?: 's' | 'm' | 'l';
  style?: React.CSSProperties;
}
export declare function ReviewActions(props: ReviewActionsProps): JSX.Element;
