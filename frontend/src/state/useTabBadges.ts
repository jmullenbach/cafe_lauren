import { useAppState } from '../api/hooks';

/**
 * Badge counts for the tab bar, keyed by tab id. Same rules as the prototype (ui_kits/mobile/Shell.jsx):
 * Plan = cook slots still suggested or thinking, Inbox = new requests + 1 if the pantry read is unconfirmed,
 * List = "!" when the list has changes to confirm.
 */
export function useTabBadges(): Record<string, number | string | null> {
  const { data } = useAppState();
  if (!data) return {};
  const pending = data.week.slots.filter((s) => s.kind === 'cook' && (s.status === 'suggested' || s.status === 'thinking')).length;
  const inbox = data.requests.new + (data.pantry.done ? 0 : 1);
  return {
    plan: pending || null,
    list: data.list.diff_count > 0 ? '!' : null,
    inbox: inbox || null,
  };
}
