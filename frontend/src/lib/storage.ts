/** localStorage wrapped in try/catch: private windows, blocked storage and previews can throw. */
export function readStore(key: string): string | null {
  try { return window.localStorage.getItem(key); } catch { return null; }
}
export function writeStore(key: string, value: string | null): void {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch { /* storage unavailable: the app still works for this session */ }
}

export const USER_KEY = 'cafe.user';
export type PersonKey = 'lauren' | 'joe' | 'leidy';
export const PEOPLE: Array<{ key: PersonKey; name: string; color: 'sage' | 'terra' | 'honey' | 'oak' | 'slate' }> = [
  { key: 'lauren', name: 'Lauren', color: 'sage' },
  { key: 'joe', name: 'Joe', color: 'slate' },
  { key: 'leidy', name: 'Leidy', color: 'terra' },
];
export function readUser(): PersonKey | null {
  const v = readStore(USER_KEY);
  return PEOPLE.some((p) => p.key === v) ? (v as PersonKey) : null;
}
