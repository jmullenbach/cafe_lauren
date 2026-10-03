import { useState } from 'react';
import { createInstacartLink, isInstacartNotConfigured, openExternal } from '../../api/extra';
import { useUi } from '../../state/UiContext';

/** "Open in Instacart": creates (or reuses) the link, opens it, and remembers when Instacart is not set up. */
export function useOpenInstacart(monday: string | undefined) {
  const { toast } = useUi();
  const [busy, setBusy] = useState(false);
  const [notSetUp, setNotSetUp] = useState(false);
  const open = async () => {
    if (!monday || busy) return;
    setBusy(true);
    try {
      const r = await createInstacartLink(monday);
      setNotSetUp(false);
      openExternal(r.url);
      toast({ tone: 'success', icon: 'shopping-cart', title: 'Opening Instacart', message: `${r.item_count} items matched on their side.` });
    } catch (e) {
      if (isInstacartNotConfigured(e)) setNotSetUp(true);
      else toast({ tone: 'danger', icon: 'triangle-alert', title: 'Instacart did not answer', message: (e as Error).message });
    } finally {
      setBusy(false);
    }
  };
  return { open, busy, notSetUp };
}

export const SECTION_ORDER = ['produce', 'frozen', 'meat', 'dry', 'dairy', 'beverages'] as const;
