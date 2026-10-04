import type { GroceryList } from '../api/models';

/** Plain-text list for Google Keep, Notes or a text message: unchecked items only, ☐ per line. */
export function listText(list: GroceryList, storeName?: string): string {
  const lines = [`Grocery list${storeName ? ' — ' + storeName : ''}`, ''];
  for (const sec of list.sections) {
    const items = sec.items.filter((i) => !i.checked);
    if (!items.length) continue;
    lines.push(sec.name);
    for (const i of items) lines.push('☐ ' + [i.qty, i.name].filter(Boolean).join(' ') + (i.note ? ' — ' + i.note : ''));
    lines.push('');
  }
  return lines.join('\n').trim();
}

/** The unchecked items as a request to paste into Instacart's assistant: one plain line per item, no aisle headings. */
export function instacartText(list: GroceryList, storeName?: string): string {
  const items = list.sections.flatMap((s) => s.items).filter((i) => !i.checked);
  const lines = items.map((i) => '- ' + [i.qty, i.name].filter(Boolean).join(' ') + (i.note ? ` (${i.note})` : ''));
  return [`Please add these to my cart${storeName ? ' from ' + storeName : ''}:`, ...lines].join('\n');
}

export function itemNote(i: { note?: string | null; sources?: Array<{ title: string }> }): string | undefined {
  if (i.note) return i.note;
  const t = [...new Set((i.sources ?? []).map((s) => s.title))];
  return t.length ? t.join(' + ') : undefined;
}

/** "Aug 13" style date from YYYY-MM-DD, or ISO timestamp -> relative text for requests. */
export function shortDate(d?: string | null): string {
  if (!d) return 'never';
  const x = new Date(d.length === 10 ? d + 'T12:00:00' : d);
  return x.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
export function ago(iso: string): string {
  const t = new Date(iso.endsWith('Z') || /[+-]\d\d:?\d\d$/.test(iso) ? iso : iso + 'Z').getTime();
  const m = Math.round((Date.now() - t) / 60000);
  if (!isFinite(m) || m < 1) return 'Now';
  if (m < 60) return `${m}m ago`;
  if (m < 60 * 24) return `${Math.round(m / 60)}h ago`;
  return shortDate(iso);
}

/** "Oct 3–9" when both dates share a month, "Sep 30–Oct 6" otherwise. */
export function dateRange(a?: string | null, b?: string | null): string {
  if (!a || !b) return 'this week';
  const x = new Date(a + 'T12:00:00'), y = new Date(b + 'T12:00:00');
  const m = (d: Date) => d.toLocaleDateString('en-US', { month: 'short' });
  return x.getMonth() === y.getMonth() ? `${shortDate(a)}–${y.getDate()}` : `${shortDate(a)}–${m(y)} ${y.getDate()}`;
}
