// AI Mock Interview — реальные вопросы из БД + лайв-кодинг через LLM-судью.
// Финальная оценка от Джарвиса (Groq llama-3.3-70b) — ранг в стиле Devil May Cry.

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { llm } from '../lib/llm';
import { prisma } from '../lib/prisma';
import {
  DIRECTIONS,
  GRADES,
  getDirectionMeta,
  isAllowed,
  type Direction,
  type Grade,
} from '../lib/mockBank';
import {
  abortSession,
  createSession,
  getSession,
  isExpired,
  rateLimitStatus,
  remainingMs,
  tryConsume,
  type MockQuestionRuntime,
  type CodingTaskRuntime,
  type MockSession,
} from '../lib/mockStore';
import { judgeCode, type JudgeLanguage } from '../lib/codeJudge';
import { loadTasks, pickRandomTasks, type MdTask } from '../lib/mdLoader';

const router = Router();

/* --------------------------- helpers --------------------------- */

function clientIp(req: Request): string {
  const fwd = (req.headers['x-forwarded-for'] as string) ?? '';
  return fwd.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
}

async function callJson<T>(systemPrompt: string, userPrompt: string, temperature = 0.3): Promise<T> {
  const res = await llm.client.chat.completions.create({
    model: llm.model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature,
    max_tokens: 1100,
    response_format: { type: 'json_object' },
  });
  const raw = res.choices[0]?.message?.content ?? '{}';
  try { return JSON.parse(raw) as T; }
  catch {
    const cleaned = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned) as T;
  }
}

function rankFromScore(score: number): { rank: 'D'|'C'|'B'|'A'|'S'|'SS'|'SSS'; label: string } {
  if (score >= 95) return { rank: 'SSS', label: 'SMOKIN\' SEXY STYLE!!!' };
  if (score >= 87) return { rank: 'SS',  label: 'SHOWTIME!!' };
  if (score >= 75) return { rank: 'S',   label: 'STYLISH!' };
  if (score >= 60) return { rank: 'A',   label: 'ALRIGHT!' };
  if (score >= 45) return { rank: 'B',   label: 'BRAVO' };
  if (score >= 30) return { rank: 'C',   label: 'COOL' };
  return { rank: 'D', label: 'DULL' };
}

// ВАЖНО: берём первые 15 технических (без soft/поведенческих) — на одно видео-интервью.
const MIN_TECH_PER_INTERVIEW = 15;
const MAX_TECH_PER_INTERVIEW = 15;
const CODING_TASKS_PER_SESSION = 2;

/* --------------------------- public meta --------------------------- */

router.get('/directions', (_req, res) => {
  res.json({ directions: DIRECTIONS, grades: GRADES });
});

router.get('/rate-limit', (req, res) => {
  res.json(rateLimitStatus(clientIp(req)));
});

/* --------------------------- start --------------------------- */

const startSchema = z.object({
  direction: z.enum(['frontend', 'java', 'python', 'php', 'csharp']),
  grade: z.enum(['JUNIOR', 'MIDDLE', 'SENIOR']),
});

