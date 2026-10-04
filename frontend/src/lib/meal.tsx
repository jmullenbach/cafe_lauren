import type { ReactNode } from 'react';
import type { Recipe, RecipeSummary, Slot } from '../api/models';
import type { DayKey } from '../components/types';

export const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
export const DAYNAME: Record<string, string> = { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday', extra: 'Lunches & breakfast' };
/** The week's catch-all slot (not a night), and the tag on the recipes meant for it. */
export const EXTRA = 'extra';
export const STAPLES_TAG = 'Staples';
export const REJECT_REASONS = ['Too much work', 'Had it recently', "Kids won't eat it", 'Too pricey', 'Not in the mood', 'Missing equipment'];
export const SWAP_PREFS = ['Weekly specials', 'Quicker', 'Lighter', 'Kid-friendly', 'Use what we have', 'Cheaper', 'Different protein'];
export const CHAT_STARTERS = ['Make Thursday vegetarian', 'We have leftover rice', 'Something cheaper than shrimp', 'What can Leidy make?'];

export const dayKey = (d: string) => d as DayKey;

type R = Pick<RecipeSummary, 'total_min' | 'cost_usd' | 'method'>;
export const timeStr = (r: R) => (r.total_min ? `${r.total_min} min` : '');
export const costStr = (r: R) => (r.cost_usd != null ? `~$${Math.round(r.cost_usd)}` : '');
export const metaLine = (r: R) => [r.method, timeStr(r), costStr(r)].filter(Boolean).join(' · ');

/** Tags starting with `notion:` are internal bookkeeping and never shown. */
export const publicTags = (tags?: string[]) => (tags ?? []).filter((t) => !t.startsWith('notion:'));

export function slotTitle(s: Slot): string {
  if (s.kind === 'cook' && s.recipe) return s.recipe.title;
  if (s.text) return s.text;
  if (s.recipe) return s.recipe.title;
  if (s.kind === 'open') return 'Open night';
  if (s.kind === 'leidy') return 'Leidy cooks';
  return '';
}
export const hasSale = (s: Slot) => (s.ingredients ?? []).some((i) => i.tag === 'sale');
export const mealRoute = (s: Pick<Slot, 'recipe_id' | 'day'>) => `/meal/${s.recipe_id}?day=${s.day}`;

/** Renders **bold** markdown inline as <strong>. */
export function Md({ text }: { text: string }): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return <>{parts.map((p, i) => (p.startsWith('**') && p.endsWith('**') ? <strong key={i} style={{ fontWeight: 650 }}>{p.slice(2, -2)}</strong> : <span key={i}>{p}</span>))}</>;
}

/** "15 min" style timer hint from a step's text. */
export function stepTimer(text: string): string | null {
  const m = text.match(/(\d+)(?:\s*[-–]\s*(\d+))?\s*(min(?:ute)?s?|hours?|hrs?)\b/i);
  if (!m) return null;
  const unit = /^h/i.test(m[3]) ? 'hr' : 'min';
  return `${m[1]}${m[2] ? '–' + m[2] : ''} ${unit}`;
}

export const recipeOf = (s: Slot): Recipe | null | undefined => s.recipe;

export function shortDate(iso?: string | null): string {
  if (!iso) return 'never';
  const d = new Date(iso.length <= 10 ? iso + 'T12:00:00' : iso);
  return isNaN(+d) ? 'never' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
