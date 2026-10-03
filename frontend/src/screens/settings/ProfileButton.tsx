import { useNavigate } from 'react-router-dom';
import { Avatar } from '../../components/display/Avatar';
import { useUser } from '../../state/UserContext';

/** Header avatar that opens Settings. */
export function ProfileButton() {
  const { person } = useUser();
  const nav = useNavigate();
  if (!person) return null;
  return (
    <button type="button" aria-label="Settings" data-testid="open-settings" onClick={() => nav('/settings')} style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer' }}>
      <Avatar name={person.name} color={person.color} size={28} />
    </button>
  );
}
