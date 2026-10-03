import { useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../../styles/screens-b.css';
import { Screen, LargeTitle, SectionHead } from '../../components/layout/Layout';
import { Button } from '../../components/core/Button';
import { IconButton } from '../../components/core/IconButton';
import { Icon } from '../../components/core/Icon';
import { Card } from '../../components/display/Card';
import { Input } from '../../components/forms/Input';
import { ChoiceChips } from '../../components/forms/ChoiceChips';
import { SegmentedControl } from '../../components/forms/SegmentedControl';
import { PhotoTile } from '../../components/kitchen/PhotoTile';
import { SuggestedTag } from '../../components/kitchen/SuggestedTag';
import { JobState } from '../../components/feedback/JobState';
import { useAppState, useCreateRequest, usePantry, useReadPantry, useRequests, useUploadPantryPhotos } from '../../api/hooks';
import { useRunningJobs } from '../../api/jobs';
import { useUi } from '../../state/UiContext';
import { useJobPoll } from '../../api/extra';
import { ProfileButton } from '../settings/ProfileButton';
import { RequestRow } from './RequestRow';
import { shortDate } from '../../lib/listText';

export function InboxScreen() {
  const [params, setParams] = useSearchParams();
  const seg = params.get('seg') === 'pantry' ? 'pantry' : 'requests';
  const setSeg = (v: string) => setParams(v === 'pantry' ? { seg: 'pantry' } : {}, { replace: true });
  const { data: st } = useAppState();
  const { data: requests = [] } = useRequests();
  const fresh = requests.filter((r) => r.status === 'new');
  const old = requests.filter((r) => r.status !== 'new');
  const people = st?.people ?? [];
  return (
    <Screen>
      <LargeTitle overline={st?.week.label} title="Inbox" right={<ProfileButton />} />
      <SegmentedControl value={seg} onChange={setSeg} options={[{ value: 'requests', label: `Requests${fresh.length ? ' · ' + fresh.length : ''}` }, { value: 'pantry', label: 'Pantry' }]} style={{ display: 'flex', marginBottom: 20 }} />
      {seg === 'requests' ? (
        <>
          <Compose />
          {fresh.length > 0 && <><SectionHead title="New" /><div>{fresh.map((r, i) => <RequestRow key={r.id} r={r} person={people.find((p) => p.key === r.who)} last={i === fresh.length - 1} />)}</div></>}
          <SectionHead title="Answered" />
          <div>
            {old.map((r, i) => <RequestRow key={r.id} r={r} person={people.find((p) => p.key === r.who)} last={i === old.length - 1} />)}
            {!old.length && <p style={{ font: '400 14px/1.5 var(--font-sans)', color: 'var(--text-muted)' }}>Nothing answered yet.</p>}
          </div>
        </>
      ) : <PantryTab />}
    </Screen>
  );
}

function Compose() {
  const [type, setType] = useState<'meal' | 'out'>('meal');
  const [text, setText] = useState('');
  const create = useCreateRequest();
  const { toast } = useUi();
  const send = () => {
    const t = text.trim();
    if (!t || create.isPending) return;
    create.mutate({ type, text: t }, {
      onSuccess: () => { setText(''); toast({ icon: 'send', title: 'Sent to the household', message: "Café will consider it in this week's plan." }); },
      onError: (e) => toast({ tone: 'danger', icon: 'triangle-alert', title: 'Could not send', message: (e as Error).message }),
    });
  };
  return (
    <Card padding="m">
      <form onSubmit={(e) => { e.preventDefault(); send(); }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <ChoiceChips size="s" multi={false} value={type} onChange={(v) => v && setType(v)} options={[{ value: 'meal', label: 'Meal idea', icon: 'sparkles' }, { value: 'out', label: "We're out of", icon: 'package' }]} />
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <Input style={{ flex: 1, minWidth: 0 }} value={text} onChange={(e) => setText(e.target.value)} placeholder={type === 'meal' ? 'Something with salmon?' : 'Cornstarch, the big yogurt…'} />
          <IconButton icon="send" label="Send" variant="primary" disabled={!text.trim() || create.isPending} onClick={send} />
        </div>
      </form>
    </Card>
  );
}

function PantryTab() {
  const nav = useNavigate();
  const { toast } = useUi();
  const { data: pantry } = usePantry();
  const upload = useUploadPantryPhotos();
  const read = useReadPantry();
  const running = useRunningJobs('pantry_read');
  const [jobId, setJobId] = useState<number | null>(null);
  useJobPoll(jobId ?? running[0]?.id);
  const fileRef = useRef<HTMLInputElement>(null);
  const photos = (pantry?.photos ?? []);
  const items = pantry?.items ?? [];
  const status = pantry?.status;
  const unread = photos.filter((p) => !p.read_at);
  const busy = running.length > 0 || read.isPending;
  const unsure = items.filter((i) => i.state === 'unsure').length;
  const found = items.filter((i) => i.state !== 'removed').length;

  const onFiles = (files: FileList | null) => {
    const list = files ? Array.from(files) : [];
    if (!list.length) return;
    upload.mutate({ files: list }, {
      onSuccess: () => toast({ tone: 'success', icon: 'camera', title: `${list.length} photo${list.length > 1 ? 's' : ''} added`, message: 'Tap "Read the pantry" when you have them all.' }),
      onError: (e) => toast({ tone: 'danger', icon: 'triangle-alert', title: 'Upload failed', message: (e as Error).message }),
    });
    if (fileRef.current) fileRef.current.value = '';
  };
  const readNow = () => read.mutate({ photo_ids: unread.map((p) => p.id) }, {
    onSuccess: (r) => setJobId(r.job.id),
    onError: (e) => toast({ tone: 'danger', icon: 'triangle-alert', title: 'Could not start', message: (e as Error).message }),
  });

  return (
    <>
      <input ref={fileRef} data-testid="pantry-file" className="b-hidden-input" type="file" accept="image/*" capture="environment" multiple onChange={(e) => onFiles(e.target.files)} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        {photos.map((p) => <PhotoTile key={p.id} src={p.url} aspect="1 / 1" label={p.label || undefined} meta={p.read_at ? `${shortDate(p.read_at)} · ${p.item_count} items found` : `${shortDate(p.created_at)} · not read yet`} />)}
        <PhotoTile empty aspect="1 / 1" label={upload.isPending ? 'Uploading…' : 'Add photo'} onClick={() => fileRef.current?.click()} />
      </div>
      <Card padding="m" tone={status?.done ? 'accent' : 'default'} style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <JobState jobId={jobId ?? running[0]?.id} thinking="Café is reading your pantry photos…" />
          {status?.done ? (
            <span style={{ display: 'flex', gap: 8, alignItems: 'center', font: '500 14px/1.4 var(--font-sans)', color: 'var(--sage-900)' }}><Icon name="circle-check" size={18} />Confirmed {status.confirmed_at ? (shortDate(status.confirmed_at) === shortDate(new Date().toISOString()) ? 'today' : shortDate(status.confirmed_at)) : ''}</span>
          ) : items.length > 0 ? (
            <>
              <SuggestedTag label={`Café found ${found} items`} style={{ alignSelf: 'flex-start' }} />
              <span style={{ font: '400 14px/1.45 var(--font-sans)', color: 'var(--text-body)' }}>{unsure ? `${unsure} it wasn't sure about. ` : ''}A quick check keeps them off the grocery list.</span>
            </>
          ) : (
            <span style={{ font: '400 14px/1.45 var(--font-sans)', color: 'var(--text-body)' }}>{photos.length ? 'Photos are ready. Café reads every item it can see, and flags the ones it is not sure about.' : 'Snap the fridge, freezer, pantry and counter. Café reads them so we do not buy what we already have.'}</span>
          )}
          {unread.length > 0 && <Button variant={items.length ? 'secondary' : 'primary'} icon="sparkles" disabled={busy} onClick={readNow}>{busy ? 'Reading…' : `Read the pantry · ${unread.length} new photo${unread.length > 1 ? 's' : ''}`}</Button>}
          {(items.length > 0 || status?.done) && <Button variant={status?.done ? 'secondary' : 'primary'} icon="refrigerator" onClick={() => nav('/inbox/pantry')}>{status?.done ? 'View inventory' : 'Review what it found'}</Button>}
        </div>
      </Card>
    </>
  );
}
