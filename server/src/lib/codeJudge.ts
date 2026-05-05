// Песочница для кода — Piston API (https://github.com/engineer-man/piston).
// Публичный инстанс: https://emkc.org/api/v2/piston (бесплатный, без ключа).
// Анти-чит: код реально запускается, юзер не видит expected.

const PISTON_BASE = process.env.PISTON_BASE_URL ?? 'https://emkc.org/api/v2/piston';

export type JudgeLanguage = 'python' | 'java' | 'javascript' | 'php';

const VERSIONS: Record<JudgeLanguage, { language: string; version: string; filename: string }> = {
  python:     { language: 'python',     version: '3.10.0',  filename: 'main.py' },
  java:       { language: 'java',       version: '15.0.2',  filename: 'Main.java' },
  javascript: { language: 'javascript', version: '18.15.0', filename: 'main.js' },
  php:        { language: 'php',        version: '8.2.3',   filename: 'main.php' },
};

export interface TestCase {
  stdin: string;
  expected: string;
}

export interface TestResult {
  passed: boolean;
  /** Короткое описание ошибки или причины фейла без выдачи expected */
  reason?: string;
}

export interface JudgeReport {
  passed: number;
  total: number;
  errorSample?: string; // одно короткое сообщение для UI (без expected)
  compileError?: string;
}

async function pistonExecute(language: JudgeLanguage, code: string, stdin: string) {
  const meta = VERSIONS[language];
  const body = {
    language: meta.language,
    version: meta.version,
    files: [{ name: meta.filename, content: code }],
    stdin,
    compile_timeout: 10000,
    run_timeout: 5000,
    compile_memory_limit: -1,
    run_memory_limit: -1,
  };

  const res = await fetch(`${PISTON_BASE}/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Piston HTTP ${res.status}: ${text.slice(0, 200)}`);
  }
  return (await res.json()) as {
    language: string;
    version: string;
    run: { stdout: string; stderr: string; code: number; signal: string | null; output: string };
    compile?: { stdout: string; stderr: string; code: number };
  };
}

function normalize(s: string): string {
  return s.replace(/\r\n/g, '\n').replace(/[ \t]+\n/g, '\n').trim();
}

export async function judgeCode(
  language: JudgeLanguage,
  code: string,
  tests: TestCase[],
): Promise<JudgeReport> {
  if (tests.length === 0) return { passed: 0, total: 0 };

  let passed = 0;
  let errorSample: string | undefined;
  let compileError: string | undefined;

  // Sequential — Piston public has rate-limit ~5 req/sec.
  for (let i = 0; i < tests.length; i++) {
    const t = tests[i];
    try {
      const r = await pistonExecute(language, code, t.stdin);

      if (r.compile && r.compile.code !== 0) {
        compileError = (r.compile.stderr || r.compile.stdout || 'compile error').slice(0, 400);
        if (!errorSample) errorSample = `Ошибка компиляции: ${compileError.slice(0, 160)}`;
        break;
      }

      if (r.run.signal) {
        if (!errorSample) errorSample = `Тест ${i + 1}: процесс убит сигналом ${r.run.signal} (TLE/память?)`;
        continue;
      }
      if (r.run.code !== 0) {
        const stderr = (r.run.stderr || '').slice(0, 200);
        if (!errorSample) errorSample = `Тест ${i + 1}: runtime error${stderr ? ` — ${stderr}` : ''}`;
        continue;
      }

      const actual = normalize(r.run.stdout);
      const expected = normalize(t.expected);
      if (actual === expected) {
        passed++;
      } else if (!errorSample) {
        errorSample = `Тест ${i + 1}: ответ не совпал с ожидаемым`;
      }
    } catch (e: any) {
      if (!errorSample) errorSample = `Песочница недоступна: ${e?.message ?? 'fetch failed'}`;
    }

    // мини-троттлинг
    if (i < tests.length - 1) await new Promise((r) => setTimeout(r, 220));
  }

  return { passed, total: tests.length, errorSample, compileError };
}