import { useRef } from 'react';
import { Sheet } from '../../components/feedback/Sheet';
import { Card } from '../../components/display/Card';
import { ListRow } from '../../components/layout/Layout';
import { useRecipe, useSwapSlot } from '../../api/hooks';
import { useUi } from '../../state/UiContext';
import { useWeekData } from '../../state/useWeekSlots';
import { DAYNAME, slotTitle } from '../../lib/meal';

/** "Put on a night": pick a day for a recipe from the box or Up next. Opened with { type: 'schedule', recipeId }. */
export function ScheduleSheet({ open, recipeId }: { open: boolean; recipeId?: unknown }) {
  const { closeSheet, toast } = useUi();
  const { slots } = useWeekData();
  const last = useRef<number>();
  if (typeof recipeId === 'number') last.current = recipeId;
  const id = last.current;
  const { data: m } = useRecipe(id);
  const swap = useSwapSlot();
  if (!m) return <Sheet open={false} />;
  return (
    <Sheet open={open} onClose={closeSheet} title="Put on a night" subtitle={m.title + " replaces what's planned. Votes reset for that night."}>
      <Card padding="none" style={{ padding: '0 14px' }}>
        {slots.map((s, i) => (
          <ListRow key={s.id} title={DAYNAME[s.day]} sub={slotTitle(s)} last={i === slots.length - 1}
            onClick={() => swap.mutate({ id: s.id, kind: 'recipe', recipe_id: m.id, basis: 'Picked from the recipe box' }, { onSuccess: () => { closeSheet(); toast({ icon: 'refresh-cw', title: 'Swapped', message: 'Votes reset so everyone can weigh in.' }); } })} />
        ))}
      </Card>
    </Sheet>
  );
}
