/**
 * A planned or suggested meal: photo, day tag, serif title, italic one-line description, method/time/cost, Healthy + Delicious scores, leftover plan.
 * @startingPoint section="Kitchen" subtitle="Meal suggestion card with scores and votes" viewport="700x520"
 */
export interface MealCardProps {
  title: string;
  /** One sentence, rendered in serif italic */
  description?: string;
  day?: 'week' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun' | 'spare';
  /** Sheet pan · Instant Pot · Le Creuset · Skillet */
  method?: string;
  /** e.g. "30 min" */
  time?: string;
  /** e.g. "~$22" */
  cost?: string;
  healthy?: number;
  delicious?: number;
  /** Family rating 1–5 */
  stars?: number;
  image?: string;
  /** Leftover plan, e.g. "Tue: taco-salad bowls" */
  leftovers?: React.ReactNode;
  onSale?: boolean;
  /** Who is cooking, e.g. "Leidy" */
  cook?: string;
  /** Slot for votes / actions */
  footer?: React.ReactNode;
  selected?: boolean;
  /** No photo header */
  compact?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}
export declare function MealCard(props: MealCardProps): JSX.Element;
