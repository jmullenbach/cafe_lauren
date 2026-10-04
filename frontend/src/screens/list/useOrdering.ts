import { openExternal } from '../../api/extra';
import { useGroceryList, useWeek } from '../../api/hooks';
import { useUi } from '../../state/UiContext';
import { copyText } from '../../lib/clipboard';
import { instacartText } from '../../lib/listText';

/** A universal link: the phone opens the Instacart app when it is installed, and the site otherwise. */
export const INSTACART_URL = 'https://www.instacart.com/store';

/**
 * "Send to Instacart": copies the unchecked items, then opens Instacart so they can be pasted to its assistant.
 * The copy has to come first, and nothing may be awaited from the network before it: once Instacart
 * has focus the page cannot write to the clipboard, and iOS blocks the open after a slow await.
 */
export function useSendToInstacart(monday: string | undefined) {
  const { toast } = useUi();
  const { data: list } = useGroceryList(monday);
  const { data: week } = useWeek(monday);
  const send = async () => {
    if (!list) return;
    if (!list.unchecked) {
      toast({ icon: 'check', title: 'Nothing left to order', message: 'Every item is checked off.' });
      return;
    }
    const ok = await copyText(instacartText(list, week?.store?.name));
    if (!ok) {
      toast({ tone: 'warning', icon: 'triangle-alert', title: 'Could not copy', message: 'Your browser blocked it, so Instacart was not opened.' });
      return;
    }
    toast({ tone: 'success', icon: 'shopping-cart', title: 'List copied', message: `Paste the ${list.unchecked} items into Instacart's assistant.` });
    openExternal(INSTACART_URL);
  };
  return { send, ready: !!list };
}

export const SECTION_ORDER = ['produce', 'frozen', 'meat', 'dry', 'dairy', 'beverages'] as const;
