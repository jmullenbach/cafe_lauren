import { useUi } from '../state/UiContext';
import { ChatSheet } from './chat/ChatSheet';
import { SwapSheet } from './meal/SwapSheet';
import { RejectSheet } from './meal/RejectSheet';
import { EditSheet } from './meal/EditSheet';
import { CookSheet } from './meal/CookSheet';
import { ScheduleSheet } from './meal/ScheduleSheet';
import { AddRecipeSheet } from './recipes/AddRecipeSheet';
import { StoreSheet } from './list/StoreSheet';
import { SendSheet } from './list/SendSheet';

/**
 * Renders whichever sheet is open. Add each Phase 4 sheet here, keyed by `type`
 * (swap, reject, edit, add, schedule, store, send...). Sheets stay mounted while they animate out,
 * so pass `open` rather than conditionally rendering.
 */
export function SheetHost() {
  const { sheet, closeSheet } = useUi();
  return (<>
    <ChatSheet open={sheet?.type === 'chat'} onClose={closeSheet} />
    <SwapSheet open={sheet?.type === 'swap'} slotId={sheet?.slotId} />
    <RejectSheet open={sheet?.type === 'reject'} slotId={sheet?.slotId} />
    <EditSheet open={sheet?.type === 'edit'} slotId={sheet?.slotId} />
    <AddRecipeSheet open={sheet?.type === 'add-recipe' || sheet?.type === 'add'} onClose={closeSheet} />
    <StoreSheet open={sheet?.type === 'store'} onClose={closeSheet} />
    <SendSheet open={sheet?.type === 'send'} onClose={closeSheet} />
    <CookSheet open={sheet?.type === 'cook'} slotId={sheet?.slotId} />
    <ScheduleSheet open={sheet?.type === 'schedule'} recipeId={sheet?.recipeId} />
  </>);
}
