import { useState } from 'react';
import type { ReactNode } from 'react';
import { Sheet } from '../../components/feedback/Sheet';
import { Button } from '../../components/core/Button';
import { IconButton } from '../../components/core/IconButton';
import { Icon } from '../../components/core/Icon';
import { Input } from '../../components/forms/Input';
import { Select } from '../../components/forms/Select';
import { SuggestedTag } from '../../components/kitchen/SuggestedTag';
import { useChat, useGroceryList, useResolveListChanges } from '../../api/hooks';
import type { ChatListChange, ListChangeDecision, ListItem } from '../../api/models';
import { useUi } from '../../state/UiContext';
import { useWeekData } from '../../state/useWeekSlots';
import { SECTION_ORDER } from '../../screens/list/useOrdering';

type Edit = Pick<ChatListChange, 'name' | 'qty' | 'note' | 'section'>;

export const CHANGE_LOOK: Record<ChatListChange['op'], { mark: string; fg: string; bg: string; done: string }> = {
  add: { mark: '+', fg: 'var(--sage-700)', bg: 'var(--sage-50)', done: 'Added' },
  update: { mark: '~', fg: 'var(--honey-700)', bg: 'var(--honey-100)', done: 'Changed' },
  remove: { mark: '−', fg: 'var(--terra-700)', bg: 'var(--terra-50)', done: 'Removed' },
};
const was = { textDecoration: 'line-through', color: 'var(--text-muted)', fontWeight: 400 } as const;

/** "~~2 lbs~~ 3 lbs chicken thighs": the item with what an update replaces struck through. */
export function ChangeText({ c }: { c: Edit & Pick<ChatListChange, 'op' | 'before'> }) {
  if (c.op === 'remove') return <span style={was}>{[c.qty, c.name].filter(Boolean).join(' ')}</span>;
  const b = c.op === 'update' ? c.before : null;
  return (<>
    {b && b.qty && b.qty !== c.qty && <span style={was}>{b.qty} </span>}
    {c.qty && <strong style={{ fontWeight: 650 }}>{c.qty} </strong>}
    {b && b.name !== c.name && <span style={was}>{b.name} </span>}
    {c.name}
  </>);
}

function ChangeRow({ c, v, sectionLabel, sections, busy, onEdit, onResolve }: {
  c: ChatListChange; v: Edit; sectionLabel: (k: string) => string; sections: Array<{ value: string; label: string }>;
  busy: boolean; onEdit: (e: Edit) => void; onResolve: (action: 'apply' | 'dismiss') => void;
}) {
  const [edit, setEdit] = useState(false);
  const [d, setD] = useState<Edit>(v);
  const look = CHANGE_LOOK[c.op];
  const pending = c.state === 'pending';
  const sub = [v.note, c.op === 'update' && c.before && c.before.section !== v.section ? `Moved from ${sectionLabel(c.before.section)}` : null,
    c.op === 'update' && c.before && (c.before.note ?? '') !== (v.note ?? '') && c.before.note ? `Note was “${c.before.note}”` : null].filter(Boolean).join(' · ');
  const box = { margin: '4px -8px', padding: '10px 8px', borderRadius: 'var(--radius-s)', background: pending ? look.bg : 'transparent' };
  if (edit) {
    return (
      <div data-testid="list-change-edit" style={{ ...box, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <Input size="s" style={{ flex: 1, minWidth: 0 }} value={d.qty ?? ''} onChange={(e) => setD({ ...d, qty: e.target.value })} placeholder="Amount" />
          <Input size="s" style={{ flex: 2.2, minWidth: 0 }} value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} placeholder="Item" />
        </div>
        <Input size="s" value={d.note ?? ''} onChange={(e) => setD({ ...d, note: e.target.value })} placeholder="Note, e.g. brand or which meal" />
        <Select size="s" options={sections} value={d.section} onChange={(e) => setD({ ...d, section: e.target.value as Edit['section'] })} />
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button size="s" variant="ghost" onClick={() => setEdit(false)}>Cancel</Button>
          <Button size="s" icon="check" disabled={!d.name.trim()} onClick={() => { onEdit({ ...d, name: d.name.trim(), qty: d.qty?.trim() || null, note: d.note?.trim() || null }); setEdit(false); }}>Use this</Button>
        </div>
      </div>
    );
  }
  return (
    <div data-testid="list-change" data-op={c.op} data-state={c.state} style={{ ...box, display: 'flex', alignItems: 'center', gap: 8 }}>
      <b aria-hidden style={{ width: 14, flex: 'none', textAlign: 'center', color: look.fg, font: '700 16px/1 var(--font-sans)' }}>{look.mark}</b>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ font: '400 15px/1.35 var(--font-sans)', color: 'var(--text-strong)' }}><ChangeText c={{ ...v, op: c.op, before: c.before }} /></span>
        {sub && <span style={{ font: '400 12.5px/1.3 var(--font-sans)', color: 'var(--text-muted)' }}>{sub}</span>}
      </div>
      {pending ? (<>
        {c.op !== 'remove' && <IconButton icon="pencil" label={`Edit ${v.name}`} size="s" disabled={busy} onClick={() => { setD(v); setEdit(true); }} style={{ color: 'var(--text-muted)' }} />}
        <IconButton icon="x" label={`Dismiss ${v.name}`} size="s" variant="secondary" disabled={busy} onClick={() => onResolve('dismiss')} />
        <IconButton icon="check" label={`Approve ${v.name}`} size="s" variant="accent" disabled={busy} onClick={() => onResolve('apply')} />
      </>) : <SuggestedTag status="kept" label={look.done} />}
    </div>
  );
}

