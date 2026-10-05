/** Lucide line icon (v0.460, 1.5px stroke) rendered inline with currentColor. */
export interface IconProps {
  /** Lucide icon name, kebab-case, e.g. "carrot", "shopping-basket", "chef-hat". See assets/icons/ for the shipped set. */
  name: string;
  /** Pixel size. Default 20. */
  size?: number;
  /** Stroke width. Default 1.5 — keep 1.5 for UI, 1.25 at 32px+. */
  stroke?: number;
  color?: string;
  title?: string;
  style?: React.CSSProperties;
}
export declare function Icon(props: IconProps): JSX.Element;
