// Песочница для кода — LLM-судья (Groq llama-3.3-70b).
// Piston выпилен: публичный endpoint теперь whitelist-only.
// LLM детерминированно прогоняет код в голове по каждому stdin и возвращает JSON.
// Плюсы: бесплатно, 4 языка одинаково, без внешних зависимостей и Docker.

import { llm } from './llm';

export type JudgeLanguage = 'python' | 'java' | 'javascript' | 'php' | 'csharp';

export interface TestCase {
  stdin: string;
  expected: string;
}

export interface JudgeReport {
  passed: number;
  total: number;
  errorSample?: string;
  compileError?: string;
}

const SYSTEM = `Ты — строгий детерминированный интерпретатор кода. Тебе дают язык, код и массив тестов (stdin + expected stdout).
Мысленно выполни код с каждым stdin и сравни его stdout с expected.

Правила сравнения:
- Нормализуй \\r\\n → \\n, обрезай trailing whitespace, делай .trim() обоим сторонам.
- Если строки бит-в-бит равны после нормализации — passed=true.
- Если код синтаксически битый / не компилируется — заполни compileError и все тесты failed.
- Если runtime error — passed=false, в reason короткое описание.

Ответ СТРОГО JSON без markdown:
{
  "compileError": "" | "<описание>",
  "results": [
    {"passed": true|false, "reason": "<пусто если passed, иначе короткая причина>"}
  ]
}

Количество элементов в results = количеству тестов, порядок сохраняется.`;

export async function judgeCode(
  language: JudgeLanguage,
  code: string,
  tests: TestCase[],
): Promise<JudgeReport> {
  if (tests.length === 0) return { passed: 0, total: 0 };

  const testsBlock = tests
    .map(
      (t, i) =>
        `ТЕСТ #${i + 1}\n--- stdin ---\n${t.stdin}\n--- expected stdout ---\n${t.expected}`,
    )
    .join('\n\n');

  const userPrompt = `Язык: ${language}

Код кандидата:
\`\`\`${language}
${code}
\`\`\`

Тесты:
${testsBlock}

Выполни каждый тест и верни JSON по схеме.`;

  try {
    const res = await llm.client.chat.completions.create({
      model: llm.model,
      messages: [
        { role: 'system', content: SYSTEM },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0,
      max_tokens: 1600,
      response_format: { type: 'json_object' },
    });

    const raw = res.choices[0]?.message?.content ?? '{}';
    let data: any;
    try {
      data = JSON.parse(raw);
    } catch {
      const cleaned = raw.replace(/```json|```/g, '').trim();
      data = JSON.parse(cleaned);
    }

    const compileError =
      typeof data.compileError === 'string' && data.compileError.trim()
        ? String(data.compileError).slice(0, 400)
        : undefined;

    if (compileError) {
      return {
        passed: 0,
        total: tests.length,
        compileError,
        errorSample: `Ошибка компиляции: ${compileError.slice(0, 160)}`,
      };
    }

    const results: Array<{ passed: boolean; reason?: string }> = Array.isArray(data.results)
      ? data.results
      : [];

    let passed = 0;
    let errorSample: string | undefined;

    for (let i = 0; i < tests.length; i++) {
      const r = results[i];
      if (r?.passed === true) {
        passed++;
      } else if (!errorSample) {
        const reason = r?.reason ? String(r.reason).slice(0, 160) : 'ответ не совпал с ожидаемым';
        errorSample = `Тест ${i + 1}: ${reason}`;
      }
    }

    return { passed, total: tests.length, errorSample };
  } catch (e: any) {
    console.error('[codeJudge] LLM judge failed:', e?.message);
    return {
      passed: 0,
      total: tests.length,
      errorSample: `AI-раннер недоступен: ${e?.message ?? 'fetch failed'}`,
    };
  }
}