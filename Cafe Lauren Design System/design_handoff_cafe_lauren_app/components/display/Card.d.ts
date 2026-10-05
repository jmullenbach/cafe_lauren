/** Base surface: warm white, hairline linen border, whisper shadow, 10px radius. */
export interface CardProps {
  children?: React.ReactNode;
  padding?: 'none' | 's' | 'm' | 'l' | number;
  /** Lifts on hover */
  interactive?: boolean;
  selected?: boolean;
  elevation?: 'flat' | 'raised';
  tone?: 'default' | 'sunken' | 'accent';
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}
export declare function Card(props: CardProps): JSX.Element;
