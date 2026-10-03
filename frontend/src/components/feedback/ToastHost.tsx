import { useUi } from '../../state/UiContext';
import { Toast } from './Toast';

export function ToastHost() {
  const { toastState } = useUi();
  if (!toastState) return null;
  return (
    <div style={{ position: 'absolute', left: 12, right: 12, top: 56, zIndex: 120, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
      <Toast {...toastState} style={{ width: '100%' }} />
    </div>
  );
}
