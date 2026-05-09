export type Direction = 'frontend' | 'java' | 'python' | 'php' | 'csharp';
export type Grade = 'JUNIOR' | 'MIDDLE' | 'SENIOR';

export interface DirectionMeta {
  slug: Direction;
  label: string;
  /** slug направления в БД (Prisma model Direction.slug) */
  dbSlug: string;
  /** язык для Piston и MD-задач */
  language: 'python' | 'java' | 'javascript' | 'php' | 'csharp';
  available: boolean;
  disabledReason?: string;
}

export const DIRECTIONS: DirectionMeta[] = [
  { slug: 'python',   label: 'PYTHON',   dbSlug: 'python',   language: 'python',     available: true },
  { slug: 'java',     label: 'JAVA',     dbSlug: 'java',     language: 'java',       available: true },
  { slug: 'frontend', label: 'FRONTEND', dbSlug: 'frontend', language: 'javascript', available: true },
  { slug: 'php',      label: 'PHP',      dbSlug: 'php',      language: 'php',        available: true },
  { slug: 'csharp',   label: 'C#',       dbSlug: 'csharp',   language: 'csharp',     available: false, disabledReason: 'В БД пока нет вопросов с реальных собеседований' },
];

export const GRADES: { slug: Grade; label: string; hint: string; available: boolean; disabledReason?: string }[] = [
  { slug: 'JUNIOR', label: 'JUNIOR', hint: '1-2 года', available: true },
  { slug: 'MIDDLE', label: 'MIDDLE', hint: '2-4 года', available: true },
  { slug: 'SENIOR', label: 'SENIOR', hint: '4+ лет',  available: true },
];

export function getDirectionMeta(slug: Direction): DirectionMeta {
  const m = DIRECTIONS.find((d) => d.slug === slug);
  if (!m) throw new Error(`Unknown direction: ${slug}`);
  return m;
}

export function isAllowed(direction: Direction, grade: Grade): { ok: true } | { ok: false; reason: string } {
  const d = DIRECTIONS.find((x) => x.slug === direction);
  const g = GRADES.find((x) => x.slug === grade);
  if (!d) return { ok: false, reason: 'unknown_direction' };
  if (!g) return { ok: false, reason: 'unknown_grade' };
  if (!d.available) return { ok: false, reason: d.disabledReason ?? 'direction_disabled' };
  if (!g.available) return { ok: false, reason: g.disabledReason ?? 'grade_disabled' };
  return { ok: true };
}