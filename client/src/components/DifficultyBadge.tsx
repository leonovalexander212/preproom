import type { Difficulty } from '../types/api';

type Props = { difficulty: Difficulty | null };

const LABELS: Record<Difficulty, string> = {
  JUNIOR: 'Junior',
  MIDDLE: 'Middle',
  SENIOR: 'Senior',
};

const STYLES: Record<Difficulty, string> = {
  JUNIOR: 'bg-grade-junior/15 text-grade-junior border-grade-junior/30',
  MIDDLE: 'bg-grade-middle/15 text-grade-middle border-grade-middle/30',
  SENIOR: 'bg-grade-senior/15 text-grade-senior border-grade-senior/30',
};

// Цветной чип грейда. null → ничего не рендерим (для направлений без грейдов).
export function DifficultyBadge({ difficulty }: Props) {
  if (!difficulty) return null;
  return (
    <span className={`
      inline-flex items-center text-[10px] font-semibold px-2 py-0.5
      rounded-full border ${STYLES[difficulty]}
    `}>
      {LABELS[difficulty]}
    </span>
  );
}
