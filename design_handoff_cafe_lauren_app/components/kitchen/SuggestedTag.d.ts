/** Provenance + review status for anything the AI produced. Every AI output starts "suggested" (dashed) until a person keeps, edits, approves or rejects it. */
export interface SuggestedTagProps {
  status?: 'suggested' | 'edited' | 'kept' | 'approved' | 'rejected' | 'thinking' | 'draft';
  /** Who acted, e.g. "Lauren" → "Kept by Lauren". For suggested: "Café". */
  by?: string;
  /** Override text */
  label?: string;
  style?: React.CSSProperties;
}
export declare function SuggestedTag(props: SuggestedTagProps): JSX.Element;
