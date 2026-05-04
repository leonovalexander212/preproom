// Роуты для AI Mock Interview. Тон ИИ — строгий техлид, как на реальном собесе.
// Весь LLM-ввод идёт через существующий src/lib/llm.ts (Groq llama-3.3-70b).
//
// Флоу:
//   POST /start           — выбор direction+grade, создаём сессию
//   POST /answer          — пользователь ответил на текущий вопрос, получаем ревью
//   POST /coding          — пользователь сдал решение задачи, получаем ревью+баллы
//   POST /finish          — финализация, собираем итоговый отчёт через LLM
//   GET  /session/:id     — подтянуть полное состояние (для resume)
//   GET  /rate-limit      — сколько интервью осталось на этой неделе
//   GET  /directions      — список направлений (для UI)

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { llm } from '../lib/llm';
import {
  MOCK_BANK,
  getDirectionList,
  pickSessionContent,
  type Direction,
  type Grade,
} from '../lib/mockBank';
import {
  createSession,
  getSession,
  rateLimitStatus,
  tryConsume,
  type MockSession,
  type AnswerRecord,
} from '../lib/mockStore';

const router = Router();

/* ----------------------------- helpers ----------------------------- */

function clientIp(req: Request): string {
  const fwd = (req.headers['x-forwarded-for'] as string) ?? '';
  return fwd.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
}

async function callJson<T = any>(
  systemPrompt: string,
  userPrompt: string,
  temperature = 0.35,
): Promise<T> {
  const res = await llm.client.chat.completions.create({
    model: llm.model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature,
    max_tokens: 900,
    response_format: { type: 'json_object' },
  });
  const raw = res.choices[0]?.message?.content ?? '{}';
  try {
    return JSON.parse(raw) as T;
  } catch {
    // LLM иногда оборачивает в ```json. Подстраиваемся.
    const cleaned = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned) as T;
  }
}

/* ----------------------------- public ----------------------------- */

router.get('/directions', (_req, res) => {
  res.json({
    directions: getDirectionList(),
    grades: ['JUNIOR', 'MIDDLE', 'SENIOR'],
  });
});

router.get('/rate-limit', (req, res) => {
  res.json(rateLimitStatus(clientIp(req)));
});

/* ----------------------------- start ----------------------------- */

const startSchema = z.object({
  direction: z.enum(['frontend', 'java', 'python', 'php', 'csharp']),
  grade: z.enum(['JUNIOR', 'MIDDLE', 'SENIOR']),
});

router.post('/start', (req: Request, res: Response) => {
  const parsed = startSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'bad_request', details: parsed.error.format() });
  }

  const ip = clientIp(req);
  if (!tryConsume(ip)) {
    const status = rateLimitStatus(ip);
    return res.status(429).json({ error: 'rate_limit', ...status });
  }

  const { direction, grade } = parsed.data as { direction: Direction; grade: Grade };
  const { questions, coding } = pickSessionContent(direction, grade);

  const session = createSession({ ip, direction, grade, questions, codingTasks: coding });
  res.json(serializeForClient(session));
});

/* ----------------------------- answer ----------------------------- */

const answerSchema = z.object({
  sessionId: z.string(),
  answer: z.string().min(1).max(5000),
});

const REVIEWER_SYSTEM = `Ты строгий технический интервьюер уровня tech lead из FAANG-подобной компании.
Ты только что задал вопрос и получил ответ кандидата на техническом собесе.

ТВОЯ ЗАДАЧА:
- Оценить ответ строго и по делу, как будто это реальное интервью на оффер.
- Не льсти. Если ответ поверхностный — так и скажи.
- Фокус: техническая точность, глубина, структура, сигналы опытного инженера.

ФОРМАТ ОТВЕТА (СТРОГО JSON, без markdown-обёртки):
{
  "score": <число 0..10>,
  "review": "<2-4 предложения на русском: что зашло, чего не хватило, что уточнил бы на реальном собесе>",
  "flags": ["<короткий тег>", "<короткий тег>"]
}

Теги-флаги (2-3 штуки) — короткие характеристики: "чёткая структура", "поверхностно", "путается в терминах", "сильные примеры", "не хватает глубины", "хорошая типизация" и т.п.`;

