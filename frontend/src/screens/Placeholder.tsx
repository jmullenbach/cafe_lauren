import { Screen, LargeTitle } from '../components/layout/Layout';
import { Avatar } from '../components/display/Avatar';
import { Card } from '../components/display/Card';
import { Button } from '../components/core/Button';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../state/UserContext';
import { useUi } from '../state/UiContext';

export function PlaceholderScreen({ overline, title, note }: { overline: string; title: string; note: string }) {
  const { person, clearUser } = useUser();
  const { toast } = useUi();
  const nav = useNavigate();
  return (
    <Screen>
      <LargeTitle overline={overline} title={title}
        right={person && (
          <button type="button" aria-label="Switch person" onClick={clearUser} style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer' }}>
            <Avatar name={person.name} color={person.color} size={28} />
          </button>
        )} />
      <Card tone="sunken">
        <p style={{ font: '400 15px/1.5 var(--font-sans)', color: 'var(--text-body)' }}>{note}</p>
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <Button variant="secondary" size="s" onClick={() => nav('/meal/sample')}>Open a detail page</Button>
          <Button variant="secondary" size="s" onClick={() => toast({ tone: 'success', icon: 'check', title: 'Toast works', message: 'Gone in 3 seconds.' })}>Show toast</Button>
        </div>
      </Card>
    </Screen>
  );
}
