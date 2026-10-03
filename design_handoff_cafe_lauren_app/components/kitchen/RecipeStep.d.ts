/** Numbered recipe instruction. Wrap quantities + ingredients in <strong> inline. size="l" for cook mode on a counter tablet. */
export interface RecipeStepProps {
  index: number;
  children: React.ReactNode;
  done?: boolean;
  /** Current step (cook mode) */
  active?: boolean;
  onToggle?: () => void;
  /** e.g. "15 min" — renders a honey timer chip */
  timer?: string;
  size?: 'm' | 'l';
  style?: React.CSSProperties;
}
export declare function RecipeStep(props: RecipeStepProps): JSX.Element;
