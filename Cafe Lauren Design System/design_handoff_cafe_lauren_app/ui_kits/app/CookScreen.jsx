(() => {
const { Checkbox, RecipeStep, Button, Dialog, Stars, Input, Avatar, DayTag, Icon } = window.CafeLaurenDesignSystem_9f0e0a;

function CookScreen({ data, onFeedback }) {
  const r = data.recipe;
  const steps = r.groups.flatMap((g, gi) => g.steps.map(([html, timer], si) => ({ html, timer, group: g.name, first: si === 0 })));
  const [cur, setCur] = React.useState(0);
  const [have, setHave] = React.useState({});
  const [fb, setFb] = React.useState(false);
  const [stars, setStars] = React.useState(4);
  const wrapRef = React.useRef(null);
  const [wide, setWide] = React.useState(false);
  React.useLayoutEffect(() => { const el = wrapRef.current; if (!el) return; const m = () => setWide(el.getBoundingClientRect().width >= 860); m(); window.addEventListener('resize', m); const ro = new ResizeObserver(m); ro.observe(el); return () => { window.removeEventListener('resize', m); ro.disconnect(); }; }, []);
  const done = cur >= steps.length;
  return (
    <div style={{ padding: 'var(--page-pad)', maxWidth: 1240 }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32, maxWidth: 760 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><DayTag day="wed" /><span style={{ font: '500 13px/1 var(--font-sans)', color: 'var(--text-muted)' }}>Tonight · Sheet pan</span></div>
        <h1 style={{ font: '300 44px/1.05 var(--font-serif)', letterSpacing: 'var(--ls-display)', color: 'var(--text-strong)' }}>{r.title}</h1>
        <p style={{ font: 'var(--type-description)', color: 'var(--text-body)' }}>{r.description}</p>
        <div style={{ display: 'flex', gap: 28, marginTop: 4 }}>{r.meta.map(([k, v]) => (
          <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><span style={{ font: 'var(--type-overline)', letterSpacing: 'var(--ls-overline)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{k}</span><span style={{ font: '500 16px/1 var(--font-sans)', color: 'var(--text-strong)' }}>{v}</span></div>))}</div>
      </header>
      <div ref={wrapRef} style={{ display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'flex-start' }}>
        <aside style={{ flex: '1 1 280px', position: wide ? 'sticky' : 'static', top: 40, padding: 24, borderRadius: 'var(--radius-card)', background: 'var(--surface-sunken)' }}>
          <h2 style={{ font: '400 22px/1.2 var(--font-serif)', color: 'var(--text-strong)', marginBottom: 16 }}>Ingredients</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {r.ingredients.map(x => <Checkbox key={x} strike checked={!!have[x]} onChange={v => setHave({ ...have, [x]: v })} label={x} />)}
          </div>
        </aside>
        <section style={{ flex: '999 1 520px', minWidth: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {steps.map((s, i) => (
              <React.Fragment key={i}>
                {s.first && <h3 style={{ font: 'var(--type-overline)', letterSpacing: 'var(--ls-overline)', textTransform: 'uppercase', color: 'var(--sage-700)', margin: i ? '24px 24px 8px' : '0 24px 8px' }}>{s.group}</h3>}
                <RecipeStep size="l" index={i + 1} done={i < cur} active={i === cur} timer={s.timer} onToggle={() => setCur(i)}>
                  <span dangerouslySetInnerHTML={{ __html: s.html }} />
                </RecipeStep>
              </React.Fragment>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 28, padding: '20px 24px', borderTop: '1px solid var(--border-default)' }}>
            <Button variant="secondary" size="l" icon="arrow-left" disabled={cur === 0} onClick={() => setCur(Math.max(0, cur - 1))}>Back</Button>
            {done
              ? <Button variant="accent" size="l" icon="star" onClick={() => setFb(true)}>How was dinner?</Button>
              : <Button size="l" iconRight="arrow-right" onClick={() => setCur(cur + 1)}>{cur === steps.length - 1 ? 'Done cooking' : 'Next step'}</Button>}
          </div>
        </section>
      </div>
      <Dialog open={fb} onClose={() => setFb(false)} title="How was dinner?" description="Ratings and notes go back into the recipe box, so next week's plan gets better."
        actions={<><Button variant="ghost" onClick={() => setFb(false)}>Later</Button><Button variant="accent" onClick={() => { setFb(false); onFeedback(stars); }}>Save feedback</Button></>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}><Stars value={stars} onChange={setStars} size={28} /><span style={{ font: '500 14px/1 var(--font-sans)', color: 'var(--text-muted)' }}>{['', 'Skip it', 'Meh', 'Fine', 'Make again', 'Family favorite'][stars]}</span></div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>{Object.values(data.people).map(p => <Avatar key={p.name} {...p} size={28} />)}<span style={{ font: '400 13px/1.3 var(--font-sans)', color: 'var(--text-muted)' }}>Joe and Leidy will be asked too</span></div>
          <Input label="Notes for next time" multiline rows={3} placeholder="Kids loved the potatoes. Chops needed 3 more minutes." />
        </div>
      </Dialog>
    </div>
  );
}
window.CookScreen = CookScreen;
})();
