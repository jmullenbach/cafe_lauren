import type { CSSProperties, ReactNode } from 'react';
import { Icon } from '../core/Icon';
import { IconButton } from '../core/IconButton';

/** Scrolling screen body. Top padding clears the status bar / notch; bottom clears the tab bar. */
export function Screen({ children, bottom = 110, style }: { children?: ReactNode; bottom?: number; style?: CSSProperties }) {
  return (
    <div className="clm-scroll" data-screen style={{ position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'none', padding: `var(--safe-top) 20px ${bottom}px`, ...style }}>
      {children}
    </div>
  );
}

export function LargeTitle({ overline, title, right, sub }: { overline?: ReactNode; title: ReactNode; right?: ReactNode; sub?: ReactNode }) {
  return (
    <header style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: '8px 0 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 28 }}>
        <span style={{ font: 'var(--type-overline)', letterSpacing: 'var(--ls-overline)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{overline}</span>
        <div style={{ display: 'flex', gap: 4 }}>{right}</div>
      </div>
      <h1 style={{ font: '300 36px/1.05 var(--font-serif)', letterSpacing: 'var(--ls-display)', color: 'var(--text-strong)' }}>{title}</h1>
      {sub && <p style={{ font: '400 14px/1.45 var(--font-sans)', color: 'var(--text-body)' }}>{sub}</p>}
    </header>
  );
}

export function BackHeader({ title, onBack, right }: { title?: ReactNode; onBack?: () => void; right?: ReactNode }) {
  return (
    <div style={{ position: 'sticky', top: 'calc(var(--safe-top) * -1)', zIndex: 5, margin: 'calc(var(--safe-top) * -1) -20px 12px', padding: 'calc(var(--safe-top) - 4px) 12px 8px', display: 'flex', alignItems: 'center', gap: 4, background: 'var(--glass-bg)', backdropFilter: 'var(--blur-glass)', WebkitBackdropFilter: 'var(--blur-glass)', borderBottom: '1px solid var(--border-subtle)' }}>
      <IconButton icon="chevron-left" label="Back" onClick={onBack} />
      <span style={{ flex: 1, minWidth: 0, font: '600 15px/1.2 var(--font-sans)', color: 'var(--text-strong)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</span>
      {right}
    </div>
  );
}

export function SectionHead({ title, aside, onAside }: { title: ReactNode; aside?: ReactNode; onAside?: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, margin: '28px 0 12px' }}>
      <h2 style={{ font: '400 22px/1.2 var(--font-serif)', color: 'var(--text-strong)' }}>{title}</h2>
      {aside && <button type="button" onClick={onAside} style={{ background: 'none', border: 0, padding: 0, cursor: onAside ? 'pointer' : 'default', font: '600 13px/1 var(--font-sans)', color: onAside ? 'var(--sage-700)' : 'var(--text-muted)' }}>{aside}</button>}
    </div>
  );
}

/** Linen placeholder with a faint cooking pot, used wherever a meal has no photo. */
export function MealPhoto({ height = 160, radius = 'var(--radius-m)', children, style }: { height?: number; radius?: string; children?: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ position: 'relative', height, borderRadius: radius, background: 'var(--linen-200)', overflow: 'hidden', display: 'grid', placeItems: 'center', color: 'var(--linen-400)', ...style }}>
      <Icon name="cooking-pot" size={Math.min(44, height / 3)} stroke={1.25} />
      {children}
    </div>
  );
}

/** Sage "Why Café suggested this" panel. Required on every suggestion. */
export function Why({ items, basis }: { items: string[]; basis?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '12px 14px', borderRadius: 'var(--radius-s)', background: 'var(--sage-50)' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: '600 12px/1 var(--font-sans)', color: 'var(--sage-700)' }}><Icon name="sparkles" size={13} stroke={2} />Why Café suggested this</span>
      {basis && <span style={{ font: '400 13px/1.4 var(--font-sans)', color: 'var(--sage-900)' }}>You said: “{basis}”</span>}
      {items.map((w) => <span key={w} style={{ font: '400 13px/1.4 var(--font-sans)', color: 'var(--text-body)' }}>· {w}</span>)}
    </div>
  );
}

export function ListRow({ icon, iconColor, title, sub, right, onClick, last }: { icon?: string; iconColor?: string; title: ReactNode; sub?: ReactNode; right?: ReactNode; onClick?: () => void; last?: boolean }) {
  return (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 56, padding: '10px 0', borderBottom: last ? 0 : '1px solid var(--border-subtle)', cursor: onClick ? 'pointer' : undefined }}>
      {icon && <span style={{ width: 36, height: 36, flex: 'none', borderRadius: 'var(--radius-s)', display: 'grid', placeItems: 'center', background: 'var(--linen-100)', color: iconColor || 'var(--text-body)' }}><Icon name={icon} size={18} /></span>}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span style={{ font: '500 15px/1.3 var(--font-sans)', color: 'var(--text-strong)' }}>{title}</span>
        {sub && <span style={{ font: '400 13px/1.35 var(--font-sans)', color: 'var(--text-muted)' }}>{sub}</span>}
      </div>
      {right}
      {onClick && !right && <Icon name="chevron-right" size={18} style={{ color: 'var(--text-faint)' }} />}
    </div>
  );
}

/** Sticky frosted action bar pinned to the bottom of the frame. */
export function BottomBar({ children }: { children?: ReactNode }) {
  return <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 20, display: 'flex', gap: 8, padding: '12px 20px 30px', background: 'var(--glass-bg)', backdropFilter: 'var(--blur-glass)', WebkitBackdropFilter: 'var(--blur-glass)', borderTop: '1px solid var(--border-subtle)' }}>{children}</div>;
}

export function AskFab({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} data-testid="ask-fab" style={{ position: 'absolute', right: 16, bottom: 100, zIndex: 25, display: 'inline-flex', alignItems: 'center', gap: 8, height: 48, padding: '0 18px 0 14px', borderRadius: 999, border: 0, cursor: 'pointer', background: 'var(--char-900)', color: 'var(--linen-50)', boxShadow: 'var(--shadow-3)', font: '600 14px/1 var(--font-sans)' }}>
      <Icon name="sparkles" size={18} style={{ color: 'var(--sage-300)' }} />Ask Café
    </button>
  );
}
