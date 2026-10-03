/** Household member initials (or photo) in an earthy tint. Each member keeps one color across the app. */
export interface AvatarProps {
  name: string;
  color?: 'sage' | 'terra' | 'oak' | 'honey' | 'slate';
  size?: number;
  src?: string;
  /** White separation ring, used in stacks */
  ring?: boolean;
  style?: React.CSSProperties;
}
export declare function Avatar(props: AvatarProps): JSX.Element;
export interface AvatarStackProps {
  people: AvatarProps[];
  size?: number;
  max?: number;
  style?: React.CSSProperties;
}
export declare function AvatarStack(props: AvatarStackProps): JSX.Element;