router.post('/start', async (req: Request, res: Response) => {
  const parsed = startSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'bad_request' });

  const { direction, grade } = parsed.data as { direction: Direction; grade: Grade };
  const guard = isAllowed(direction, grade);
  if (!guard.ok) return res.status(400).json({ error: 'unavailable', message: guard.reason });

  const meta = getDirectionMeta(direction);

  const dbDir = await prisma.direction.findUnique({ where: { slug: meta.dbSlug } });
  if (!dbDir) return res.status(500).json({ error: 'db_direction_missing', message: `slug ${meta.dbSlug} не найден в БД` });

  const interviews = await prisma.interview.findMany({
    where: {
      directionId: dbDir.id,
      title: { contains: grade.toUpperCase() },
      questions: {
        some: { question: { type: 'TECHNICAL', difficulty: grade as any } },
      },
    },
    select: {
      id: true, title: true,
      questions: {
        where: { question: { type: 'TECHNICAL', difficulty: grade as any } },
        select: {
          id: true,
          question: { select: { id: true, text: true, topic: { select: { name: true } } } },
        },
        orderBy: { id: 'asc' },
      },
    },
  });

  const eligible = interviews.filter((iv) => iv.questions.length >= MIN_TECH_PER_INTERVIEW);
  if (eligible.length === 0) {
    return res.status(503).json({
      error: 'no_eligible_interview',
      message: `Не нашёл в БД интервью с ≥${MIN_TECH_PER_INTERVIEW} техническими вопросами для ${meta.label} / ${grade}.`,
    });
  }

  const picked = eligible[Math.floor(Math.random() * eligible.length)];

  // Берём ровно первые 15 технических вопросов (или сколько есть, но не больше).
  const limited = picked.questions.slice(0, MAX_TECH_PER_INTERVIEW);

  const questions: MockQuestionRuntime[] = limited.map((iq) => ({
    id: iq.question.id,
    text: iq.question.text,
    topic: iq.question.topic?.name ?? meta.label,
    kind: 'theory',
  }));

  const allTasks = loadTasks(meta.dbSlug, grade);
  if (allTasks.length < CODING_TASKS_PER_SESSION) {
    return res.status(500).json({
      error: 'not_enough_md_tasks',
      message: `В /questions/${meta.dbSlug}/${grade.toLowerCase()}/ нашёл только ${allTasks.length} MD-задач, нужно ≥${CODING_TASKS_PER_SESSION}.`,
    });
  }
  const pickedTasks = pickRandomTasks(allTasks, CODING_TASKS_PER_SESSION);
  const codingRuntime: CodingTaskRuntime[] = pickedTasks.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    starterCode: t.starterCode,
    language: t.language,
    difficulty: t.difficulty,
    testsCount: t.tests.length,
  }));

  const ip = clientIp(req);
  if (!tryConsume(ip)) {
    const status = rateLimitStatus(ip);
    return res.status(429).json({ error: 'rate_limit', ...status });
  }

  const session = createSession({
    ip, direction, grade,
    questions, codingTasks: codingRuntime,
    sourceInterviewTitle: picked.title,
  });
  TASKS_BY_SESSION.set(session.id, new Map(pickedTasks.map((t) => [t.id, t])));

  res.json(serializeForClient(session));
});

const TASKS_BY_SESSION = new Map<string, Map<string, MdTask>>();

/* --------------------------- answer --------------------------- */

const answerSchema = z.object({
  sessionId: z.string(),
  answer: z.string().min(1).max(8000),
});

router.post('/answer', (req: Request, res: Response) => {
  const parsed = answerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'bad_request' });

  const session = getSession(parsed.data.sessionId);
  if (!session) return res.status(404).json({ error: 'session_not_found' });
  if (session.stage === 'aborted') return res.status(400).json({ error: 'aborted' });
  if (session.stage !== 'qa') return res.status(400).json({ error: 'wrong_stage' });
  if (isExpired(session)) {
    session.stage = session.codingTasks.length > 0 ? 'coding' : 'finished';
    return res.json({ session: serializeForClient(session), expired: true });
  }

  const q = session.questions[session.currentQuestionIdx];
  if (!q) return res.status(400).json({ error: 'no_current_question' });

  session.answers.push({
    questionId: q.id,
    questionText: q.text,
    topic: q.topic,
    userAnswer: parsed.data.answer,
  });
  session.currentQuestionIdx += 1;

  if (session.currentQuestionIdx >= session.questions.length) {
    session.stage = session.codingTasks.length > 0 ? 'coding' : 'finished';
  }

  res.json({ session: serializeForClient(session) });
});

/* --------------------------- coding --------------------------- */

const codingSchema = z.object({
  sessionId: z.string(),
  code: z.string().min(1).max(40000),
});

