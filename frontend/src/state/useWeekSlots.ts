import { useAppState, useWeek } from '../api/hooks';
import { useCurrentMonday } from './useCurrentMonday';
import type { Person, Slot } from '../api/models';

/** The current week, its slots, who I am and the household. Week comes from /api/weeks/{monday}, state is the fallback while loading. */
export function useWeekData() {
  const monday = useCurrentMonday();
  const state = useAppState();
  const wk = useWeek(monday);
  const week = wk.data ?? state.data?.week;
  const people = state.data?.people ?? [];
  const personOf = (key?: string | null): Person | undefined => people.find((p) => p.key === key);
  const nameOf = (key?: string | null) => (key ? personOf(key)?.name ?? key : undefined);
  const slots: Slot[] = week?.slots ?? [];
  return { week, slots, monday, state: state.data, me: state.data?.me, people, personOf, nameOf, loading: !week };
}
