import { PEOPLE } from '../lib/storage';
import type { PersonKey } from '../lib/storage';
import { Avatar } from '../components/display/Avatar';

/** First-load picker. There are no accounts: the choice is stored on the phone and sent as X-Cafe-User. */
export function WhoAreYou({ onPick }: { onPick: (k: PersonKey) => void }) {
  return (
    <div data-testid="who-are-you" style={{ position: 'absolute', inset: 0, zIndex: 200, background: 'var(--surface-page)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 28px', gap: 28 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span style={{ font: 'var(--type-overline)', letterSpacing: 'var(--ls-overline)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Café Lauren</span>
        <h1 style={{ font: '300 36px/1.05 var(--font-serif)', letterSpacing: 'var(--ls-display)', color: 'var(--text-strong)' }}>Who’s this?</h1>
        <p style={{ font: '400 14px/1.45 var(--font-sans)', color: 'var(--text-body)' }}>So Café knows whose votes and requests are whose. You can switch any time.</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {PEOPLE.map((p) => (
          <button key={p.key} type="button" data-person={p.key} onClick={() => onPick(p.key)} className="cl-focus"
            style={{ display: 'flex', alignItems: 'center', gap: 14, height: 64, padding: '0 16px', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-subtle)', background: 'var(--surface-card)', boxShadow: 'var(--shadow-1)', cursor: 'pointer', font: '500 17px/1 var(--font-sans)', color: 'var(--text-strong)', textAlign: 'left' }}>
            <Avatar name={p.name} color={p.color} size={36} />{p.name}
          </button>
        ))}
      </div>
    </div>
  );
}
