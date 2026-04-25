import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { llm } from '../lib/llm';
import { prisma } from '../lib/prisma';

const router = Router();

// Системный промпт задаёт роль "технический собеседующий-наставник"
const SYSTEM_PROMPT = `Ты опытный наставник по подготовке к техническим собеседованиям.
Твоя задача — помогать кандидатам понимать вопросы с интервью и давать чёткие, структурированные объяснения.

Правила ответа:
1. Отвечай по существу, без воды и реверансов
2. Структура: краткая суть → детали → типичные подводные камни → пример если уместен
3. Используй markdown для форматирования (заголовки ##, списки, **жирный** для ключевых терминов)
4. Если в вопросе есть код — показывай примеры
5. Если кандидат уточняет или просит подробнее — углубляйся, не повторяй сказанное
6. Не выдумывай — если чего-то не знаешь, скажи прямо
7. Отвечай на русском языке`;

// Схема для входа: либо первый вопрос (есть questionId — подтянем текст из БД),
// либо последующая реплика в существующем чате (есть messages с историей)
const requestSchema = z.object({
  questionId: z.string().optional(),
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).min(1),
});

router.post('/explain', async (req: Request, res: Response) => {
  try {
    const parsed = requestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid request', details: parsed.error.format() });
    }

    const { questionId, messages } = parsed.data;

    // Если это первое сообщение в чате и передан questionId — обогащаем контекст
    let contextPrefix = '';
    if (questionId && messages.length === 1) {
      const question = await prisma.question.findUnique({
        where: { id: questionId },
        select: { text: true, difficulty: true, type: true },
      });
      if (question) {
        contextPrefix = `Контекст: вопрос с собеседования (${question.difficulty ?? 'без грейда'}, ${question.type}):\n"${question.text}"\n\nВопрос пользователя: `;
      }
    }

    // Подмешиваем контекст в первое сообщение пользователя
    const enrichedMessages = messages.map((m, i) => {
      if (i === 0 && m.role === 'user' && contextPrefix) {
        return { ...m, content: contextPrefix + m.content };
      }
      return m;
    });

    // Настраиваем заголовки для Server-Sent Events (SSE)
    // Фронт сможет получать ответ по словам, как только они генерируются
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    // Запускаем стриминг через универсальный LLM-клиент
    const stream = await llm.client.chat.completions.create({
      model: llm.model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...enrichedMessages,
      ],
      stream: true,
      temperature: 0.4,
      max_tokens: 1500,
    });

    // Прокидываем чанки в SSE-формате на фронт
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content ?? '';
      if (content) {
        res.write(`data: ${JSON.stringify({ type: 'chunk', content })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();
  } catch (error: any) {
    console.error('AI explain error:', error);

    if (!res.headersSent) {
      const status = error?.status === 429 ? 429 : 500;
      return res.status(status).json({
        error: status === 429 ? 'rate_limit' : 'internal_error',
        message: error?.message ?? 'Unknown error',
      });
    }

    res.write(`data: ${JSON.stringify({ type: 'error', message: error?.message ?? 'Stream error' })}\n\n`);
    res.end();
  }
});

export default router;
