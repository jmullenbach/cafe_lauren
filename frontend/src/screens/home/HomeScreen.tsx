import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/core/Button';
import { Icon } from '../../components/core/Icon';
import { ProfileButton } from '../settings/ProfileButton';
import { Badge } from '../../components/display/Badge';
import { Card } from '../../components/display/Card';
import { DayTag } from '../../components/display/DayTag';
import { CookChip, useCookPerson } from '../../components/kitchen/CookChip';
import { SuggestedTag } from '../../components/kitchen/SuggestedTag';
import { Screen, LargeTitle, SectionHead, MealPhoto, ListRow } from '../../components/layout/Layout';
import type { Slot } from '../../api/models';
import { useUi } from '../../state/UiContext';
import { useWeekData } from '../../state/useWeekSlots';
import { DAYNAME, DAYS, dayKey, hasSale, mealRoute, slotTitle } from '../../lib/meal';

function needs(a: ReturnType<typeof useWeekData>, go: (to: string) => void) {
  const n: Array<{ icon: string; color: string; title: string; sub: string; to: string }> = [];
  const pend = a.slots.filter((s) => s.kind === 'cook' && s.status === 'suggested');
  if (pend.length) n.push({ icon: 'sparkles', color: 'var(--sage-700)', title: `${pend.length} suggested meal${pend.length > 1 ? 's' : ''} to review`, sub: pend.map((s) => DAYNAME[s.day]).join(', '), to: '/plan' });
  const st = a.state;
  if (st && !st.pantry.done) n.push({ icon: 'refrigerator', color: 'var(--honey-700)', title: 'Check what Café found in the pantry', sub: st.pantry.unsure ? `${st.pantry.unsure} item${st.pantry.unsure > 1 ? 's' : ''} it wasn't sure about` : 'Confirm what is on hand', to: '/inbox' });
  if (st && st.requests.new > 0) {
    const who = (st.requests.new_from ?? []).map((k) => a.nameOf(k)).filter((v, i, x) => x.indexOf(v) === i).join(', ');
    n.push({ icon: 'message-circle', color: 'var(--slate-500)', title: `${st.requests.new} new request${st.requests.new > 1 ? 's' : ''}`, sub: who, to: '/inbox' });
  }
  if (st && st.list.diff_count > 0) n.push({ icon: 'shopping-basket', color: 'var(--terra-500)', title: 'Plan changed since approval', sub: 'Review the grocery list changes', to: '/list' });
  void go;
  return n;
}

