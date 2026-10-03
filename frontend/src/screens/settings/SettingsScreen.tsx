import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/screens-b.css';
import { Screen, BackHeader, SectionHead, BottomBar, ListRow } from '../../components/layout/Layout';
import { Button } from '../../components/core/Button';
import { Badge } from '../../components/display/Badge';
import { Card } from '../../components/display/Card';
import { Avatar } from '../../components/display/Avatar';
import { Input } from '../../components/forms/Input';
import { Select } from '../../components/forms/Select';
import { ChoiceChips } from '../../components/forms/ChoiceChips';
import { useHealth, usePutSettings, useSettings, useStores } from '../../api/hooks';
import { downloadExport } from '../../api/extra';
import { useCurrentMonday } from '../../state/useCurrentMonday';
import { useUser } from '../../state/UserContext';
import { useUi } from '../../state/UiContext';
import type { AppSettings } from '../../api/models';
import type { PersonColor } from '../../components/types';

const DAYS = [['mon', 'Monday'], ['tue', 'Tuesday'], ['wed', 'Wednesday'], ['thu', 'Thursday'], ['fri', 'Friday'], ['sat', 'Saturday'], ['sun', 'Sunday']] as const;
const VIA = [{ value: 'delivery', label: 'Instacart delivery' }, { value: 'pickup', label: 'Instacart pickup' }, { value: 'share', label: 'Send the list to someone' }, { value: 'self', label: "We'll shop it ourselves" }];
const nums = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => String(a + i));
const MODEL_LABEL: Record<string, string> = { plan: 'Planning', chat: 'Chat', vision: 'Photos and ads', fast: 'Quick tasks' };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><span className="b-label">{label}</span>{children}</div>;
}

function HealthRow({ label, ok, text, last }: { label: string; ok: boolean | null; text: string; last?: boolean }) {
  return <ListRow title={label} last={last} right={<Badge tone={ok === null ? 'neutral' : ok ? 'success' : 'warning'}>{text}</Badge>} />;
}

