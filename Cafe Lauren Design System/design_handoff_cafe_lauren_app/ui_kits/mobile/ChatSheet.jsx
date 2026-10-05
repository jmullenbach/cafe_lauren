(() => {
const { Sheet, Button, IconButton, Input, ChoiceChips, SuggestedTag, Icon } = window.CafeLaurenDesignSystem_9f0e0a;

function Proposal({ p, onApply, onDismiss }) {
  return (
    <div style={{ marginTop: 10, padding: 12, borderRadius: 'var(--radius-m)', background: 'var(--surface-card)', border: p.state === 'pending' ? '1px dashed var(--sage-300)' : '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ font: '600 14px/1.3 var(--font-sans)', color: 'var(--text-strong)' }}>{p.label}</span>
      <span style={{ font: '400 13px/1.4 var(--font-sans)', color: 'var(--text-muted)' }}>{p.detail}</span>
      {p.state === 'pending'
        ? <div style={{ display: 'flex', gap: 8 }}><Button size="s" variant="secondary" style={{ flex: 1 }} onClick={onDismiss}>Not that</Button><Button size="s" variant="accent" icon="check" style={{ flex: 1 }} onClick={onApply}>Apply</Button></div>
        : <SuggestedTag status={p.state === 'applied' ? 'kept' : 'rejected'} label={p.state === 'applied' ? 'Applied to the plan' : 'Dismissed'} style={{ alignSelf: 'flex-start' }} />}
    </div>
  );
}

function ChatSheet({ open }) {
  const a = useApp();
  const [text, setText] = React.useState('');
  const ref = React.useRef(null);
  React.useEffect(() => { const el = ref.current && ref.current.parentElement; if (el) el.scrollTop = el.scrollHeight; }, [a.chat, open]);
  const send = t => { if (!t.trim()) return; a.chatSend(t.trim()); setText(''); };
  const asked = a.chat.filter(m => m.from === 'me').map(m => m.text);
  return (
    <Sheet open={open} onClose={a.closeSheet} maxHeight="90%" title={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Icon name="sparkles" size={20} style={{ color: 'var(--sage-600)' }} />Ask Café</span>}
      footer={<form onSubmit={e => { e.preventDefault(); send(text); }} style={{ display: 'flex', gap: 8, width: '100%' }}><Input style={{ flex: 1, minWidth: 0 }} value={text} onChange={e => setText(e.target.value)} placeholder="Swap Friday for something cheaper…" /><IconButton icon="send" label="Send" variant="primary" onClick={() => send(text)} /></form>}>
      <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 300 }}>
        {a.chat.map((m, i) => m.from === 'me'
          ? <div key={i} style={{ alignSelf: 'flex-end', maxWidth: '82%', padding: '10px 14px', borderRadius: '16px 16px 4px 16px', background: 'var(--char-900)', color: 'var(--linen-50)', font: '400 14px/1.45 var(--font-sans)' }}>{m.text}</div>
          : <div key={i} style={{ alignSelf: 'flex-start', maxWidth: '92%' }}>
              <div style={{ padding: '10px 14px', borderRadius: '16px 16px 16px 4px', background: 'var(--surface-sunken)', color: 'var(--text-strong)', font: '400 14px/1.5 var(--font-sans)' }}>
                {m.typing ? <span style={{ color: 'var(--text-muted)' }}>Thinking…</span> : m.text}
              </div>
              {m.proposal && <Proposal p={m.proposal} onApply={() => a.resolveProposal(i, 'apply')} onDismiss={() => a.resolveProposal(i, 'dismiss')} />}
            </div>)}
        <ChoiceChips size="s" multi={false} value={null} onChange={v => v && send(v)} options={a.D.chatStarters.filter(s => !asked.includes(s))} style={{ marginTop: 4 }} />
      </div>
    </Sheet>
  );
}
window.ChatSheet = ChatSheet;
})();
