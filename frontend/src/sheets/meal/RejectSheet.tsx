import { useEffect, useState } from 'react';
import { Sheet } from '../../components/feedback/Sheet';
import { Button } from '../../components/core/Button';
import { ChoiceChips } from '../../components/forms/ChoiceChips';
import { Input } from '../../components/forms/Input';
import { Switch } from '../../components/forms/Switch';
import { useRejectSlot } from '../../api/hooks';
import { useJobPoll } from '../../api/extra';
import { useUi } from '../../state/UiContext';
import { REJECT_REASONS } from '../../lib/meal';
import { useSlotFor } from './shared';

export function RejectSheet({ open, slotId }: { open: boolean; slotId?: unknown }) {
  const { closeSheet, toast } = useUi();
  const slot = useSlotFor(slotId);
  const reject = useRejectSlot();
  const [why, setWhy] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [remember, setRemember] = useState(true);
  // The sheet stays mounted after it closes, so it keeps polling the replacement job (a backstop to the stream).
  const [jobId, setJobId] = useState<number | null>(null);
  useJobPoll(jobId);
  useEffect(() => { if (open) { setWhy([]); setNote(''); } }, [open, slotId]);
  const m = slot?.recipe;
  const go = (mode: 'open' | 'another') => {
    if (!slot) return;
    const basis = [...why, note.trim()].filter(Boolean).join(' · ');
    reject.mutate({ id: slot.id, reasons: why, note: note.trim() || null, remember, mode }, {
      onSuccess: (r) => {
        setJobId(r.job?.id ?? null);
        closeSheet();
        if (mode === 'open') toast({ icon: 'x', title: 'Night left open', message: 'Café will remember: ' + (basis || 'no reason given') });
      },
    });
  };
  return (
    <Sheet open={open} onClose={closeSheet} title={m ? `Not ${m.title.split(' with ')[0]}?` : 'Not this?'} subtitle="Tell Café why. It's fine to skip this, but a reason makes the next idea better."
      footer={<><Button variant="secondary" style={{ flex: 1 }} disabled={reject.isPending} onClick={() => go('open')}>Leave night open</Button><Button icon="sparkles" style={{ flex: 1.2 }} disabled={reject.isPending} onClick={() => go('another')}>Suggest another</Button></>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <ChoiceChips value={why} onChange={setWhy} options={REJECT_REASONS} />
        <Input multiline rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Anything else? “We had pork twice already”" />
        <Switch checked={remember} onChange={setRemember} label="Remember this" description="Café will weigh it in future weeks. You can see and clear these in settings." />
      </div>
    </Sheet>
  );
}
