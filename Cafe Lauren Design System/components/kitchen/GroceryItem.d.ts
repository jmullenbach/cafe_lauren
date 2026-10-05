/** One line on the grocery list: checkbox, **bold quantity** + item, which meal it's for, sale price. */
export interface GroceryItemProps {
  /** Bold quantity, e.g. "2 lbs" */
  qty?: string;
  name: string;
  /** Which meals it's for, e.g. "Pork chops + citrus chicken" */
  note?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  /** Sale price text; shows a terracotta tag, e.g. "$0.99/lb" */
  sale?: string;
  /** Recurring household staple */
  staple?: boolean;
  /** Who asked for it, e.g. "Joe" */
  from?: string;
  style?: React.CSSProperties;
}
export declare function GroceryItem(props: GroceryItemProps): JSX.Element;
