/** 1–5 star family rating (the menu database "Stars" field). Interactive when onChange is set. */
export interface StarsProps {
  value: number;
  max?: number;
  size?: number;
  onChange?: (value: number) => void;
  style?: React.CSSProperties;
}
export declare function Stars(props: StarsProps): JSX.Element;
