/** Pantry / fridge / freezer photo with a protection-gradient caption; or an empty dashed "add photo" slot. */
export interface PhotoTileProps {
  src?: string;
  label?: string;
  /** e.g. "Mar 1 · 14 items found" */
  meta?: string;
  /** CSS aspect-ratio. Default "3 / 4" (phone photo) */
  aspect?: string;
  onRemove?: () => void;
  onClick?: () => void;
  /** Render the dashed upload slot */
  empty?: boolean;
  style?: React.CSSProperties;
}
export declare function PhotoTile(props: PhotoTileProps): JSX.Element;
