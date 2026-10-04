import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/screens-b.css';
import { Screen, LargeTitle, ListRow } from '../../components/layout/Layout';
import { Button } from '../../components/core/Button';
import { IconButton } from '../../components/core/IconButton';
import { Icon } from '../../components/core/Icon';
import { Card } from '../../components/display/Card';
import { Input } from '../../components/forms/Input';
import { GroceryItem } from '../../components/kitchen/GroceryItem';
import { useAddListItem, useCheckListItem, useConfirmListDiff, useDeleteListItem, useGroceryList, usePatchListItem, useWeek } from '../../api/hooks';
import { useCurrentMonday } from '../../state/useCurrentMonday';
import { useUi } from '../../state/UiContext';
import { copyText } from '../../lib/clipboard';
import { dateRange, itemNote, listText } from '../../lib/listText';
import { SECTION_ORDER, useSendToInstacart } from './useOrdering';
import type { ListItem, Section } from '../../api/models';

const VIA_LABEL: Record<string, string> = { delivery: 'Instacart delivery', pickup: 'Instacart pickup', amazon: 'Amazon delivery', share: 'Send the list', self: "We'll shop it ourselves" };

function EditableItem({ monday, it }: { monday: string; it: ListItem }) {
  const [edit, setEdit] = useState(false);
  const [qty, setQty] = useState(it.qty ?? '');
  const [name, setName] = useState(it.name);
  const [note, setNote] = useState(it.note ?? '');
  const patch = usePatchListItem();
  const del = useDeleteListItem();
  const check = useCheckListItem();
  const { toast } = useUi();
  if (edit) {
    return (
      <div data-testid="list-item-edit" style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 0', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <Input size="s" style={{ flex: 1, minWidth: 0 }} value={qty} onChange={(e) => setQty(e.target.value)} placeholder="Amount" />
          <Input size="s" style={{ flex: 2.2, minWidth: 0 }} value={name} onChange={(e) => setName(e.target.value)} placeholder="Item" />
        </div>
        <Input size="s" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note, e.g. brand or which meal" />
        <div style={{ display: 'flex', gap: 8 }}>
          <Button size="s" variant="ghost" icon="trash-2" style={{ color: 'var(--tomato-500)' }} onClick={() => del.mutate({ monday, key: it.key }, { onSuccess: () => toast({ icon: 'trash-2', title: `Removed ${it.name}` }) })}>Remove</Button>
          <span style={{ flex: 1 }} />
          <Button size="s" variant="ghost" onClick={() => setEdit(false)}>Cancel</Button>
          <Button size="s" icon="check" disabled={!name.trim() || patch.isPending} onClick={() => patch.mutate({ monday, key: it.key, qty: qty.trim(), name: name.trim(), note: note.trim() }, { onSuccess: () => setEdit(false), onError: (e) => toast({ tone: 'danger', icon: 'triangle-alert', title: 'Could not save', message: (e as Error).message }) })}>Save</Button>
        </div>
      </div>
    );
  }
  return (
    <div data-testid="list-item" data-key={it.key} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <GroceryItem qty={it.qty ?? undefined} name={it.name} note={itemNote(it)} sale={it.sale ?? undefined} staple={it.staple} from={it.from ?? undefined} checked={it.checked} onChange={(c) => check.mutate({ monday, key: it.key, checked: c })} style={{ flex: 1, minWidth: 0 }} />
      <IconButton icon="pencil" label={`Edit ${it.name}`} size="s" onClick={() => { setQty(it.qty ?? ''); setName(it.name); setNote(it.note ?? ''); setEdit(true); }} style={{ color: 'var(--text-muted)' }} />
    </div>
  );
}

