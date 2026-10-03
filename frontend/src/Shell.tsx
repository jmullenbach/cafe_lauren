import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { TabBar } from './components/navigation/TabBar';
import { AskFab } from './components/layout/Layout';
import { ToastHost } from './components/feedback/ToastHost';
import { SheetHost } from './sheets/SheetHost';
import { HomeScreen } from './screens/home/HomeScreen';
import { PlanScreen } from './screens/plan/PlanScreen';
import { MealDetail } from './screens/meal/MealDetail';
import { WhoAreYou } from './screens/WhoAreYou';
import { InboxScreen } from './screens/inbox/InboxScreen';
import { PantryReview } from './screens/inbox/PantryReview';
import { RecipesScreen } from './screens/recipes/RecipesScreen';
import { RecipeDetail } from './screens/recipes/RecipeDetail';
import { ListScreen } from './screens/list/ListScreen';
import { SettingsScreen } from './screens/settings/SettingsScreen';
import { useUser } from './state/UserContext';
import { useUi } from './state/UiContext';
import { useTabBadges } from './state/useTabBadges';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { startJobStream } from './api/jobs';

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
  const qc = useQueryClient();
  useEffect(() => (user ? startJobStream(qc, user) : undefined), [qc, user]);
  const seg = loc.pathname.split('/').filter(Boolean);
  const tab = seg.length === 1 ? TABS.find((t) => t.id === seg[0])?.id : undefined;
  // A pushed route (anything deeper than one segment) hides the tab bar and the Ask button.
  const isTab = tab !== undefined;

  return (
    <div className="app-frame">
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/plan" element={<PlanScreen />} />
        <Route path="/list" element={<ListScreen />} />
        <Route path="/inbox" element={<InboxScreen />} />
        <Route path="/inbox/pantry" element={<PantryReview />} />
        <Route path="/recipes" element={<RecipesScreen />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="/meal/:id" element={<MealDetail />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
      {isTab && tab !== 'plan' && <AskFab onClick={() => openSheet({ type: 'chat' })} />}
      {isTab && (
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 30 }}>
          <TabBar items={TABS.map((t) => ({ id: t.id, label: t.label, icon: t.icon, badge: badges[t.id] ?? null }))} value={tab} onChange={(id) => nav('/' + id)} />
        </div>
      )}
      <SheetHost />
      {/* Tabs: above the Ask button (or Plan's approve bar). Pushed screens: above a BottomBar. */}
      <ToastHost bottom={isTab ? 160 : 104} />
      {!user && <WhoAreYou onPick={setUser} />}
    </div>
  );
}
