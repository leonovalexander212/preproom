import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { TestCase } from './codeJudge';

export interface MdTask {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  language: 'python' | 'java' | 'javascript' | 'php';
  description: string;
  starterCode: string;
  tests: TestCase[];
}

// Папка `questions/` лежит в корне репозитория, рядом с `server/` и `client/`.
// __dirname в TS-собранном коде = .../server/dist/lib (или /server/src/lib при ts-node).
// Поднимаемся вверх, пока не найдём `questions/`.
function findQuestionsRoot(): string {
  const explicit = process.env.QUESTIONS_DIR;
  if (explicit && existsSync(explicit)) return explicit;

  let dir = dirname(fileURLToPath(import.meta.url));
  for (let i = 0; i < 8; i++) {
    const candidate = join(dir, 'questions');
    if (existsSync(candidate)) return candidate;
    dir = dirname(dir);
  }
  // Fallback (CJS / классический require)
  let cjs = typeof __dirname !== 'undefined' ? __dirname : process.cwd();
  for (let i = 0; i < 8; i++) {
    const candidate = join(cjs, 'questions');
    if (existsSync(candidate)) return candidate;
    cjs = dirname(cjs);
  }
  throw new Error(`Folder "questions/" not found near server bundle`);
}

function parseFrontmatter(raw: string): { fm: Record<string, string>; body: string } {
  const m = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!m) return { fm: {}, body: raw };
  const fm: Record<string, string> = {};
  for (const line of m[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim();
    if (key) fm[key] = val;
  }
  return { fm, body: m[2] };
}

function extractBetweenHeading(body: string, heading: string): string {
  const re = new RegExp(`^#\\s+${heading}\\s*\\n([\\s\\S]*?)(?=^#\\s+|\\Z)`, 'mi');
  const m = body.match(re);
  return m ? m[1].trim() : '';
}

function extractFirstFencedBlock(text: string, lang?: string): string {
  const re = lang
    ? new RegExp('```' + lang + '\\s*\\n([\\s\\S]*?)```', 'm')
    : /```[a-z0-9]*\s*\n([\s\S]*?)```/m;
  const m = text.match(re);
  return m ? m[1] : '';
}

function parseTask(filePath: string): MdTask | null {
  const raw = readFileSync(filePath, 'utf-8');
  const { fm, body } = parseFrontmatter(raw);

  const id = fm.id;
  const title = fm.title;
  const difficulty = (fm.difficulty as MdTask['difficulty']) || 'easy';
  const language = fm.language as MdTask['language'];

  if (!id || !title || !language) {
    console.warn(`[mdLoader] missing fm in ${filePath}`);
    return null;
  }

  const description = extractBetweenHeading(body, 'Описание')
    .replace(/```[\s\S]*?```/g, '')
    .trim();

  const starterRaw = extractBetweenHeading(body, 'Стартовый код');
  const starterCode = extractFirstFencedBlock(starterRaw, language) || extractFirstFencedBlock(starterRaw);

  const testsRaw = extractBetweenHeading(body, 'Тесты');
  const testsJson = extractFirstFencedBlock(testsRaw, 'json') || extractFirstFencedBlock(testsRaw);
  let tests: TestCase[] = [];
  if (testsJson) {
    try {
      const parsed = JSON.parse(testsJson);
      if (Array.isArray(parsed)) tests = parsed;
    } catch (e) {
      console.warn(`[mdLoader] bad tests JSON in ${filePath}`, e);
    }
  }

  return { id, title, difficulty, language, description, starterCode, tests };
}

export function loadTasks(directionDbSlug: string, grade: string): MdTask[] {
  const root = findQuestionsRoot();
  const dir = join(root, directionDbSlug, grade.toLowerCase());
  if (!existsSync(dir)) {
    console.warn(`[mdLoader] no folder for ${directionDbSlug}/${grade.toLowerCase()}`);
    return [];
  }
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => parseTask(join(dir, f)))
    .filter((t): t is MdTask => Boolean(t));
}

export function pickRandomTasks(tasks: MdTask[], n: number): MdTask[] {
  const shuffled = [...tasks].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}