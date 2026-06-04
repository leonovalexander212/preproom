import "dotenv/config";
import OpenAI from "openai";

/**
 * Отдельный OpenRouter-клиент для скриптов очистки данных
 * (фильтр мусора, дедупликация). Независим от продакшн-LLM (llm.ts),
 * чтобы эксперименты с моделью не влияли на работающий сайт.
 *
 * Модель по умолчанию — google/gemini-2.5-flash.
 * Переопределяется через .env: CLEANUP_MODEL=...
 */

// Ключ нужен только для analyze (вызовы модели). Для apply (удаление по ID) ключ НЕ нужен,
// поэтому не падаем при импорте — проверим непосредственно перед вызовом askJson.
export const cleanupModel = process.env.CLEANUP_MODEL ?? "google/gemini-2.5-flash";

export const ai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY ?? "sk-noop-key-for-apply-only",
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://preproom.ru",
    "X-Title": "PrepRoom Cleanup",
  },
});

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Вызов модели с ретраями на 429/5xx и парсингом JSON из ответа.
 */
export async function askJson<T>(
  prompt: string,
  opts: { temperature?: number; maxRetries?: number; system?: string; model?: string } = {},
): Promise<T | null> {
  const { temperature = 0.1, maxRetries = 4, system, model } = opts;

  const messages: { role: "system" | "user"; content: string }[] = [];
  if (system) messages.push({ role: "system", content: system });
  messages.push({ role: "user", content: prompt });

  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY не задан — нужен для анализа (analyze). Для apply ключ не требуется.');
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await ai.chat.completions.create({
        model: model ?? cleanupModel,
        messages,
        temperature,
      });
      const content = res.choices[0]?.message?.content ?? "";
      const match = content.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (!match) return null;
      return JSON.parse(match[0]) as T;
    } catch (err: any) {
      const status = err?.status ?? 0;
      const retriable =
        status === 429 || status >= 500 || /429|rate|timeout|ECONN/i.test(String(err?.message));
      if (retriable && attempt < maxRetries) {
        const backoff = 1000 * attempt * attempt;
        console.warn(`    ⏳ Ошибка ${status || ""}, ждём ${backoff / 1000}s (попытка ${attempt}/${maxRetries})`);
        await sleep(backoff);
        continue;
      }
      console.warn(`    ⚠️ Запрос не удался: ${err?.message}`);
      return null;
    }
  }
  return null;
}