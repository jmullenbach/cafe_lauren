import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sheet } from '../../components/feedback/Sheet';
import { Button } from '../../components/core/Button';
import { Icon } from '../../components/core/Icon';
import { ChoiceChips } from '../../components/forms/ChoiceChips';
import { Input } from '../../components/forms/Input';
import { PhotoTile } from '../../components/kitchen/PhotoTile';
import { JobState } from '../../components/feedback/JobState';
import { useDraftRecipe } from '../../api/hooks';
import { useJobStatus } from '../../api/jobs';
import { listRecipes, uploadPantryPhotos } from '../../api/endpoints';
import { useQueryClient } from '@tanstack/react-query';
import { keys } from '../../api/keys';
import { useUi } from '../../state/UiContext';
import { useJobPoll } from '../../api/extra';

/**
 * Label for recipe-card photos. There is no recipe photo upload endpoint yet, so the photo goes through
 * POST /api/pantry/photos with this label, and the Inbox hides photos carrying it.
 */
export const RECIPE_PHOTO_LABEL = 'recipe-card';

type Mode = 'describe' | 'link' | 'photo' | 'paste';
const LABEL: Record<Mode, string> = { link: 'Read the page', photo: 'Read the photo', paste: 'Tidy it up', describe: 'Write a draft' };

export function AddRecipeSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const nav = useNavigate();
  const qc = useQueryClient();
  const { toast } = useUi();
  const draft = useDraftRecipe();
  const [mode, setMode] = useState<Mode>('describe');
  const [val, setVal] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [jobId, setJobId] = useState<number | null>(null);
  const job = useJobStatus(jobId);
  useJobPoll(jobId);
  const fileRef = useRef<HTMLInputElement>(null);
  const handled = useRef<number | null>(null);

  useEffect(() => { if (open) { setVal(''); setFile(null); setPreview(null); setJobId(null); setUploading(false); handled.current = null; } }, [open]);
  useEffect(() => { if (!file) { setPreview(null); return; } const u = URL.createObjectURL(file); setPreview(u); return () => URL.revokeObjectURL(u); }, [file]);

  // When the draft job finishes, open the draft so it can be checked and saved.
  useEffect(() => {
    if (!job || job.status !== 'done' || handled.current === job.id) return;
    handled.current = job.id;
    (async () => {
      const r = job.result as { recipe_id?: number; id?: number; recipe?: { id?: number } } | null;
      let id = r?.recipe_id ?? r?.id ?? r?.recipe?.id;
      qc.invalidateQueries({ queryKey: keys.recipesAll });
      if (id == null) {
        const drafts = await listRecipes({ status: 'draft', sort: 'recent' });
        id = drafts[0]?.id;
      }
      onClose();
      if (id != null) nav(`/recipes/${id}`);
      else toast({ icon: 'book-open', title: 'Draft ready', message: 'Find it under Drafts to check.' });
    })().catch(() => toast({ tone: 'danger', icon: 'triangle-alert', title: 'Could not open the draft' }));
  }, [job, nav, onClose, qc, toast]);

  const running = draft.isPending || uploading || (!!job && (job.status === 'queued' || job.status === 'running'));
  const valid = mode === 'photo' ? !!file : !!val.trim();

  const go = async () => {
    try {
      let body;
      if (mode === 'photo') {
        setUploading(true);
        const p = await uploadPantryPhotos([file!], RECIPE_PHOTO_LABEL);
        setUploading(false);
        const mine = p.photos.filter((x) => x.label === RECIPE_PHOTO_LABEL).sort((a, b) => b.id - a.id)[0];
        if (!mine) throw new Error('Upload failed');
        body = { mode, photo_path: mine.url.replace(/^\/media\//, '') };
      } else if (mode === 'link') body = { mode, url: val.trim() };
      else body = { mode, text: val.trim() };
      draft.mutate(body as never, { onSuccess: (r) => setJobId(r.job.id), onError: (e) => toast({ tone: 'danger', icon: 'triangle-alert', title: 'Could not start', message: (e as Error).message }) });
    } catch (e) {
      setUploading(false);
      toast({ tone: 'danger', icon: 'triangle-alert', title: 'Could not start', message: (e as Error).message });
    }
  };

  return (
    <Sheet open={open} onClose={onClose} title="Add a recipe" subtitle="Café turns it into the family format. You check it before it's saved."
      footer={<Button size="l" fullWidth icon="sparkles" disabled={running || !valid} onClick={go}>{running ? 'Working on it…' : LABEL[mode]}</Button>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <ChoiceChips size="s" multi={false} value={mode} onChange={(v) => v && setMode(v as Mode)} options={[{ value: 'describe', label: 'Describe it', icon: 'sparkles' }, { value: 'link', label: 'Link', icon: 'arrow-right' }, { value: 'photo', label: 'Photo', icon: 'camera' }, { value: 'paste', label: 'Paste text', icon: 'clipboard-list' }]} />
        {mode === 'link' && <Input icon="search" value={val} onChange={(e) => setVal(e.target.value)} placeholder="https://" />}
        {mode === 'photo' && (
          <>
            <input ref={fileRef} data-testid="recipe-photo-file" className="b-hidden-input" type="file" accept="image/*" capture="environment" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            {preview ? <PhotoTile src={preview} aspect="16 / 9" onRemove={() => setFile(null)} /> : <PhotoTile empty aspect="16 / 9" label="Snap a cookbook page or recipe card" onClick={() => fileRef.current?.click()} />}
          </>
        )}
        {mode === 'paste' && <Input multiline rows={6} value={val} onChange={(e) => setVal(e.target.value)} placeholder="Paste the recipe here" />}
        {mode === 'describe' && <Input multiline rows={4} value={val} onChange={(e) => setVal(e.target.value)} placeholder="Our tortilla soup, but in the slow cooker so it's ready when we get home" />}
        <JobState jobId={jobId} thinking="Café is writing a draft…" />
        <span style={{ display: 'flex', gap: 8, font: '400 12.5px/1.45 var(--font-sans)', color: 'var(--text-muted)' }}><Icon name="info" size={14} style={{ marginTop: 2 }} />Every amount is bolded in the step where it's used, sized for 5.</span>
      </div>
    </Sheet>
  );
}
