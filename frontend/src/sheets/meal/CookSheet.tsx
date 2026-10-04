import { Sheet } from '../../components/feedback/Sheet';
import { Avatar } from '../../components/display/Avatar';
import { Icon } from '../../components/core/Icon';
import type { PersonColor } from '../../components/types';
import { COOK_TONE } from '../../components/kitchen/CookChip';
import { useSetSlotCook } from '../../api/hooks';
import { useUi } from '../../state/UiContext';
import { useWeekData } from '../../state/useWeekSlots';
import { DAYNAME } from '../../lib/meal';
import { useSlotFor } from './shared';

const row = (on: boolean, accent?: string) => ({
  display: 'flex', alignItems: 'center', gap: 14, width: '100%', minHeight: 60, padding: '0 16px', borderRadius: 'var(--radius-m)', cursor: 'pointer', textAlign: 'left',
  border: `1px solid ${on ? accent ?? 'var(--char-900)' : 'var(--border-default)'}`, background: on ? 'var(--surface-raised)' : 'var(--surface-card)',
  boxShadow: on ? `0 0 0 1px ${accent ?? 'var(--char-900)'}` : 'none', font: '500 16px/1.2 var(--font-sans)', color: 'var(--text-strong)',
} as const);

/** "Who's cooking Wednesday?": anyone can set anyone. Opened with { type: 'cook', slotId }. */
export function CookSheet({ open, slotId }: { open: boolean; slotId?: unknown }) {
  const { closeSheet, toast } = useUi();
  const slot = useSlotFor(slotId);
  const { people } = useWeekData();
  const setCook = useSetSlotCook();
  if (!slot) return <Sheet open={false} />;
  const pick = (cook: string | null) => setCook.mutate({ id: slot.id, cook }, {
    onSuccess: () => { closeSheet(); const n = people.find((p) => p.key === cook)?.name; toast({ tone: 'success', icon: 'chef-hat', title: n ? `${n} is cooking ${DAYNAME[slot.day]}` : 'Cook not decided', message: n ? undefined : `${DAYNAME[slot.day]} has no cook yet.` }); },
    onError: (e) => toast({ tone: 'danger', icon: 'triangle-alert', title: 'Could not save', message: (e as Error).message }),
  });
  return (
    <Sheet open={open} onClose={closeSheet} title={`Who's cooking ${DAYNAME[slot.day]}?`} subtitle="Anyone can set anyone. This night only; the recipe's usual cook is set in the recipe box.">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {people.map((p) => {
          const on = slot.cook === p.key;
          return (
            <button key={p.key} type="button" data-testid={`cook-option-${p.key}`} aria-pressed={on} disabled={setCook.isPending} onClick={() => pick(p.key)} className="cl-focus" style={row(on, COOK_TONE[p.color as PersonColor]?.edge)}>
              <Avatar name={p.name} color={p.color as PersonColor} size={36} />
              <span style={{ flex: 1 }}>{p.name}</span>
              {on && <Icon name="check" size={20} stroke={2.25} style={{ color: COOK_TONE[p.color as PersonColor]?.ink }} />}
            </button>
          );
        })}
        <button type="button" data-testid="cook-option-none" aria-pressed={!slot.cook} disabled={setCook.isPending} onClick={() => pick(null)} className="cl-focus" style={{ ...row(!slot.cook), color: 'var(--text-muted)', borderStyle: 'dashed' }}>
          <span style={{ width: 36, height: 36, borderRadius: 999, border: '1.5px dashed var(--char-300)', flex: 'none' }} />
          <span style={{ flex: 1 }}>Not decided</span>
          {!slot.cook && <Icon name="check" size={20} stroke={2.25} />}
        </button>
      </div>
    </Sheet>
  );
}