function AddListRow({ monday, sec }: { monday: string; sec: Section }) {
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState('');
  const [name, setName] = useState('');
  const add = useAddListItem();
  const submit = () => { if (!name.trim()) return; add.mutate({ monday, text: [qty.trim(), name.trim()].filter(Boolean).join(' '), section: sec.key }, { onSuccess: () => { setName(''); setQty(''); } }); };
  if (!open) return <button type="button" onClick={() => setOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', minHeight: 44, padding: 0, border: 0, background: 'none', cursor: 'pointer', color: 'var(--sage-700)', font: '600 14px/1 var(--font-sans)' }}><Icon name="plus" size={18} />Add to {sec.label.toLowerCase()}</button>;
  return (
    <form onSubmit={(e) => { e.preventDefault(); submit(); }} style={{ display: 'flex', gap: 8, padding: '10px 0', alignItems: 'center' }}>
      <Input size="s" style={{ width: 80, flex: 'none' }} value={qty} onChange={(e) => setQty(e.target.value)} placeholder="Amount" />
      <Input size="s" style={{ flex: 1, minWidth: 0 }} value={name} onChange={(e) => setName(e.target.value)} placeholder="Item" />
      <IconButton icon="plus" label="Add" variant="primary" size="s" onClick={submit} />
      <IconButton icon="x" label="Done" size="s" onClick={() => setOpen(false)} />
    </form>
  );
}

function QuickAdd({ monday }: { monday: string }) {
  const [v, setV] = useState('');
  const add = useAddListItem();
  const { toast } = useUi();
  const submit = () => {
    const t = v.trim();
    if (!t || add.isPending) return;
    add.mutate({ monday, text: t }, {
      onSuccess: (l) => {
        setV('');
        const newest = l.sections.flatMap((s) => s.items.map((i) => ({ i, s }))).filter((x) => x.i.key.startsWith('add-')).sort((a, b) => Number(b.i.key.slice(4)) - Number(a.i.key.slice(4)))[0];
        toast({ tone: 'success', icon: 'plus', title: `Added ${t}`, message: newest?.s.name });
      },
      onError: (e) => toast({ tone: 'danger', icon: 'triangle-alert', title: 'Could not add', message: (e as Error).message }),
    });
  };
  return (
    <form onSubmit={(e) => { e.preventDefault(); submit(); }} style={{ display: 'flex', gap: 8, margin: '4px 0 0' }}>
      <Input icon="plus" style={{ flex: 1, minWidth: 0 }} value={v} onChange={(e) => setV(e.target.value)} placeholder="Add anything: “2 lbs apples”" />
      <Button type="submit" variant="secondary" disabled={!v.trim() || add.isPending}>Add</Button>
    </form>
  );
}

export function ListScreen() {
  const nav = useNavigate();
  const { openSheet, toast } = useUi();
  const monday = useCurrentMonday();
  const { data: list } = useGroceryList(monday);
  const { data: week } = useWeek(monday);
  const confirm = useConfirmListDiff();
  const ic = useSendToInstacart(monday);
  const store = week?.store;
  const via = week?.order_via ?? 'delivery';
  const left = list?.unchecked ?? 0;
  const sections = [...(list?.sections ?? [])].sort((a, b) => SECTION_ORDER.indexOf(a.key) - SECTION_ORDER.indexOf(b.key));

  const copy = async () => {
    if (!list) return;
    const ok = await copyText(listText(list, store?.name));
    toast(ok ? { tone: 'success', icon: 'clipboard-list', title: 'List copied', message: 'Paste it into Google Keep, Notes or a text.' } : { tone: 'warning', icon: 'triangle-alert', title: 'Could not copy', message: 'Your browser blocked it.' });
  };
  const adWindow = dateRange(store?.ad_from, store?.ad_to);

  return (
    <Screen>
      <LargeTitle overline={store?.name ?? ' '} title="Grocery list" sub={list ? `${left} of ${list.total} still to get · sorted by aisle` : undefined}
        right={<Button size="s" variant="secondary" icon="clipboard-list" onClick={copy}>Copy</Button>} />
      {list && !list.approved && (
        <div data-testid="draft-notice" style={{ display: 'flex', gap: 10, padding: '12px 14px', borderRadius: 'var(--radius-s)', background: 'var(--honey-100)', color: 'var(--honey-700)', font: '400 13px/1.45 var(--font-sans)', marginBottom: 16 }}>
          <Icon name="info" size={16} style={{ marginTop: 2 }} />
          <span>Draft list. It follows the plan, and you can order once the week is approved. <b style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => nav('/plan')}>Go to plan</b></span>
        </div>
      )}
      {list && list.diff.length > 0 && (
        <Card padding="m" style={{ marginBottom: 16, background: 'var(--terra-50)', borderColor: 'var(--terra-100)' }}>
          <div data-testid="list-diff" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ font: '600 14px/1.3 var(--font-sans)', color: 'var(--terra-700)' }}>The plan changed after approval</span>
            {list.diff.map((d) => (
              <span key={d.key + d.change} style={{ font: '400 13px/1.3 var(--font-sans)', color: 'var(--text-body)' }}>
                <b style={{ color: d.change === 'removed' ? 'var(--terra-700)' : 'var(--sage-700)', display: 'inline-block', width: 14 }}>{d.change === 'added' ? '+' : d.change === 'removed' ? '−' : '~'}</b>
                {[d.qty, d.name].filter(Boolean).join(' ')}{d.change === 'changed' && d.previous_qty ? ` (was ${d.previous_qty})` : ''}
              </span>
            ))}
            <Button size="s" variant="secondary" icon="check" disabled={confirm.isPending} style={{ alignSelf: 'flex-start', marginTop: 4 }} onClick={() => monday && confirm.mutate({ monday }, { onSuccess: () => toast({ tone: 'success', icon: 'check', title: 'List updated' }) })}>Looks right</Button>
          </div>
        </Card>
      )}
      <Card padding="none" style={{ padding: '0 14px', marginBottom: 12 }}>
        <ListRow icon="store" iconColor="var(--sage-700)" title={store?.name ?? 'Choose a store'} sub={`Weekly ad ${adWindow} · ${VIA_LABEL[via] ?? via}`} onClick={() => openSheet({ type: 'store' })} right={<span style={{ font: '600 13px/1 var(--font-sans)', color: 'var(--sage-700)' }}>Change</span>} last />
      </Card>
      {via === 'share' ? (
        <Button size="l" fullWidth variant="accent" icon="send" onClick={() => openSheet({ type: 'send' })} style={{ marginBottom: 8 }}>Send the list · {left} items</Button>
      ) : via === 'self' ? (
        <p style={{ display: 'flex', gap: 8, font: '400 13px/1.45 var(--font-sans)', color: 'var(--text-muted)', margin: '0 0 8px' }}><Icon name="shopping-basket" size={16} style={{ marginTop: 1 }} />Sorted by {store?.name ?? 'the store'}'s aisles. Check things off as you go.</p>
      ) : via === 'amazon' ? (
        <p data-testid="amazon-na" style={{ display: 'flex', gap: 8, font: '400 13px/1.45 var(--font-sans)', color: 'var(--text-muted)', margin: '0 0 8px' }}><Icon name="info" size={16} style={{ marginTop: 1 }} />Amazon ordering is not available yet. Copy the list or send it instead.</p>
      ) : list?.approved ? (
        <Button size="l" fullWidth variant="accent" icon="shopping-cart" onClick={ic.send} style={{ marginBottom: 8 }}>Send to Instacart · {left} items</Button>
      ) : null}
      <QuickAdd monday={monday ?? ''} />
      {sections.map((sec) => (
        <div key={sec.key} data-testid="list-section" data-section={sec.key}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '24px 0 4px' }}>
            <Icon name={sec.icon} size={18} style={{ color: 'var(--sage-600)' }} />
            <h2 style={{ flex: 1, font: 'var(--type-h3)', fontSize: 16, color: 'var(--text-strong)' }}>{sec.name}</h2>
            <span style={{ font: '500 12px/1 var(--font-sans)', color: 'var(--text-muted)' }}>{sec.items.length}</span>
          </div>
          {sec.items.map((it) => <EditableItem key={it.key + it.name + (it.qty ?? '') + (it.note ?? '')} monday={monday!} it={it} />)}
          <AddListRow monday={monday!} sec={sec} />
        </div>
      ))}
    </Screen>
  );
}
