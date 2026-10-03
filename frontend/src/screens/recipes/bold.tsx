import type { ReactNode } from 'react';

/** Render **bold** markdown inline (recipe steps put every amount in bold). */
export function renderBold(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((p, i) =>
    p.startsWith('**') && p.endsWith('**') ? <strong key={i} style={{ fontWeight: 650, color: 'var(--text-strong)' }}>{p.slice(2, -2)}</strong> : <span key={i}>{p}</span>);
}

/** Tags starting with notion: are internal and never shown. */
export { publicTags as visibleTags } from '../../lib/meal';
