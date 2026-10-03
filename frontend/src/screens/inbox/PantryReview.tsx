import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/screens-b.css';
import { Screen, BackHeader, SectionHead, BottomBar } from '../../components/layout/Layout';
import { Button } from '../../components/core/Button';
import { IconButton } from '../../components/core/IconButton';
import { Icon } from '../../components/core/Icon';
import { Badge } from '../../components/display/Badge';
import { Card } from '../../components/display/Card';
import { Input } from '../../components/forms/Input';
import { ChoiceChips } from '../../components/forms/ChoiceChips';
import { SuggestedTag } from '../../components/kitchen/SuggestedTag';
import { useAddPantryItem, useConfirmPantry, usePantry, usePatchPantryItem } from '../../api/hooks';
import { useUi } from '../../state/UiContext';
import { RECIPE_PHOTO_LABEL } from '../../sheets/recipes/AddRecipeSheet';
import type { PantryItem } from '../../api/models';

const PEOPLE = ['lauren', 'joe', 'leidy'];

function PantryRow({ p, last }: { p: PantryItem; last?: boolean }) {
  const patch = usePatchPantryItem();
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(p.name.replace(/\?$/, ''));
  const [qty, setQty] = useState(p.qty ?? '');
  const gone = p.state === 'removed';
  const byPerson = !!p.added_by && PEOPLE.includes(p.added_by);
  const border = last ? 0 : '1px solid var(--border-subtle)';
  if (edit) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 0', borderBottom: border }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <Input size="s" style={{ flex: 2, minWidth: 0 }} value={name} onChange={(e) => setName(e.target.value)} />
          <Input size="s" style={{ flex: 1, minWidth: 0 }} value={qty} onChange={(e) => setQty(e.target.value)} placeholder="Amount" />
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button size="s" variant="ghost" onClick={() => setEdit(false)}>Cancel</Button>
          <Button size="s" icon="check" disabled={!name.trim() || patch.isPending} onClick={() => patch.mutate({ id: p.id, name: name.trim(), qty: qty.trim() || null, state: 'confirmed' }, { onSuccess: () => setEdit(false) })}>Save</Button>
        </div>
      </div>
    );
  }
  return (
    <div data-testid="pantry-row" data-state={p.state} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', borderBottom: border, opacity: gone ? 0.5 : 1 }}>
      <div onClick={() => !gone && setEdit(true)} style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4, cursor: gone ? 'default' : 'pointer' }}>
        <span style={{ font: '500 15px/1.3 var(--font-sans)', color: 'var(--text-strong)', textDecoration: gone ? 'line-through' : 'none' }}>{p.name}{p.qty && <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}> · {p.qty}</span>}</span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          {p.state === 'unsure' && <Badge tone="warning">Not sure</Badge>}
          {(p.state === 'found' || p.state === 'unsure') && !byPerson && <SuggestedTag />}
          {p.state === 'confirmed' && <SuggestedTag status={byPerson ? 'edited' : 'kept'} label={byPerson ? 'Added by you' : 'Confirmed'} />}
          {p.note && (p.state === 'unsure' || p.state === 'found') && <span style={{ font: '400 12px/1.3 var(--font-sans)', color: 'var(--text-muted)' }}>{p.note}</span>}
        </div>
      </div>
      {gone ? <Button size="s" variant="ghost" onClick={() => patch.mutate({ id: p.id, state: 'found' })}>Undo</Button> : (
        <>
          <IconButton icon="x" label={`${p.name} is not there`} size="s" variant="secondary" round onClick={() => patch.mutate({ id: p.id, state: 'removed' })} />
          <IconButton icon="check" label={`Yes, we have ${p.name}`} size="s" variant={p.state === 'confirmed' ? 'accent' : 'secondary'} round onClick={() => patch.mutate({ id: p.id, state: 'confirmed' })} />
        </>
      )}
    </div>
  );
}

