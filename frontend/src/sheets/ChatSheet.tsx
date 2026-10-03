import { Sheet } from '../components/feedback/Sheet';
import { Button } from '../components/core/Button';

/** Placeholder: the real Ask Café chat with proposal cards arrives in Phase 4. */
export function ChatSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Sheet open={open} onClose={onClose} title="Ask Café" subtitle="Café can swap meals, work around the fridge, or plan around a busy night. Nothing changes until you say so."
      footer={<Button variant="secondary" fullWidth onClick={onClose}>Close</Button>}>
      <p style={{ font: '400 14px/1.45 var(--font-sans)', color: 'var(--text-muted)' }}>Chat is coming in Phase 4.</p>
    </Sheet>
  );
}