router.post('/coding', async (req: Request, res: Response) => {
  const parsed = codingSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'bad_request' });

  const session = getSession(parsed.data.sessionId);
  if (!session) return res.status(404).json({ error: 'session_not_found' });
  if (session.stage === 'aborted') return res.status(400).json({ error: 'aborted' });
  if (session.stage !== 'coding') return res.status(400).json({ error: 'wrong_stage' });
  if (isExpired(session)) {
    session.stage = 'finished';
    return res.json({ session: serializeForClient(session), expired: true });
  }

  const task = session.codingTasks[session.currentCodingIdx];
  if (!task) return res.status(400).json({ error: 'no_current_task' });

  const tasksMap = TASKS_BY_SESSION.get(session.id);
  const fullTask = tasksMap?.get(task.id);
  if (!fullTask) return res.status(500).json({ error: 'tests_not_loaded' });

  let report;
  try {
    report = await judgeCode(task.language as JudgeLanguage, parsed.data.code, fullTask.tests);
  } catch (e: any) {
    console.error('mock/coding judge error', e);
    return res.status(502).json({ error: 'judge_failed', message: e?.message });
  }

  session.coding.push({
    taskId: task.id,
    title: task.title,
    language: task.language,
    userCode: parsed.data.code,
    testsPassed: report.passed,
    testsTotal: report.total,
    errorSample: report.compileError ? `Ошибка компиляции` : report.errorSample,
  });
  session.currentCodingIdx += 1;

  if (session.currentCodingIdx >= session.codingTasks.length) {
    session.stage = 'finished';
  }

  res.json({
    result: {
      taskId: task.id,
      testsPassed: report.passed,
      testsTotal: report.total,
      errorSample: report.compileError ? `Ошибка компиляции` : report.errorSample,
    },
    session: serializeForClient(session),
  });
});

/* --------------------------- abort --------------------------- */

router.post('/abort', (req: Request, res: Response) => {
  const sessionId = String(req.body?.sessionId ?? '');
  const session = abortSession(sessionId);
  if (!session) return res.status(404).json({ error: 'session_not_found' });
  res.json(serializeForClient(session));
});

/* --------------------------- finish --------------------------- */

const FINAL_SYSTEM = `Ты — Джарвис, предельно строгий технический интервьюер уровня tech lead. Сейчас сводишь итог собеседования.
Оцениваешь как на экзамене по совокупности.

КРИТИЧЕСКИЕ ПРАВИЛА ОЦЕНКИ (следуй им ЖЁСТКО, без снисхождения):
- Если ответ это БЕССМЫСЛЕННЫЙ набор символов, случайные цифры/буквы, одно слово без контента,
  "не знаю", "хз", "asdf", "123", пустые отписки — этот ответ = 0 баллов.
- Если КАЖДЫЙ или ПОЧТИ КАЖДЫЙ ответ — бессмыслица/мусор: totalScore ОБЯЗАТЕЛЬНО 0..8.
- Если больше половины ответов — мусор: totalScore максимум 0..15.
- Если ответы короткие но по делу (1-2 корректных предложения) — totalScore максимум 30..45.
- Только развёрнутые технически точные ответы с терминологией и примерами дают 60+.
- Объективные тесты лайв-кодинга (testsPassed/testsTotal) — это жёсткий сигнал. 0 пройденных из N дают -20 к итогу.
- Прерванное собеседование: totalScore максимум 35.

ФОРМАТ (СТРОГО JSON, без markdown):
{
  "totalScore": <0..100>,
  "verdict": "passed" | "failed",
  "summary": "<3-5 предложений на русском, как фидбек после собеса>",
  "strengths":  ["<коротко>", ...],
  "weaknesses": ["<коротко>", ...],
  "toImprove":  ["<совет>", ...]
}

verdict=passed только при totalScore >= 60. Не жалей кандидата — честная оценка важнее.`;

