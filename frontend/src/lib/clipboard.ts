/**
 * Copy text. The app runs over plain HTTP on the LAN, where navigator.clipboard is unavailable,
 * so fall back to a hidden textarea and document.execCommand('copy').
 * Resolves true when the copy worked.
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (window.isSecureContext && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch { /* fall through to the textarea route */ }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;pointer-events:none';
  document.body.appendChild(ta);
  const prevFocus = document.activeElement as HTMLElement | null;
  try {
    ta.focus();
    ta.select();
    ta.setSelectionRange(0, text.length); // iOS needs an explicit range
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    document.body.removeChild(ta);
    prevFocus?.focus?.();
  }
}