export function SettingsScreen() {
  const nav = useNavigate();
  const { person, clearUser } = useUser();
  const { toast } = useUi();
  const monday = useCurrentMonday();
  const { data: saved } = useSettings();
  const { data: stores = [] } = useStores();
  const { data: health, isError: healthDown } = useHealth();
  const put = usePutSettings();
  const [f, setF] = useState<AppSettings | null>(null);
  useEffect(() => { if (saved && !f) setF(saved); }, [saved, f]);
  const dirty = !!f && !!saved && JSON.stringify(f) !== JSON.stringify(saved);
  const set = <K extends keyof AppSettings>(k: K, v: AppSettings[K]) => setF((x) => (x ? { ...x, [k]: v } : x));
  const [busy, setBusy] = useState<string | null>(null);

  const save = () => f && put.mutate(f, {
    onSuccess: (s) => { setF(s); toast({ tone: 'success', icon: 'check', title: 'Settings saved' }); },
    onError: (e) => toast({ tone: 'danger', icon: 'triangle-alert', title: 'Could not save', message: (e as Error).message }),
  });
  const exp = async (key: string, path: string, name: string) => {
    setBusy(key);
    try { await downloadExport(path, name); } catch (e) { toast({ tone: 'danger', icon: 'triangle-alert', title: 'Export failed', message: (e as Error).message }); }
    setBusy(null);
  };
  const lastRun = health?.last_prep_run ? new Date(health.last_prep_run.endsWith('Z') || /[+-]\d\d:?\d\d$/.test(health.last_prep_run) ? health.last_prep_run : health.last_prep_run + 'Z').toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : 'Never';

  return (
    <>
      <Screen bottom={120}>
        <BackHeader title="Settings" onBack={() => nav(-1)} />
        <h1 style={{ font: '300 36px/1.05 var(--font-serif)', letterSpacing: 'var(--ls-display)', color: 'var(--text-strong)', margin: '16px 0 8px' }}>Settings</h1>

        <SectionHead title="You" />
        <Card padding="none" style={{ padding: '0 14px' }}>
          <ListRow last title={person ? `Using Café as ${person.name}` : 'Not picked'} sub="Votes, requests and ratings are recorded under this name."
            right={<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>{person && <Avatar name={person.name} color={person.color as PersonColor} size={32} />}<Button size="s" variant="secondary" onClick={clearUser}>Switch</Button></div>} />
        </Card>

        {f && (
          <>
            <SectionHead title="Planning" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <Select label="Prep day" style={{ flex: 1 }} value={f.prep_day} onChange={(e) => set('prep_day', e.target.value as AppSettings['prep_day'])} options={DAYS.map(([v, l]) => ({ value: v, label: l }))} />
                <Input label="Prep time" type="time" style={{ flex: 1 }} value={f.prep_time} onChange={(e) => set('prep_time', e.target.value)} />
              </div>
              <Field label="Leidy cooks on">
                <ChoiceChips size="s" value={f.leidy_nights} onChange={(v) => set('leidy_nights', v)} options={DAYS.map(([v, l]) => ({ value: v, label: l.slice(0, 3) }))} />
              </Field>
              <div style={{ display: 'flex', gap: 12 }}>
                <Select label="People at the table" style={{ flex: 1 }} value={String(f.household_size)} onChange={(e) => set('household_size', Number(e.target.value))} options={nums(1, 12)} />
                <Select label="Cook nights" style={{ flex: 1 }} value={String(f.cook_nights_target ?? 5)} onChange={(e) => set('cook_nights_target', Number(e.target.value))} options={nums(0, 7)} />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <Select label="Default store" style={{ flex: 1 }} value={f.default_store} onChange={(e) => set('default_store', e.target.value)} options={stores.length ? stores.map((s) => ({ value: s.key, label: s.name })) : [f.default_store]} />
                <Select label="Default ordering" style={{ flex: 1 }} value={f.default_order_via ?? 'delivery'} onChange={(e) => set('default_order_via', e.target.value as AppSettings['default_order_via'])} options={VIA} />
              </div>
            </div>
            {Object.keys(f.models ?? {}).length > 0 && (
              <>
                <SectionHead title="Models" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {Object.entries(f.models ?? {}).map(([k, v]) => <Input key={k} label={MODEL_LABEL[k] ?? k} value={v} onChange={(e) => set('models', { ...f.models, [k]: e.target.value })} />)}
                </div>
              </>
            )}
          </>
        )}

        <SectionHead title="Health" />
        <Card padding="none" style={{ padding: '0 14px' }} >
          <div data-testid="health">
            {healthDown || !health ? <HealthRow label="Backend" ok={false} text={healthDown ? 'Not reachable' : 'Checking…'} last /> : (
              <>
                <HealthRow label="Database" ok={health.database} text={health.database ? 'OK' : 'Down'} />
                <HealthRow label="Claude" ok={health.ai_mode === 'fake' ? null : health.claude_token === 'present'} text={health.ai_mode === 'fake' ? 'Demo mode' : health.claude_token === 'present' ? 'Token present' : 'Token missing'} />
                <HealthRow label="Instacart" ok={health.instacart === 'configured'} text={health.instacart === 'configured' ? 'Configured' : 'Not set up yet'} />
                <HealthRow label="Last prep run" ok={null} text={lastRun} />
                <HealthRow label="Background worker" ok={health.worker_running} text={health.worker_running ? 'Running' : 'Stopped'} last />
              </>
            )}
          </div>
        </Card>
        {health && <p style={{ font: '400 12px/1.4 var(--font-sans)', color: 'var(--text-faint)', margin: '8px 0 0' }}>Version {health.version}</p>}

        <SectionHead title="Export" />
        <p style={{ font: '400 14px/1.5 var(--font-sans)', color: 'var(--text-body)', margin: '0 0 12px' }}>Your data is yours. Download it any time.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Button variant="secondary" icon="list" disabled={busy === 'all'} onClick={() => exp('all', '/api/export/all.json', 'cafe-lauren.json')}>Everything (JSON)</Button>
          <Button variant="secondary" icon="book-open" disabled={busy === 'recipes'} onClick={() => exp('recipes', '/api/export/recipes.zip', 'cafe-lauren-recipes.zip')}>Recipes (zip)</Button>
          <Button variant="secondary" icon="receipt" disabled={busy === 'db'} onClick={() => exp('db', '/api/export/database', 'cafe-lauren.db')}>Database file</Button>
          <Button variant="secondary" icon="calendar-days" disabled={!monday || busy === 'week'} onClick={() => monday && exp('week', `/api/export/weeks/${monday}.md`, `cafe-lauren-week-${monday}.md`)}>This week (Markdown)</Button>
        </div>
      </Screen>
      <BottomBar>
        <Button size="l" fullWidth variant="accent" icon="check" disabled={!dirty || put.isPending} onClick={save}>{put.isPending ? 'Saving…' : dirty ? 'Save settings' : 'Saved'}</Button>
      </BottomBar>
    </>
  );
}
