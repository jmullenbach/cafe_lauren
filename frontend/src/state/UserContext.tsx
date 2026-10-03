import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { PEOPLE, USER_KEY, readUser, writeStore } from '../lib/storage';
import type { PersonKey } from '../lib/storage';
import { queryClient } from '../api/queryClient';

interface UserCtx {
  user: PersonKey | null;
  person: (typeof PEOPLE)[number] | null;
  setUser: (k: PersonKey) => void;
  /** Forget who is using the phone, so the picker shows again. */
  clearUser: () => void;
}
const Ctx = createContext<UserCtx | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<PersonKey | null>(() => readUser());
  const setUser = useCallback((k: PersonKey) => { writeStore(USER_KEY, k); setUserState(k); queryClient.invalidateQueries(); }, []);
  const clearUser = useCallback(() => { writeStore(USER_KEY, null); setUserState(null); }, []);
  const value = useMemo<UserCtx>(() => ({ user, person: PEOPLE.find((p) => p.key === user) ?? null, setUser, clearUser }), [user, setUser, clearUser]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useUser(): UserCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('useUser must be used inside <UserProvider>');
  return v;
}
