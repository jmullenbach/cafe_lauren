import { useState } from 'react';
import { Sheet } from '../../components/feedback/Sheet';
import { Button } from '../../components/core/Button';
import { Card } from '../../components/display/Card';
import { ChoiceChips } from '../../components/forms/ChoiceChips';
import { ListRow } from '../../components/layout/Layout';
import { useAppState, useGroceryList, useWeek } from '../../api/hooks';
import { useCurrentMonday } from '../../state/useCurrentMonday';
import { useUser } from '../../state/UserContext';
import { useUi } from '../../state/UiContext';
import { copyText } from '../../lib/clipboard';
import { listText } from '../../lib/listText';

export function SendSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useUser();
  const { toast } = useUi();
  const monday = useCurrentMonday();
  const { data: st } = useAppState();
  const { data: list } = useGroceryList(monday);
  const { data: week } = useWeek(monday);
  const others = (st?.people ?? []).filter((p) => p.key !== user).map((p) => p.name);
  const [who, setWho] = useState<string[] | null>(null);
  const picked = who ?? others.slice(0, 1);
  const n = list?.unchecked ?? 0;
  const text = () => (list ? listText(list, week?.store?.name) : '');
  const sendText = () => {
    // No SMS service on the server: hand the list to the phone's Messages app.
    window.location.href = `sms:?&body=${encodeURIComponent(text())}`;
    toast({ tone: 'success', icon: 'send', title: 'Opening Messages', message: `Send it to ${picked.join(' and ') || 'whoever is shopping'}.` });
    onClose();
  };
  const copy = async () => {
    const ok = await copyText(text());
    toast(ok ? { tone: 'success', icon: 'clipboard-list', title: 'List copied', message: 'Paste it anywhere.' } : { tone: 'warning', icon: 'triangle-alert', title: 'Could not copy' });
    if (ok) onClose();
  };
  return (
    <Sheet open={open} onClose={onClose} title="Send the list" subtitle={`${n} items for ${week?.store?.name ?? 'the store'}, sorted by aisle. Whoever shops can check things off from their phone.`}
      footer={<Button size="l" fullWidth variant="accent" icon="send" disabled={!picked.length} onClick={sendText}>Text it to {picked.join(' and ') || '…'}</Button>}>
      <span style={{ display: 'block', font: '600 13px/1 var(--font-sans)', color: 'var(--text-strong)', margin: '4px 0 10px' }}>Who's shopping?</span>
      <ChoiceChips value={picked} onChange={setWho} options={others} />
      <span style={{ display: 'block', font: 'var(--type-overline)', letterSpacing: 'var(--ls-overline)', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '24px 0 6px' }}>Or</span>
      <Card padding="none" style={{ padding: '0 14px' }}>
        <ListRow icon="clipboard-list" title="Copy as text" sub="Paste anywhere" onClick={copy} last />
      </Card>
    </Sheet>
  );
}