function Tonight({ slot }: { slot?: Slot }) {
  const nav = useNavigate();
  const { openSheet } = useUi();
  const m = slot?.recipe;
  if (!slot || !m) return <Card tone="sunken"><span style={{ font: 'italic 400 16px/1.4 var(--font-serif)', color: 'var(--text-muted)' }}>{(slot && slotTitle(slot)) || 'Nothing planned tonight'}</span></Card>;
  const start = new Date(); start.setHours(18, 0, 0, 0); start.setMinutes(start.getMinutes() - (m.total_min ?? 30));
  const startBy = `${start.getHours() % 12 || 12}:${String(start.getMinutes()).padStart(2, '0')}`;
  return (
    <Card padding="none">
      <div data-testid="tonight">
        <MealPhoto height={150} radius="0"><div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}><DayTag day={dayKey(slot.day)} label="Tonight" />{hasSale(slot) && <Badge tone="sale" variant="solid" icon="tag">On sale</Badge>}</div></MealPhoto>
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h3 style={{ font: '400 22px/1.2 var(--font-serif)', color: 'var(--text-strong)' }}>{m.title}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <CookChip cook={slot.cook} onClick={() => openSheet({ type: 'cook', slotId: slot.id })} />
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: '500 13px/1 var(--font-sans)', color: 'var(--text-body)' }}><Icon name="clock" size={15} style={{ color: 'var(--text-muted)' }} />Start by {startBy} for dinner at 6</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <Button variant="secondary" icon="refresh-cw" style={{ flex: 1 }} onClick={() => openSheet({ type: 'swap', slotId: slot.id })}>Swap</Button>
            <Button icon="chef-hat" style={{ flex: 1.4 }} onClick={() => nav(mealRoute(slot) + '&cook=1')}>Start cooking</Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function WeekRow({ s, last }: { s: Slot; last: boolean }) {
  const nav = useNavigate();
  const { openSheet } = useUi();
  const cookP = useCookPerson(s.cook);
  const cook = s.kind === 'cook';
  const eats = cook || s.kind === 'leidy';
  return (
    <div data-testid={`week-row-${s.day}`} onClick={() => s.recipe_id && nav(mealRoute(s))} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: last ? 0 : '1px solid var(--border-subtle)', cursor: s.recipe_id ? 'pointer' : 'default' }}>
      <span aria-hidden style={{ width: 3, height: 26, borderRadius: 2, flex: 'none', margin: '0 -4px 0 -6px', background: cookP && eats ? cookP.tone.edge : 'transparent' }} />
      <DayTag day={dayKey(s.day)} short style={{ width: 44, justifyContent: 'center' }} />
      <span style={{ flex: 1, minWidth: 0, font: cook ? '400 15px/1.3 var(--font-serif)' : 'italic 400 14px/1.3 var(--font-serif)', color: cook ? 'var(--text-strong)' : 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{slotTitle(s)}</span>
      {eats && <CookChip cook={s.cook} compact onClick={(e) => { e.stopPropagation(); openSheet({ type: 'cook', slotId: s.id }); }} />}
      {(s.status === 'approved' || s.status === 'kept') && <Icon name="check" size={16} style={{ color: 'var(--sage-600)' }} />}
      {cook && s.status !== 'approved' && s.status !== 'kept' && s.status !== 'suggested' && <SuggestedTag status={s.status ?? 'suggested'} label={s.status === 'edited' ? 'Edited' : undefined} />}
      {cook && s.status === 'suggested' && <Icon name="sparkles" size={15} style={{ color: 'var(--sage-600)' }} />}
    </div>
  );
}

export function HomeScreen() {
  const a = useWeekData();
  const nav = useNavigate();
  const now = new Date();
  const today = DAYS[(now.getDay() + 6) % 7];
  const tonight = a.slots.find((s) => s.day === today);
  const h = now.getHours();
  const greet = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  const items = needs(a, nav);
  const overline = now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  return (
    <Screen>
      <LargeTitle overline={overline} title={a.me ? `${greet}, ${a.me.name}` : greet} right={<ProfileButton />} />
      {a.loading ? <Card tone="sunken"><span className="clm-skeleton" style={{ display: 'block', height: 120 }} /></Card> : <Tonight slot={tonight} />}
      <SectionHead title="Needs you" />
      {items.length === 0
        ? <Card tone="accent" padding="m"><div style={{ display: 'flex', gap: 10, alignItems: 'center', font: '500 14px/1.4 var(--font-sans)', color: 'var(--sage-900)' }}><Icon name="circle-check" size={20} />Nothing needs you right now.</div></Card>
        : <Card padding="none" style={{ padding: '0 16px' }}><div data-testid="needs-you">{items.map((n, i) => <ListRow key={n.title} icon={n.icon} iconColor={n.color} title={n.title} sub={n.sub} onClick={() => nav(n.to)} last={i === items.length - 1} />)}</div></Card>}
      <SectionHead title="This week" aside="Edit plan" onAside={() => nav('/plan')} />
      <Card padding="none" style={{ padding: '0 16px' }}>
        {a.slots.map((s, i) => <WeekRow key={s.id} s={s} last={i === a.slots.length - 1} />)}
      </Card>
      <SectionHead title="Delivery" />
      <Card padding="none" style={{ padding: '0 16px' }}>
        <ListRow icon="truck" title="Not ordered yet" sub="Usually Saturday morning" onClick={() => nav('/list')} last />
      </Card>
    </Screen>
  );
}
