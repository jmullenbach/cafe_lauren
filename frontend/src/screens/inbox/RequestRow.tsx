import { Avatar } from '../../components/display/Avatar';
import { Badge } from '../../components/display/Badge';
import { Button } from '../../components/core/Button';
import { Icon } from '../../components/core/Icon';
import { useAnswerRequest } from '../../api/hooks';
import { useUi } from '../../state/UiContext';
import { ago } from '../../lib/listText';
import type { Person, RequestOut } from '../../api/models';
import type { PersonColor } from '../../components/types';

export function RequestRow({ r, person, last }: { r: RequestOut; person?: Person; last?: boolean }) {
  const answer = useAnswerRequest();
  const { toast } = useUi();
  const isNew = r.status === 'new';
  const name = person?.name ?? r.who;
  const reply = (status: 'planned' | 'declined') => {
    const text = status === 'declined' ? 'Not this week' : r.type === 'meal' ? 'Café will work it in' : 'Added to the list';
    answer.mutate({ id: r.id, status, reply: text, list_items: status === 'planned' && r.type === 'out' ? [r.text] : [] }, {
      onSuccess: () => status === 'planned' && toast({ tone: 'success', icon: 'check', title: r.type === 'meal' ? 'Café will suggest it' : 'Added to the list', message: `${name} will see the reply.` }),
      onError: (e) => toast({ tone: 'danger', icon: 'triangle-alert', title: 'Could not answer', message: String((e as Error).message) }),
    });
  };
  return (
    <div data-testid="request-row" data-status={r.status} style={{ display: 'flex', gap: 12, padding: '14px 0', borderBottom: last ? 0 : '1px solid var(--border-subtle)' }}>
      <Avatar name={name} color={person?.color as PersonColor | undefined} size={32} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
          <span style={{ flex: 1, font: '600 13px/1 var(--font-sans)', color: 'var(--text-strong)' }}>{name}</span>
          <span style={{ font: '500 12px/1 var(--font-sans)', color: 'var(--text-faint)' }}>{ago(r.created_at)}</span>
        </div>
        <span style={{ font: '400 15px/1.45 var(--font-sans)', color: 'var(--text-strong)' }}>{r.text}</span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          <Badge tone={r.type === 'meal' ? 'accent' : 'warning'} icon={r.type === 'meal' ? 'sparkles' : 'package'}>{r.type === 'meal' ? 'Meal idea' : 'Ran out'}</Badge>
          {r.reply && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, font: '500 12px/1 var(--font-sans)', color: r.status === 'declined' ? 'var(--terra-700)' : 'var(--sage-700)' }}><Icon name={r.status === 'declined' ? 'x' : 'check'} size={13} stroke={2} />{r.reply}</span>}
        </div>
        {isNew && (
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <Button size="s" variant="secondary" icon="x" disabled={answer.isPending} onClick={() => reply('declined')}>Not this week</Button>
            <Button size="s" variant="accent" icon="check" disabled={answer.isPending} onClick={() => reply('planned')}>{r.type === 'meal' ? 'Add to plan' : 'Add to list'}</Button>
          </div>
        )}
      </div>
    </div>
  );
}
