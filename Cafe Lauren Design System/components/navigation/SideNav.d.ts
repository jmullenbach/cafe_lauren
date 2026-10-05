/** App sidebar on the linen "sunken" surface. Items can include section headers. */
export interface SideNavItem { id?: string; label?: string; icon?: string; badge?: number | string; badgeTone?: 'accent' | 'sale'; section?: string }
export interface SideNavProps {
  items: SideNavItem[];
  value?: string;
  onChange?: (id: string) => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function SideNav(props: SideNavProps): JSX.Element;
