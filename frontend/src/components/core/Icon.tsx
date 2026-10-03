import type { CSSProperties } from 'react';
import { ICONS } from './iconRegistry';

export interface IconProps {
  /** Lucide icon name, kebab-case, e.g. "carrot". Must be in iconRegistry.ts. */
  name: string;
  /** Pixel size. Default 20. */
  size?: number;
  /** Stroke width. Default 1.5 (keep 1.5 for UI, 1.25 at 32px+). */
  stroke?: number;
  color?: string;
  title?: string;
  style?: CSSProperties;
}

export function Icon({ name, size = 20, stroke = 1.5, color, style, title }: IconProps) {
  const Cmp = ICONS[name];
  if (!Cmp) {
    if (import.meta.env.DEV) console.warn(`Icon "${name}" is not in iconRegistry.ts`);
    return <span style={{ display: 'block', width: size, height: size, flex: 'none' }} />;
  }
  return (
    <Cmp
      size={size}
      strokeWidth={stroke}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      style={{ flex: 'none', display: 'block', color, ...style }}
    />
  );
}

export const iconNames = Object.keys(ICONS);