function AddPantryRow({ area }: { area: string }) {
  const add = useAddPantryItem();
  const [open, setOpen] = useState(false);
  const [n, setN] = useState('');
  const [q, setQ] = useState('');
  const submit = () => { if (!n.trim()) return; add.mutate({ area, name: n.trim(), qty: q.trim() || null }, { onSuccess: () => { setN(''); setQ(''); setOpen(false); } }); };
  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', minHeight: 48, padding: 0, border: 0, borderTop: '1px solid var(--border-subtle)', background: 'none', cursor: 'pointer', color: 'var(--sage-700)', font: '600 14px/1 var(--font-sans)' }}>
        <Icon name="plus" size={18} />Add to {area.toLowerCase()}
      </button>
    );
  }
  return (
    <form onSubmit={(e) => { e.preventDefault(); submit(); }} style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 0', borderTop: '1px solid var(--border-subtle)' }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <Input size="s" style={{ flex: 2, minWidth: 0 }} value={n} onChange={(e) => setN(e.target.value)} placeholder="What is it?" />
        <Input size="s" style={{ flex: 1, minWidth: 0 }} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Amount" />
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Button size="s" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
        <Button size="s" type="submit" icon="plus" disabled={!n.trim() || add.isPending}>Add</Button>
      </div>
    </form>
  );
}

export function PantryReview() {
  const nav = useNavigate();
  const { toast } = useUi();
  const { data: pantry } = usePantry();
  const confirm = useConfirmPantry();
  const add = useAddPantryItem();
  const [n, setN] = useState('');
  const [area, setArea] = useState('Pantry');
  const items = pantry?.items ?? [];
  const areas = [...new Set([...(pantry?.areas ?? []), ...items.map((i) => i.area)])].filter((a) => items.some((i) => i.area === a));
  const keep = items.filter((i) => i.state !== 'removed').length;
  const unsure = items.filter((i) => i.state === 'unsure').length;
  const photos = (pantry?.photos ?? []).filter((p) => p.label !== RECIPE_PHOTO_LABEL).length;
  const chipAreas = ['Pantry', 'Fridge', 'Freezer', 'Counter'];
  const back = () => nav('/inbox?seg=pantry');
  const doConfirm = () => confirm.mutate(undefined, {
    onSuccess: () => { toast({ tone: 'success', icon: 'refrigerator', title: 'Pantry confirmed', message: "We won't buy what you already have." }); back(); },
    onError: (e) => toast({ tone: 'danger', icon: 'triangle-alert', title: 'Could not confirm', message: (e as Error).message }),
  });
  return (
    <>
      <Screen bottom={120}>
        <BackHeader title="What's on hand" onBack={back} />
        <p style={{ font: '400 14px/1.5 var(--font-sans)', color: 'var(--text-body)', margin: '8px 0 4px' }}>Café read {photos} photo{photos === 1 ? '' : 's'}. Tap anything to fix it, or mark what isn't really there.{unsure ? ` Check the ${unsure} it wasn't sure about before you confirm.` : ''}</p>
        {areas.map((ar) => {
          const list = items.filter((i) => i.area === ar);
          return (
            <div key={ar}>
              <SectionHead title={ar} aside={`${list.length} items`} />
              <Card padding="none" style={{ padding: '0 14px' }}>
                {list.map((p) => <PantryRow key={`${p.id}-${p.state}-${p.name}-${p.qty}`} p={p} />)}
                <AddPantryRow area={ar} />
              </Card>
            </div>
          );
        })}
        {!items.length && <p style={{ padding: '24px 0', font: '400 14px/1.5 var(--font-sans)', color: 'var(--text-muted)' }}>Nothing read yet. Add photos on the Pantry tab, then ask Café to read them.</p>}
        <SectionHead title="Anything it missed?" />
        <form onSubmit={(e) => { e.preventDefault(); if (n.trim()) add.mutate({ area, name: n.trim() }, { onSuccess: () => setN('') }); }} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <ChoiceChips size="s" multi={false} value={area} onChange={(v) => v && setArea(v)} options={chipAreas} />
          <div style={{ display: 'flex', gap: 8 }}>
            <Input style={{ flex: 1, minWidth: 0 }} value={n} onChange={(e) => setN(e.target.value)} placeholder="Half a bag of rice" />
            <Button type="submit" variant="secondary" icon="plus" disabled={!n.trim() || add.isPending}>Add</Button>
          </div>
        </form>
      </Screen>
      <BottomBar>
        <Button size="l" variant="accent" fullWidth icon="check" disabled={!keep || unsure > 0 || confirm.isPending} onClick={doConfirm}>
          {unsure ? `Check ${unsure} unsure item${unsure > 1 ? 's' : ''} first` : `Confirm ${keep} items`}
        </Button>
      </BottomBar>
    </>
  );
}