router.post('/answer', async (req: Request, res: Response) => {
  const parsed = answerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'bad_request' });

  const session = getSession(parsed.data.sessionId);
  if (!session) return res.status(404).json({ error: 'session_not_found' });
  if (session.stage !== 'qa') return res.status(400).json({ error: 'wrong_stage' });

  const q = session.questions[session.currentQuestionIdx];
  if (!q) return res.status(400).json({ error: 'no_current_question' });

  const userPrompt = `Направление: ${MOCK_BANK[session.direction].label}. Грейд: ${session.grade}.
Тип вопроса: ${q.kind}. Тема: ${q.topic}.
Вопрос: ${q.text}
Ответ кандидата: ${parsed.data.answer}

Оцени ответ.`;

  try {
    const ai = await callJson<{ score: number; review: string; flags: string[] }>(
      REVIEWER_SYSTEM,
      userPrompt,
    );

    const record: AnswerRecord = {
      questionId: q.id,
      questionText: q.text,
      topic: q.topic,
      kind: q.kind,
      userAnswer: parsed.data.answer,
      aiReviewText: ai.review ?? '',
      aiScore: Math.max(0, Math.min(10, Number(ai.score) || 0)),
      aiFlags: Array.isArray(ai.flags) ? ai.flags.slice(0, 3) : [],
    };
    session.answers.push(record);
    session.currentQuestionIdx += 1;

    // Если вопросы закончились — переходим в coding-стадию
    if (session.currentQuestionIdx >= session.questions.length) {
      session.stage = session.codingTasks.length > 0 ? 'coding' : 'finished';
    }

    res.json({
      review: record,
      session: serializeForClient(session),
    });
  } catch (e: any) {
    console.error('mock/answer error', e);
    res.status(500).json({ error: 'ai_failed', message: e?.message });
  }
});

/* ----------------------------- coding ----------------------------- */

const codingSchema = z.object({
  sessionId: z.string(),
  code: z.string().min(1).max(20000),
});

const CODER_REVIEWER_SYSTEM = `Ты строгий технический интервьюер, проверяющий решение задачи на лайв-кодинге.
Не запускай код (ты не можешь). Делай статический разбор:
1) Корректность на edge-кейсах (пустой вход, граничные значения, переполнение).
2) Временная и пространственная сложность.
3) Идиоматичность кода на указанном языке.
4) Читаемость, именование, структура.

ФОРМАТ (СТРОГО JSON):
{
  "score": <0..10>,
  "testsPassed": <целое число>,
  "testsTotal": <целое число>,
  "review": "<3-5 предложений на русском: что работает, какой кейс сломается, что улучшить>"
}

testsTotal всегда 5 (оцени, сколько гипотетических тест-кейсов пройдёт: базовые, пустой вход, крайние значения, нестандартный вход, стресс).`;

router.post('/coding', async (req: Request, res: Response) => {
  const parsed = codingSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'bad_request' });

  const session = getSession(parsed.data.sessionId);
  if (!session) return res.status(404).json({ error: 'session_not_found' });
  if (session.stage !== 'coding') return res.status(400).json({ error: 'wrong_stage' });

  const task = session.codingTasks[session.currentCodingIdx];
  if (!task) return res.status(400).json({ error: 'no_current_task' });

  const userPrompt = `Направление: ${MOCK_BANK[session.direction].label}. Грейд: ${session.grade}.
Задача: ${task.title}
Описание: ${task.description}
Язык: ${task.language}

Код кандидата:
\`\`\`${task.language}
${parsed.data.code}
\`\`\`

Оцени решение.`;

  try {
    const ai = await callJson<{
      score: number; testsPassed: number; testsTotal: number; review: string;
    }>(CODER_REVIEWER_SYSTEM, userPrompt);

    const record = {
      taskId: task.id,
      title: task.title,
      language: task.language,
      userCode: parsed.data.code,
      aiReviewText: ai.review ?? '',
      aiScore: Math.max(0, Math.min(10, Number(ai.score) || 0)),
      testsPassed: Math.max(0, Math.min(5, Number(ai.testsPassed) || 0)),
      testsTotal: Math.max(1, Math.min(10, Number(ai.testsTotal) || 5)),
    };
    session.coding.push(record);
    session.currentCodingIdx += 1;

    if (session.currentCodingIdx >= session.codingTasks.length) {
      session.stage = 'finished';
    }

    res.json({
      review: record,
      session: serializeForClient(session),
    });
  } catch (e: any) {
    console.error('mock/coding error', e);
    res.status(500).json({ error: 'ai_failed', message: e?.message });
  }
});

