import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { ToastProps } from '../components/feedback/Toast';

/** Describes an open sheet. `type` selects the sheet in sheets/SheetHost.tsx; other keys are its props. */
export interface SheetState { type: string; [key: string]: unknown }
export type ToastState = Omit<ToastProps, 'onClose' | 'onAction' | 'style'>;

interface UiCtx {
  sheet: SheetState | null;
  openSheet: (s: SheetState) => void;
  closeSheet: () => void;
  toastState: ToastState | null;
  /** Show a snackbar for 3 seconds. */
  toast: (t: ToastState) => void;
}
const Ctx = createContext<UiCtx | null>(null);

export function UiProvider({ children }: { children: ReactNode }) {
  const [sheet, setSheet] = useState<SheetState | null>(null);
  const [toastState, setToastState] = useState<ToastState | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const toast = useCallback((t: ToastState) => {
    setToastState(t);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToastState(null), 3000);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);
  const value = useMemo<UiCtx>(() => ({ sheet, openSheet: setSheet, closeSheet: () => setSheet(null), toastState, toast }), [sheet, toastState, toast]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useUi(): UiCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('useUi must be used inside <UiProvider>');
  return v;
}
