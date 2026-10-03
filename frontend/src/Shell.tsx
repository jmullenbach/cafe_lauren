import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { TabBar } from './components/navigation/TabBar';
import { AskFab } from './components/layout/Layout';
import { ToastHost } from './components/feedback/ToastHost';
import { SheetHost } from './sheets/SheetHost';
import { PlaceholderScreen } from './screens/Placeholder';
import { DetailPlaceholder } from './screens/DetailPlaceholder';
import { WhoAreYou } from './screens/WhoAreYou';
import { useUser } from './state/UserContext';
import { useUi } from './state/UiContext';
import { useTabBadges } from './state/useTabBadges';

export const TABS = [
  { id: 'home', label: 'Home', icon: 'house', title: 'Home', overline: 'This week' },
  { id: 'plan', label: 'Plan', icon: 'calendar-days', title: 'Plan', overline: 'This week' },
  { id: 'list', label: 'List', icon: 'shopping-basket', title: 'Grocery list', overline: 'This week' },
  { id: 'recipes', label: 'Recipes', icon: 'book-open', title: 'Recipe box', overline: 'Recipes' },
  { id: 'inbox', label: 'Inbox', icon: 'message-circle', title: 'Inbox', overline: 'Requests and pantry' },
] as const;

export function Shell() {
  const { user, setUser } = useUser();
  const { openSheet } = useUi();
  const loc = useLocation();
  const nav = useNavigate();
  const badges = useTabBadges();
  const seg = loc.pathname.split('/').filter(Boolean);
  const tab = seg.length === 1 ? TABS.find((t) => t.id === seg[0])?.id : undefined;
  // A pushed route (anything deeper than one segment) hides the tab bar and the Ask button.
  const isTab = tab !== undefined;

  return (
    <div className="app-frame">
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        {TABS.map((t) => (
          <Route key={t.id} path={`/${t.id}`} element={<PlaceholderScreen overline={t.overline} title={t.title} note="This screen is coming in Phase 4." />} />
        ))}
        <Route path="/meal/:id" element={<DetailPlaceholder />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
      {isTab && tab !== 'plan' && <AskFab onClick={() => openSheet({ type: 'chat' })} />}
      {isTab && (
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 30 }}>
          <TabBar items={TABS.map((t) => ({ id: t.id, label: t.label, icon: t.icon, badge: badges[t.id] ?? null }))} value={tab} onChange={(id) => nav('/' + id)} />
        </div>
      )}
      <SheetHost />
      <ToastHost />
      {!user && <WhoAreYou onPick={setUser} />}
    </div>
  );
}
