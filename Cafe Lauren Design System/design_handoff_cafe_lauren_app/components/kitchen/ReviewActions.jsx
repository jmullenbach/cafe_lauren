import React from 'react';
import { Button } from '../core/Button.jsx';
export function ReviewActions({ onReject, onSwap, onEdit, onApprove, rejectLabel = 'Not this', swapLabel = 'Swap', editLabel = 'Edit', approveLabel = 'Keep', size = 'm', style }) {
  return (
    <div style={{ display: 'flex', gap: 8, ...style }}>
      {onReject && <Button variant="secondary" size={size} icon="x" onClick={onReject} style={{ flex: 1, color: 'var(--terra-700)' }}>{rejectLabel}</Button>}
      {onSwap && <Button variant="secondary" size={size} icon="refresh-cw" onClick={onSwap} style={{ flex: 1 }}>{swapLabel}</Button>}
      {onEdit && <Button variant="secondary" size={size} icon="pencil" onClick={onEdit} style={{ flex: 1 }}>{editLabel}</Button>}
      {onApprove && <Button variant="accent" size={size} icon="check" onClick={onApprove} style={{ flex: 1.2 }}>{approveLabel}</Button>}
    </div>
  );
}
