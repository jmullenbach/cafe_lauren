/** x/10 rating with a segmented bar — Healthiness and Deliciousness on every meal. */
export interface ScoreProps {
  label?: string;
  value: number;
  max?: number;
  /** sage = healthy, terra = delicious, honey = other */
  tone?: 'sage' | 'terra' | 'honey';
  /** Inline value only, no bar */
  compact?: boolean;
  style?: React.CSSProperties;
}
export declare function Score(props: ScoreProps): JSX.Element;