/* ----------------------------- finish ----------------------------- */

const FINAL_SYSTEM = `Ты строгий технический интервьюер. Сейчас сведёшь разбор всего собеседования в финальный отчёт.

ФОРМАТ (СТРОГО JSON):
{
  "totalScore": <0..100>,
  "verdict": "passed" | "failed",
  "summary": "<3-5 предложений общего впечатления, как будто в ATS>",
  "strengths": ["<короткая фраза>", ...],     // 2-4 пункта
  "weaknesses": ["<короткая фраза>", ...],    // 2-4 пункта
  "toImprove": ["<конкретный совет>", ...],   // 3-5 пунктов, что именно подтянуть
  "skillBreakdown": { "<тема>": <0..100>, ... } // по темам, что встречались в вопросах
}

"passed" ставь только при totalScore >= 60 И ровных оценках по ключевым темам грейда. На джуна планка ниже, на сеньора — выше.`;

router.post('/finish', async (req: Request, res: Response) => {
  const { sessionId } = req.body ?? {};
  if (typeof sessionId !== 'string') return res.status(400).json({ error: 'bad_request' });
  const session = getSession(sessionId);
  if (!session) return res.status(404).json({ error: 'session_not_found' });

  const qaBlock = session.answers.map((a, i) =>
    `${i + 1}. [${a.topic} · ${a.aiScore}/10] ${a.questionText}\nОтвет: ${a.userAnswer.slice(0, 400)}\nРевью: ${a.aiReviewText}`,
  ).join('\n\n');

  const codingBlock = session.coding.map((c, i) =>
    `Задача ${i + 1}: ${c.title} (${c.aiScore}/10, тестов ${c.testsPassed}/${c.testsTotal}).\nРевью: ${c.aiReviewText}`,
  ).join('\n\n');

  const userPrompt = `Направление: ${MOCK_BANK[session.direction].label}. Грейд: ${session.grade}.

РАЗБОР ВОПРОСОВ:
${qaBlock || '(нет ответов)'}

РАЗБОР ЛАЙВ-КОДИНГА:
${codingBlock || '(не было задач)'}

Сформируй финальный отчёт.`;

  try {
    const ai = await callJson<{
      totalScore: number;
      verdict: 'passed' | 'failed';
      summary: string;
      strengths: string[];
      weaknesses: string[];
      toImprove: string[];
      skillBreakdown: Record<string, number>;
    }>(FINAL_SYSTEM, userPrompt, 0.3);

    session.finalReport = {
      totalScore: Math.max(0, Math.min(100, Number(ai.totalScore) || 0)),
      verdict: ai.verdict === 'passed' ? 'passed' : 'failed',
      summary: ai.summary ?? '',
      strengths: Array.isArray(ai.strengths) ? ai.strengths.slice(0, 5) : [],
      weaknesses: Array.isArray(ai.weaknesses) ? ai.weaknesses.slice(0, 5) : [],
      toImprove: Array.isArray(ai.toImprove) ? ai.toImprove.slice(0, 6) : [],
      skillBreakdown: ai.skillBreakdown && typeof ai.skillBreakdown === 'object'
        ? ai.skillBreakdown : {},
    };
    session.stage = 'finished';

    res.json(serializeForClient(session));
  } catch (e: any) {
    console.error('mock/finish error', e);
    res.status(500).json({ error: 'ai_failed', message: e?.message });
  }
});

/* ----------------------------- get session ----------------------------- */

router.get('/session/:id', (req, res) => {
  const session = getSession(req.params.id);
  if (!session) return res.status(404).json({ error: 'session_not_found' });
  res.json(serializeForClient(session));
});

/* ----------------------------- serializer ----------------------------- */

function serializeForClient(s: MockSession) {
  const currentQuestion = s.stage === 'qa' ? s.questions[s.currentQuestionIdx] ?? null : null;
  const currentCoding = s.stage === 'coding' ? s.codingTasks[s.currentCodingIdx] ?? null : null;

  return {
    id: s.id,
    direction: s.direction,
    directionLabel: MOCK_BANK[s.direction].label,
    grade: s.grade,
    stage: s.stage,
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