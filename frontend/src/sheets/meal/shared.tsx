import { useRef } from 'react';
import { useWeekData } from '../../state/useWeekSlots';
import type { Slot } from '../../api/models';

/** The slot a sheet is about. Sheets stay mounted while closed, so keep the last one for the exit animation. */
export function useSlotFor(slotId: unknown): Slot | undefined {
  const { allSlots } = useWeekData();
  const last = useRef<number>();
  if (typeof slotId === 'number') last.current = slotId;
  return allSlots.find((s) => s.id === last.current);
}

export const caption = { font: 'var(--type-overline)', letterSpacing: 'var(--ls-overline)', textTransform: 'uppercase', color: 'var(--text-muted)' } as const;
