import { Sheet } from '../../components/feedback/Sheet';
import { Card } from '../../components/display/Card';
import { ChoiceChips } from '../../components/forms/ChoiceChips';
import { ListRow } from '../../components/layout/Layout';
import { useMoveSlot, useSetSlotCook, useSwapSlot } from '../../api/hooks';
import { useUi } from '../../state/UiContext';
import { useNavigate } from 'react-router-dom';
import { DAYNAME, DAYS, mealRoute, slotTitle } from '../../lib/meal';
import { useSlotFor } from './shared';

const COOKS = [{ value: 'lauren', label: 'Lauren' }, { value: 'joe', label: 'Joe' }, { value: 'leidy', label: 'Leidy' }];
const label = { display: 'block', font: '600 13px/1 var(--font-sans)', color: 'var(--text-strong)', marginBottom: 10 } as const;

/** "Change {day}": move, who cooks, edit, leftovers, take off the plan. */
export function EditSheet({ open, slotId }: { open: boolean; slotId?: unknown }) {
  const { closeSheet, openSheet, toast } = useUi();
  const nav = useNavigate();
  const slot = useSlotFor(slotId);
  const move = useMoveSlot();
  const setCook = useSetSlotCook();
  const swap = useSwapSlot();
  if (!slot) return <Sheet open={false} />;
  const cook = (slot.cook ?? (slot.kind === 'leidy' ? 'leidy' : 'lauren')).toLowerCase();
  return (
    <Sheet open={open} onClose={closeSheet} title={`Change ${DAYNAME[slot.day]}`} subtitle={slotTitle(slot)}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div><span style={label}>Move to another day</span>
          <ChoiceChips size="s" multi={false} value={slot.day} onChange={(to) => { if (to && to !== slot.day) move.mutate({ id: slot.id, to }, { onSuccess: () => { closeSheet(); toast({ icon: 'calendar-days', title: 'Moved', message: 'Swapped with ' + String(to).toUpperCase() }); } }); }}
            options={DAYS.map((d) => ({ value: d, label: DAYNAME[d].slice(0, 3) }))} /></div>
        {slot.kind === 'cook' && <div><span style={label}>Who's cooking</span>
          <ChoiceChips size="s" multi={false} value={cook} onChange={(w) => w && setCook.mutate({ id: slot.id, cook: w })} options={COOKS} /></div>}
        <Card padding="none" style={{ padding: '0 14px' }}>
          <ListRow icon="refresh-cw" title="Swap for a different meal" onClick={() => openSheet({ type: 'swap', slotId: slot.id })} />
          {slot.recipe_id != null && <ListRow icon="pencil" title="Edit ingredients or servings" onClick={() => { closeSheet(); nav(mealRoute(slot) + '&edit=1'); }} />}
          <ListRow icon="refresh-cw" title="Make it a leftovers night" last={slot.recipe_id == null} onClick={() => swap.mutate({ id: slot.id, kind: 'leftover', text: 'Leftovers night' }, { onSuccess: closeSheet })} />
          {slot.recipe_id != null && <ListRow icon="x" iconColor="var(--terra-500)" title="Take it off the plan" sub="Tell Café why" onClick={() => openSheet({ type: 'reject', slotId: slot.id })} last />}
        </Card>
      </div>
    </Sheet>
  );
}