function PlainRow({ it }: { it: ListItem }) {
  return (
    <div data-testid="list-context" style={{ padding: '8px 0 8px 22px', font: '400 14px/1.35 var(--font-sans)', color: 'var(--text-muted)', textDecoration: it.checked ? 'line-through' : 'none', borderBottom: '1px solid var(--border-subtle)' }}>
      {it.qty && <strong style={{ fontWeight: 600 }}>{it.qty} </strong>}{it.name}
    </div>
  );
}

/**
 * Café's proposed grocery list changes, shown where they land in the list. Each one can be edited,
 * approved or dismissed on its own, or all approved at once. Nothing reaches the list before that.
 */
export function ListReviewSheet({ open, messageId }: { open: boolean; messageId?: number }) {
  const { monday } = useWeekData();
  const { openSheet, toast } = useUi();
  const { data: msgs = [] } = useChat(monday);
  const { data: list } = useGroceryList(monday);
  const resolve = useResolveListChanges();
  const [edits, setEdits] = useState<Record<number, Edit>>({});
  const [opened, setOpened] = useState<Record<string, boolean>>({});
  const changes = msgs.find((m) => m.id === messageId)?.list_changes ?? [];
  const pending = changes.filter((c) => c.state === 'pending');
  const back = () => openSheet({ type: 'chat' });

  const view = (c: ChatListChange): Edit => (c.state === 'pending' && edits[c.id]) || { name: c.name, qty: c.qty, note: c.note, section: c.section };
  const decide = (c: ChatListChange, action: 'apply' | 'dismiss'): ListChangeDecision => ({ id: c.id, action, ...(action === 'apply' ? edits[c.id] : {}) });
  const send = (cs: ChatListChange[], action: 'apply' | 'dismiss', done?: () => void) => {
    if (messageId == null || !cs.length) return;
    resolve.mutate({ messageId, changes: cs.map((c) => decide(c, action)) }, {
      onSuccess: (r) => {
        const missed = r.message.list_changes?.filter((x) => x.state === 'missed' && cs.some((c) => c.id === x.id)) ?? [];
        if (missed.length) toast({ tone: 'warning', icon: 'triangle-alert', title: 'Some items left the list', message: missed.map((x) => x.name).join(', ') });
        done?.();
      },
      onError: (e) => toast({ tone: 'danger', icon: 'triangle-alert', title: 'Could not update the list', message: (e as Error).message }),
    });
  };

  const sections = [...(list?.sections ?? [])].sort((a, b) => SECTION_ORDER.indexOf(a.key) - SECTION_ORDER.indexOf(b.key));
  const sectionLabel = (k: string) => sections.find((s) => s.key === k)?.label ?? k;
  const options = sections.map((s) => ({ value: s.key, label: s.label }));
  // Changes shown in the list: waiting ones and approved ones. Each sits in the aisle it lands in.
  const shown = changes.filter((c) => c.state === 'pending' || c.state === 'applied');
  const byKey = new Map(shown.filter((c) => c.key).map((c) => [c.key!, c]));
  const aisleOf = new Map(sections.flatMap((s) => s.items.map((i) => [i.key, s.key] as const)));
  const where = (c: ChatListChange) => (c.state === 'applied' && c.key && aisleOf.get(c.key)) || view(c).section;
  const row = (c: ChatListChange): ReactNode => (
    <ChangeRow key={`c${c.id}`} c={c} v={view(c)} sectionLabel={sectionLabel} sections={options} busy={resolve.isPending}
      onEdit={(e) => setEdits((x) => ({ ...x, [c.id]: e }))} onResolve={(a) => send([c], a)} />
  );

  return (
    <Sheet open={open} onClose={back} maxHeight="92%" title="Review list changes"
      subtitle={pending.length ? `${pending.length} to review, shown where they land in the list. Nothing changes until you approve.` : 'All reviewed.'}
      footer={pending.length
        ? <><Button variant="secondary" style={{ flex: 1 }} disabled={resolve.isPending} onClick={() => send(pending, 'dismiss', back)}>Dismiss all</Button><Button variant="accent" icon="check" style={{ flex: 1.4 }} disabled={resolve.isPending} onClick={() => send(pending, 'apply', () => { toast({ tone: 'success', icon: 'check', title: 'List updated' }); back(); })}>Approve all · {pending.length}</Button></>
        : <Button variant="secondary" style={{ flex: 1 }} onClick={back}>Back to Café</Button>}>
      <div data-testid="list-review">
        {sections.map((sec) => {
          const inPlace = sec.items.filter((it) => { const c = byKey.get(it.key); return !c || where(c) === sec.key; });
          const landing = shown.filter((c) => where(c) === sec.key && !(c.key && aisleOf.get(c.key) === sec.key));
          const count = inPlace.filter((it) => byKey.has(it.key)).length + landing.length;
          const isOpen = opened[sec.key] ?? count > 0;
          return (
            <div key={sec.key} data-testid="review-section" data-section={sec.key}>
              <button type="button" onClick={() => setOpened((o) => ({ ...o, [sec.key]: !isOpen }))} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', margin: '16px 0 2px', padding: 0, border: 0, background: 'none', cursor: 'pointer', textAlign: 'left' }}>
                <Icon name={sec.icon} size={18} style={{ color: 'var(--sage-600)' }} />
                <h3 style={{ flex: 1, font: 'var(--type-h3)', fontSize: 15, color: 'var(--text-strong)' }}>{sec.label}</h3>
                <span style={{ font: '500 12px/1 var(--font-sans)', color: count ? 'var(--sage-700)' : 'var(--text-muted)' }}>{count ? `${count} ${count === 1 ? 'change' : 'changes'}` : `${sec.items.length} ${sec.items.length === 1 ? 'item' : 'items'}, no changes`}</span>
                <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size={16} style={{ color: 'var(--text-muted)' }} />
              </button>
              {isOpen && inPlace.map((it) => { const c = byKey.get(it.key); return c ? row(c) : <PlainRow key={it.key} it={it} />; })}
              {isOpen && landing.map(row)}
            </div>
          );
        })}
      </div>
    </Sheet>
  );
}
