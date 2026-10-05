import React, { useState } from 'react';
import { Icon } from '../core/Icon.jsx';
import { DayTag } from '../display/DayTag.jsx';
import { Badge } from '../display/Badge.jsx';
import { Score } from '../display/Score.jsx';
import { Stars } from '../display/Stars.jsx';
function Meta({ icon, children }) {
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: '500 13px/1 var(--font-sans)', color: 'var(--text-body)', whiteSpace: 'nowrap' }}><Icon name={icon} size={16} style={{ color: 'var(--text-muted)' }} />{children}</span>;
}
export function MealCard({ title, description, day, method, time, healthy, delicious, cost, stars, image, leftovers, onSale, cook, footer, selected, compact, onClick, style }) {
  const [h, setH] = useState(false);
  return (
    <article onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: 'flex', flexDirection: 'column', background: 'var(--surface-card)', border: `1px solid ${selected ? 'var(--sage-500)' : 'var(--border-subtle)'}`, borderRadius: 'var(--radius-card)', overflow: 'hidden',
        boxShadow: (onClick && h) ? 'var(--shadow-2)' : 'var(--shadow-1)', transform: onClick && h ? 'translateY(-2px)' : 'none', cursor: onClick ? 'pointer' : undefined,
        transition: 'box-shadow var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)', ...style }}>
      {!compact && <div style={{ position: 'relative', aspectRatio: '4 / 3', background: 'var(--linen-200)', overflow: 'hidden' }}>
        {image ? <img src={image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: h && onClick ? 'scale(1.03)' : 'none', transition: 'transform var(--dur-slow) var(--ease-out)' }} />
          : <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: 'var(--linen-400)' }}><Icon name="cooking-pot" size={40} stroke={1.25} /></div>}
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>{day && <DayTag day={day} />}{onSale && <Badge tone="sale" variant="solid" icon="tag">On sale</Badge>}</div>
      </div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: compact ? 16 : 20, flex: 1 }}>
        {compact && (day || onSale) && <div style={{ display: 'flex', gap: 6 }}>{day && <DayTag day={day} />}{onSale && <Badge tone="sale" icon="tag">On sale</Badge>}</div>}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <h3 style={{ flex: 1, font: `400 ${compact ? 19 : 22}px/1.2 var(--font-serif)`, letterSpacing: '-0.01em', color: 'var(--text-strong)' }}>{title}</h3>
          {stars != null && <Stars value={stars} size={14} style={{ marginTop: 5 }} />}
        </div>
        {description && <p style={{ font: 'italic 400 15px/1.45 var(--font-serif)', color: 'var(--text-body)' }}>{description}</p>}
        {(method || time || cost || cook) && <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px' }}>
          {method && <Meta icon="cooking-pot">{method}</Meta>}{time && <Meta icon="clock">{time}</Meta>}{cost && <Meta icon="receipt">{cost}</Meta>}{cook && <Meta icon="chef-hat">{cook}</Meta>}
        </div>}
        {(healthy != null || delicious != null) && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, paddingTop: 4 }}>
          {healthy != null && <Score label="Healthy" value={healthy} />}{delicious != null && <Score label="Delicious" value={delicious} tone="terra" />}
        </div>}
        {leftovers && <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '10px 12px', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-s)', font: '400 13px/1.45 var(--font-sans)', color: 'var(--text-body)' }}><Icon name="refresh-cw" size={15} style={{ color: 'var(--sage-600)', marginTop: 2 }} /><span>{leftovers}</span></div>}
        {footer && <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>{footer}</div>}
      </div>
    </article>
  );
}
