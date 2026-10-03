import { useUi } from '../state/UiContext';
import { ChatSheet } from './ChatSheet';

/**
 * Renders whichever sheet is open. Add each Phase 4 sheet here, keyed by `type`
 * (swap, reject, edit, add, schedule, store, send...). Sheets stay mounted while they animate out,
 * so pass `open` rather than conditionally rendering.
 */
export function SheetHost() {
  const { sheet, closeSheet } = useUi();
  return <ChatSheet open={sheet?.type === 'chat'} onClose={closeSheet} />;
}
