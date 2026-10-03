/** Household consensus control on a suggested meal: thumbs up / down with counts and who has voted. */
export interface VoteButtonsProps {
  value?: 'up' | 'down' | null;
  onChange?: (value: 'up' | 'down' | null) => void;
  up?: number;
  down?: number;
  /** Members who have voted */
  voters?: Array<{ name: string; color?: 'sage' | 'terra' | 'oak' | 'honey' | 'slate' }>;
  style?: React.CSSProperties;
}
export declare function VoteButtons(props: VoteButtonsProps): JSX.Element;
