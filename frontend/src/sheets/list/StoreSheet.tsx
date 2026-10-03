import { Sheet } from '../../components/feedback/Sheet';
import { Button } from '../../components/core/Button';
import { Icon } from '../../components/core/Icon';
import { Card } from '../../components/display/Card';
import { ListRow } from '../../components/layout/Layout';
import { useGroceryList, useSetOrderVia, useSetWeekStore, useStores, useWeek } from '../../api/hooks';
import { useCurrentMonday } from '../../state/useCurrentMonday';
import { useUi } from '../../state/UiContext';
import { copyText } from '../../lib/clipboard';
import { dateRange, listText } from '../../lib/listText';
import { InstacartNotSetUp } from '../../screens/list/ListScreen';
import { useOpenInstacart } from '../../screens/list/useOrdering';

const VIA = [
  { id: 'delivery', label: 'Instacart delivery', sub: 'Cermak or Aldi · usually Saturday morning', icon: 'truck' },
  { id: 'pickup', label: 'Instacart pickup', sub: 'Ready at the store', icon: 'store' },
  { id: 'amazon', label: 'Amazon delivery', sub: 'Not available yet', icon: 'package', disabled: true },
  { id: 'share', label: 'Send the list to someone', sub: 'Text, email or the Notion page', icon: 'send' },
  { id: 'self', label: "We'll shop it ourselves", sub: 'Check off by aisle in the store', icon: 'shopping-basket' },
] as const;

function Choice({ icon, title, sub, on, onClick, last, disabled }: { icon: string; title: string; sub?: string; on?: boolean; onClick?: () => void; last?: boolean; disabled?: boolean }) {
  return (
    <div role="button" aria-pressed={on} aria-disabled={disabled} data-testid="choice" style={{ opacity: disabled ? 0.55 : 1 }}>
      <ListRow icon={icon} iconColor={on ? 'var(--sage-700)' : undefined} title={title} sub={sub} onClick={disabled ? undefined : onClick} last={last}
        right={<span style={{ width: 22, height: 22, borderRadius: 999, flex: 'none', display: 'grid', placeItems: 'center', border: on ? 0 : '1.5px solid var(--border-strong)', background: on ? 'var(--sage-600)' : 'transparent', color: '#fff' }}>{on && <Icon name="check" size={13} stroke={2.5} />}</span>} />
    </div>
  );
}

const overline = { display: 'block', font: 'var(--type-overline)', letterSpacing: 'var(--ls-overline)', textTransform: 'uppercase', color: 'var(--text-muted)' } as const;

export function StoreSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { toast, openSheet } = useUi();
  const monday = useCurrentMonday();
  const { data: week } = useWeek(monday);
  const { data: stores = [] } = useStores();
  const { data: list } = useGroceryList(monday);
  const setStore = useSetWeekStore();
  const setVia = useSetOrderVia();
  const ic = useOpenInstacart(monday);
  const via = week?.order_via ?? 'delivery';
  const instacart = via === 'delivery' || via === 'pickup';
  const notice = (n?: string | null, fallback?: { title: string }) => (n ? toast({ icon: 'store', title: n }) : fallback ? toast({ icon: 'store', ...fallback }) : undefined);
  const copy = async () => {
    if (!list) return;
    const ok = await copyText(listText(list, week?.store?.name));
    toast(ok ? { tone: 'success', icon: 'clipboard-list', title: 'List copied', message: 'Paste it into Google Keep, Notes or a text.' } : { tone: 'warning', icon: 'triangle-alert', title: 'Could not copy' });
  };
  return (
    <Sheet open={open} onClose={onClose} title="Store & ordering" subtitle="Café reads this store's weekly ad when it plans, and sorts the list by its aisles."
      footer={<Button size="l" fullWidth onClick={onClose}>Done</Button>}>
      <span style={{ ...overline, margin: '4px 0 6px' }}>Weekly ads from</span>
      <Card padding="none" style={{ padding: '0 14px' }}>
        {stores.map((st) => (
          <Choice key={st.id} icon="store" title={st.name} sub={`Ad ${dateRange(st.ad_from, st.ad_to)} · ${st.deal_count} deals`} on={week?.store?.key === st.key}
            onClick={() => monday && week?.store?.key !== st.key && setStore.mutate({ monday, store_key: st.key }, { onSuccess: (r) => notice(r.notice, { title: `Reading ${st.name}'s weekly ad…` }) })} />
        ))}
        <ListRow icon="plus" iconColor="var(--sage-700)" title="Add another store" sub="Not available yet" last />
      </Card>
      <span style={{ ...overline, margin: '20px 0 6px' }}>Get the groceries by</span>
      <Card padding="none" style={{ padding: '0 14px' }}>
        {VIA.map((o, i) => (
          <Choice key={o.id} icon={o.icon} title={o.label} sub={o.sub} on={via === o.id} disabled={'disabled' in o && o.disabled} last={i === VIA.length - 1}
            onClick={() => monday && via !== o.id && setVia.mutate({ monday, order_via: o.id }, { onSuccess: (r) => notice(r.notice) })} />
        ))}
      </Card>
      {instacart && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
          <Button variant="accent" fullWidth icon="shopping-cart" disabled={ic.busy} onClick={ic.open}>{ic.busy ? 'Opening…' : 'Open in Instacart'}</Button>
          {ic.notSetUp && <InstacartNotSetUp onCopy={copy} onSend={() => openSheet({ type: 'send' })} />}
        </div>
      )}
    </Sheet>
  );
}
