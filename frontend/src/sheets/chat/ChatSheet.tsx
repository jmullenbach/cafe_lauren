import { useEffect, useRef, useState } from 'react';
import { Sheet } from '../../components/feedback/Sheet';
import { Button } from '../../components/core/Button';
import { IconButton } from '../../components/core/IconButton';
import { Icon } from '../../components/core/Icon';
import { ChoiceChips } from '../../components/forms/ChoiceChips';
import { Input } from '../../components/forms/Input';
import { SuggestedTag } from '../../components/kitchen/SuggestedTag';
import { JobState } from '../../components/feedback/JobState';
import { useChat, useResolveProposal, useSendChat } from '../../api/hooks';
import { useJobStatus } from '../../api/jobs';
import type { ChatProposal } from '../../api/models';
import { useUi } from '../../state/UiContext';
import { useWeekData } from '../../state/useWeekSlots';
import { CHAT_STARTERS } from '../../lib/meal';
import '../../styles/screens-a.css';

function Proposal({ p, busy, onApply, onDismiss }: { p: ChatProposal; busy: boolean; onApply: () => void; onDismiss: () => void }) {
  return (
    <div data-testid="proposal" data-state={p.state} style={{ marginTop: 10, padding: 12, borderRadius: 'var(--radius-m)', background: 'var(--surface-card)', border: p.state === 'pending' ? '1px dashed var(--sage-300)' : '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ font: '600 14px/1.3 var(--font-sans)', color: 'var(--text-strong)' }}>{p.label}</span>
      {p.detail && <span style={{ font: '400 13px/1.4 var(--font-sans)', color: 'var(--text-muted)' }}>{p.detail}</span>}
      {p.state === 'pending'
        ? <div style={{ display: 'flex', gap: 8 }}><Button size="s" variant="secondary" style={{ flex: 1 }} disabled={busy} onClick={onDismiss}>Not that</Button><Button size="s" variant="accent" icon="check" style={{ flex: 1 }} disabled={busy} onClick={onApply}>Apply</Button></div>
        : <SuggestedTag status={p.state === 'applied' ? 'kept' : 'rejected'} label={p.state === 'applied' ? 'Applied to the plan' : 'Dismissed'} style={{ alignSelf: 'flex-start' }} />}
    </div>
  );
}

/** Ask Café. Chat never edits the plan: Café's replies carry proposals the person applies or dismisses. */
export function ChatSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { monday, me } = useWeekData();
  const { toast } = useUi();
  const { data: msgs = [] } = useChat(monday);
  const send = useSendChat();
  const resolve = useResolveProposal();
  const [text, setText] = useState('');
  const [jobId, setJobId] = useState<number | null>(null);
  const [pendingText, setPendingText] = useState<string | null>(null);
  const baseline = useRef(0);
  const job = useJobStatus(jobId);
  const end = useRef<HTMLDivElement>(null);
  const waiting = jobId != null && job != null && (job.status === 'queued' || job.status === 'running');
  useEffect(() => { end.current?.scrollIntoView?.({ block: 'end' }); }, [msgs.length, open, waiting, pendingText]);
  useEffect(() => { if (job?.status === 'done' || job?.status === 'failed') setPendingText(null); }, [job?.status]);

  const go = (t: string) => {
    const v = t.trim();
    if (!v || send.isPending) return;
    setText('');
    setPendingText(v);
    baseline.current = msgs.length;
    send.mutate({ text: v }, { onSuccess: (r) => setJobId(r.job.id), onError: () => setPendingText(null) });
  };
  const asked = msgs.filter((m) => m.from === 'me').map((m) => m.text);
  const apply = (id: number, action: 'apply' | 'dismiss', label: string) =>
    resolve.mutate({ messageId: id, action }, { onSuccess: () => { if (action === 'apply') toast({ tone: 'success', icon: 'check', title: 'Plan updated', message: label }); } });
  // Café has not answered yet: still no reply after the message that was just sent.
  const typing = (waiting || send.isPending) && msgs.length <= baseline.current + 1;

  return (
    <Sheet open={open} onClose={onClose} maxHeight="90%" title={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Icon name="sparkles" size={20} style={{ color: 'var(--sage-600)' }} />Ask Café</span>}
      footer={<form onSubmit={(e) => { e.preventDefault(); go(text); }} style={{ display: 'flex', gap: 8, width: '100%' }}><Input style={{ flex: 1, minWidth: 0 }} value={text} onChange={(e) => setText(e.target.value)} placeholder="Swap Friday for something cheaper…" /><IconButton icon="send" label="Send" variant="primary" onClick={() => go(text)} /></form>}>
      <div data-testid="chat-log" style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 300 }}>
        <div style={{ alignSelf: 'flex-start', maxWidth: '92%', padding: '10px 14px', borderRadius: '16px 16px 16px 4px', background: 'var(--surface-sunken)', color: 'var(--text-strong)', font: '400 14px/1.5 var(--font-sans)' }}>
          Hi {me?.name ?? 'there'}. I can swap meals, work around what's in the fridge, or plan around a busy night. Nothing changes until you say so.
        </div>
        {msgs.map((m) => m.from === 'me'
          ? <div key={m.id} style={{ alignSelf: 'flex-end', maxWidth: '82%', padding: '10px 14px', borderRadius: '16px 16px 4px 16px', background: 'var(--char-900)', color: 'var(--linen-50)', font: '400 14px/1.45 var(--font-sans)' }}>{m.text}</div>
          : <div key={m.id} style={{ alignSelf: 'flex-start', maxWidth: '92%' }}>
              <div style={{ padding: '10px 14px', borderRadius: '16px 16px 16px 4px', background: 'var(--surface-sunken)', color: 'var(--text-strong)', font: '400 14px/1.5 var(--font-sans)' }}>{m.text}</div>
              {m.proposal && <Proposal p={m.proposal} busy={resolve.isPending} onApply={() => apply(m.id, 'apply', m.proposal!.label)} onDismiss={() => apply(m.id, 'dismiss', m.proposal!.label)} />}
            </div>)}
        {pendingText != null && !msgs.some((m) => m.from === 'me' && m.text === pendingText) && <div style={{ alignSelf: 'flex-end', maxWidth: '82%', padding: '10px 14px', borderRadius: '16px 16px 4px 16px', background: 'var(--char-900)', color: 'var(--linen-50)', font: '400 14px/1.45 var(--font-sans)' }}>{pendingText}</div>}
        {typing && <div data-testid="chat-typing" style={{ alignSelf: 'flex-start', padding: '10px 14px', borderRadius: '16px 16px 16px 4px', background: 'var(--surface-sunken)', color: 'var(--text-muted)', font: '400 14px/1.5 var(--font-sans)' }}>Thinking<span style={{ marginLeft: 6 }}><i className="clm-thinking-dot" /><i className="clm-thinking-dot" /><i className="clm-thinking-dot" /></span></div>}
        {(job?.status === 'failed' || job?.status === 'resting') && <JobState jobId={jobId} />}
        <ChoiceChips size="s" multi={false} value={null} onChange={(v) => v && go(v)} options={CHAT_STARTERS.filter((s) => !asked.includes(s))} style={{ marginTop: 4 }} />
        <div ref={end} />
      </div>
    </Sheet>
  );
}