router.post('/finish', async (req: Request, res: Response) => {
  const sessionId = String(req.body?.sessionId ?? '');
  const session = getSession(sessionId);
  if (!session) return res.status(404).json({ error: 'session_not_found' });

  if (session.finalReport) return res.json(serializeForClient(session));
  if (session.stage !== 'aborted') session.stage = 'finished';

  const qaBlock = session.answers.map((a, i) =>
    `${i + 1}. [${a.topic}] ${a.questionText}\nОтвет кандидата: ${a.userAnswer.slice(0, 600)}`,
  ).join('\n\n');

  const codingBlock = session.coding.map((c, i) =>
    `Задача ${i + 1}: ${c.title} — тесты ${c.testsPassed}/${c.testsTotal}${c.errorSample ? ` (${c.errorSample})` : ''}`,
  ).join('\n');

  const meta = getDirectionMeta(session.direction);
  const aborted = session.stage === 'aborted';
  const unanswered = session.questions.length - session.answers.length;
  const codingMissed = session.codingTasks.length - session.coding.length;

  const userPrompt = `Направление: ${meta.label}. Грейд: ${session.grade}.${aborted ? ' СОБЕСЕДОВАНИЕ ПРЕРВАНО кандидатом.' : ''}
Не ответил на вопросов: ${unanswered}. Не сдал кодинг-задач: ${codingMissed}.

ОТВЕТЫ:
${qaBlock || '(нет ответов)'}

ЛАЙВ-КОДИНГ (объективные тесты):
${codingBlock || '(не было задач)'}

Дай финальную оценку.`;

  let aiOut: any;
  try {
    aiOut = await callJson<{
      totalScore: number;
      verdict: 'passed' | 'failed';
      summary: string;
      strengths: string[];
      weaknesses: string[];
      toImprove: string[];
    }>(FINAL_SYSTEM, userPrompt, 0.25);
  } catch (e: any) {
    console.error('mock/finish ai error', e);
    const codingScore = session.coding.length === 0 ? 0
      : (session.coding.reduce((s, c) => s + (c.testsTotal ? c.testsPassed / c.testsTotal : 0), 0) / session.coding.length) * 100;
    const qaCoverage = session.questions.length === 0 ? 0 : (session.answers.length / session.questions.length) * 100;
    const fallback = Math.round(codingScore * 0.55 + qaCoverage * 0.45);
    aiOut = {
      totalScore: aborted ? Math.min(fallback, 35) : fallback,
      verdict: fallback >= 60 ? 'passed' : 'failed',
      summary: aborted
        ? 'Собеседование было прервано кандидатом. Итог посчитан по факту: автотесты + ответы.'
        : 'Сводка автоматическая (Джарвис недоступен): балл = тесты × 0.55 + покрытие вопросов × 0.45.',
      strengths: [], weaknesses: aborted ? ['прервал собеседование'] : [],
      toImprove: ['пройти ещё раз без прерываний'],
    };
  }

  const totalScore = Math.max(0, Math.min(100, Number(aiOut.totalScore) || 0));
  const r = rankFromScore(totalScore);

  session.finalReport = {
    totalScore,
    rank: r.rank,
    rankLabel: r.label,
    verdict: aiOut.verdict === 'passed' ? 'passed' : 'failed',
    summary: aiOut.summary ?? '',
    strengths:  Array.isArray(aiOut.strengths)  ? aiOut.strengths.slice(0, 4)  : [],
    weaknesses: Array.isArray(aiOut.weaknesses) ? aiOut.weaknesses.slice(0, 4) : [],
    toImprove:  Array.isArray(aiOut.toImprove)  ? aiOut.toImprove.slice(0, 5)  : [],
  };

  res.json(serializeForClient(session));
});

router.get('/session/:id', (req, res) => {
  const session = getSession(req.params.id);
  if (!session) return res.status(404).json({ error: 'session_not_found' });
  res.json(serializeForClient(session));
});

function serializeForClient(s: MockSession) {
  const currentQuestion = s.stage === 'qa' ? s.questions[s.currentQuestionIdx] ?? null : null;
  const currentCoding = s.stage === 'coding' ? s.codingTasks[s.currentCodingIdx] ?? null : null;
  const meta = getDirectionMeta(s.direction);
  return {
    id: s.id,
    direction: s.direction,
    directionLabel: meta.label,
    grade: s.grade,
    stage: s.stage,
    sourceInterviewTitle: s.sourceInterviewTitle,
    durationMs: s.durationMs,
    startedAt: s.startedAt,
    remainingMs: remainingMs(s),
    totalQuestions: s.questions.length,
    totalCoding: s.codingTasks.length,
    answers: s.answers,
    coding: s.coding,
    currentQuestion,
    currentCoding,
    currentQuestionNumber: s.currentQuestionIdx + 1,
    currentCodingNumber: s.currentCodingIdx + 1,
    finalReport: s.finalReport ?? null,
  };
}

export default router;