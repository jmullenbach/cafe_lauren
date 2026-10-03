import { useNavigate, useParams } from 'react-router-dom';
import { Screen, BackHeader } from '../components/layout/Layout';

/** Demonstrates a pushed route (no tab bar, back button). Phase 4 replaces it with Meal detail. */
export function DetailPlaceholder() {
  const nav = useNavigate();
  const { id } = useParams();
  return (
    <Screen bottom={40}>
      <BackHeader title={`Meal ${id}`} onBack={() => nav(-1)} />
      <h1 style={{ font: '300 36px/1.05 var(--font-serif)', letterSpacing: 'var(--ls-display)', color: 'var(--text-strong)' }}>Meal detail</h1>
      <p style={{ marginTop: 12, font: '400 14px/1.45 var(--font-sans)', color: 'var(--text-muted)' }}>Coming in Phase 4.</p>
    </Screen>
  );
}
