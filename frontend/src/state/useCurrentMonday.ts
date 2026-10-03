import { useAppState } from '../api/hooks';

/** The Monday (YYYY-MM-DD) of the week the app is showing, from GET /api/state. Undefined while loading. */
export function useCurrentMonday(): string | undefined {
  return useAppState().data?.week.monday;
}
