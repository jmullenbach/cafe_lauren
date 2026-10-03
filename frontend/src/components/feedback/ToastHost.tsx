import { useUi } from '../../state/UiContext';
import { Toast } from './Toast';

/**
 * Toasts sit near the bottom, clear of the header (Back is the next tap after most actions)
 * and of the bottom chrome. A toast with no action lets taps pass through to whatever is under it.
 */
export function ToastHost({ bottom }: { bottom: number }) {
  const { toastState } = useUi();
  if (!toastState) return null;
  const interactive = Boolean(toastState.action);
  return (
    <div style={{ position: 'absolute', left: 12, right: 12, bottom, zIndex: 120, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
      <Toast {...toastState} style={{ width: '100%', pointerEvents: interactive ? 'auto' : 'none' }} />
    </div>
  );
}
