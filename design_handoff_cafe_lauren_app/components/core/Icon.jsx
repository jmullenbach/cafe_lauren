import React from 'react';
import { ICONS } from './icon-paths.js';
export function Icon({ name, size = 20, stroke = 1.5, color, style, title, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} aria-label={title} style={{ flex: 'none', display: 'block', color, ...style }} dangerouslySetInnerHTML={{ __html: ICONS[name] || '' }} {...rest} />
  );
}
export const iconNames = Object.keys(ICONS);
