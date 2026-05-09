/**
 * Тест античит-системы — запуск:  npx tsx scripts/test-anticheat.ts
 *
 * Проверяет detectAiMarkers() на разных входных данных:
 *   ✓ чистые ответы → не читер
 *   ✓ AI-самоотнесения → читер
 *   ✓ AI-фразы → читер
 *   ✓ zero-width символы → читер
 *   ✓ смешанные кейсы
 */

/* ---- копия паттернов и логики из routes/mock.ts ---- */

interface AnswerRecord {
  questionId: string;
  questionText: string;
  topic: string;
  userAnswer: string;
}

interface AntiCheatResult {
  cheaterDetected: boolean;
  flaggedAnswers: number[];
  markerCount: number;
}

const ZERO_WIDTH_RE = /[​‌‍﻿⁠⁡⁢⁣⁤­͏؜ᅟᅠ឴឵᠎ -‏‪-‮⁦-⁩￹-￻]/;

const AI_SELF_REF_PATTERNS = [
  /(?:^|\s)я\s*(—|-)?\s*(языковая\s+модель|ии|искусственный\s+интеллект|нейросеть|чат-?бот)/i,
  /\bas\s+an?\s+(ai|language\s+model|llm|chatbot|assistant)\b/i,
  /\bi'?m\s+an?\s+(ai|language\s+model|llm|chatbot)\b/i,
  /(?:^|\s)как\s+(языковая\s+модель|ии(?:\s|,|\.)|нейросеть)/i,
  /(?:^|\s)будучи\s+(языковой\s+моделью|ии(?:\s|,|\.)|нейросетью)/i,
];

const AI_PHRASE_PATTERNS = [
  /(?:^|\s)рад\s+помочь.*вопрос/i,
  /(?:^|\s)надеюсь,?\s+(это\s+)?(поможет|помогло|было\s+полезно)/i,
  /(?:^|\s)если\s+(у\s+вас\s+)?есть\s+(ещё\s+)?вопросы.*обращайтесь/i,
  /(?:^|\s)не\s+стесняйтесь\s+задавать/i,
  /(?:^|\s)обращайтесь,?\s+если/i,
  /(?:^|\s)с\s+удовольствием\s+(отвечу|помогу|объясню)/i,
  /(?:^|\s)давайте\s+разберём\s+это\s+подробнее/i,
  /(?:^|\s)конечно!?\s+давайте\s+разбер/i,
  /(?:^|\s)отличный\s+вопрос!/i,
  /(?:^|\s)хороший\s+вопрос!/i,
  /\bI'?d\s+be\s+happy\s+to\s+(help|explain|assist)/i,
  /\blet\s+me\s+break\s+(this|it)\s+down/i,
  /\bhere'?s?\s+a\s+(comprehensive|detailed)\s+(overview|explanation|breakdown)/i,
  /\b(great|excellent|good)\s+question!/i,
  /\bfeel\s+free\s+to\s+ask/i,
];

const AI_FORMAT_PATTERNS = [
  /[\u{1F4A1}\u{1F4DD}\u{1F4CC}\u{1F4A5}\u{1F4DA}\u{2705}\u{274C}\u{1F525}\u{1F680}\u{1F4AF}\u{1F522}\u{1F4D6}\u{1F4D8}\u{1F4D7}\u{2B50}\u{1F50D}\u{26A0}\u{2728}\u{1F3AF}\u{1F449}\u{1F4E2}\u{1F5C3}\u{1F4C8}\u{1F4CA}\u{1F4B0}\u{1F4CE}\u{1F4CB}\u{1F517}\u{1F914}\u{1F9E0}]/u,
  /#{2,}\s+\S/,
  /\*{2}.+?\*{2}/,
  /```[\s\S]{0,10}\n/,
];

function detectAiMarkers(answers: AnswerRecord[]): AntiCheatResult {
  const flagged: number[] = [];
  let totalMarkers = 0;

  answers.forEach((a, idx) => {
    const text = a.userAnswer;
    let markers = 0;

    if (ZERO_WIDTH_RE.test(text)) {
      const zwCount = (text.match(new RegExp(ZERO_WIDTH_RE.source, 'g')) || []).length;
      if (zwCount >= 2) markers += zwCount;
    }

    for (const re of AI_SELF_REF_PATTERNS) {
      if (re.test(text)) markers += 3;
    }

    for (const re of AI_PHRASE_PATTERNS) {
      if (re.test(text)) markers += 2;
    }

    let fmtHits = 0;
    for (const re of AI_FORMAT_PATTERNS) {
      if (re.test(text)) fmtHits++;
    }
    if (fmtHits >= 2) markers += fmtHits * 2;

    if (markers > 0) {
      flagged.push(idx + 1);
      totalMarkers += markers;
    }
  });

  return {
    cheaterDetected: flagged.length >= 2 || totalMarkers >= 4,
    flaggedAnswers: flagged,
    markerCount: totalMarkers,
  };
}

/* ---- утилиты для тестов ---- */

function makeAnswer(text: string, idx = 0): AnswerRecord {
  return { questionId: `q${idx}`, questionText: `Вопрос ${idx + 1}`, topic: 'test', userAnswer: text };
}

let passed = 0;
let failed = 0;

function assert(label: string, result: AntiCheatResult, expected: { cheater: boolean; flaggedCount?: number }) {
  const ok =
    result.cheaterDetected === expected.cheater &&
    (expected.flaggedCount === undefined || result.flaggedAnswers.length === expected.flaggedCount);

  if (ok) {
    passed++;
    console.log(`  ✅ ${label}`);
  } else {
    failed++;
    console.log(`  ❌ ${label}`);
    console.log(`     ожидали: cheater=${expected.cheater}${expected.flaggedCount !== undefined ? `, flagged=${expected.flaggedCount}` : ''}`);
    console.log(`     получили: cheater=${result.cheaterDetected}, flagged=[${result.flaggedAnswers}], markers=${result.markerCount}`);
  }
}

/* ---- тесты ---- */

console.log('\n🧪 ТЕСТ АНТИЧИТ-СИСТЕМЫ\n');

console.log('── Чистые ответы (не должны флагаться) ──');

assert(
  'Короткий технический ответ',
  detectAiMarkers([
    makeAnswer('GIL — это глобальная блокировка интерпретатора в CPython, которая не даёт потокам выполняться параллельно.'),
    makeAnswer('Замыкание — это функция, которая запоминает переменные из внешней области видимости.'),
    makeAnswer('List comprehension — синтаксический сахар для создания списков.'),
  ]),
  { cheater: false, flaggedCount: 0 },
);

assert(
  'Развёрнутый ответ с примерами кода',
  detectAiMarkers([
    makeAnswer('Декоратор — это функция-обёртка. Пример: def my_decorator(func): def wrapper(*args): print("before"); result = func(*args); print("after"); return result; return wrapper'),
    makeAnswer('async/await — синтаксис для асинхронного кода. asyncio.run(main()) запускает event loop.'),
  ]),
  { cheater: false, flaggedCount: 0 },
);

assert(
  'Ответ "не знаю" (глупый, но не читерский)',
  detectAiMarkers([
    makeAnswer('не знаю'),
    makeAnswer('хз'),
    makeAnswer('123'),
  ]),
  { cheater: false, flaggedCount: 0 },
);

console.log('\n── AI-самоотнесения (должны флагаться) ──');

assert(
  'Прямое "я — языковая модель"',
  detectAiMarkers([
    makeAnswer('Как языковая модель, я могу объяснить что GIL это...'),
    makeAnswer('Я — искусственный интеллект, и вот как я это понимаю...'),
  ]),
  { cheater: true, flaggedCount: 2 },
);

assert(
  'Английское "as an AI assistant"',
  detectAiMarkers([
    makeAnswer('As an AI language model, I can explain that GIL stands for Global Interpreter Lock'),
    makeAnswer('I\'m an AI assistant, let me help with this'),
  ]),
  { cheater: true, flaggedCount: 2 },
);

assert(
  'Одно самоотнесение (недостаточно для читера если маркеров мало)',
  detectAiMarkers([
    makeAnswer('Как языковая модель... Ну ладно, GIL блокирует потоки.'),
    makeAnswer('Замыкание сохраняет контекст.'),
  ]),
  { cheater: false, flaggedCount: 1 },
);

console.log('\n── AI-фразы (должны флагаться) ──');

assert(
  'Характерные фразы ChatGPT — "надеюсь помогло" + "отличный вопрос"',
  detectAiMarkers([
    makeAnswer('GIL — глобальная блокировка. Надеюсь, это помогло!'),
    makeAnswer('Отличный вопрос! Декораторы в Python это...'),
    makeAnswer('Обращайтесь, если будут ещё вопросы!'),
  ]),
  { cheater: true },
);

assert(
  '"Let me break this down" + "feel free to ask"',
  detectAiMarkers([
    makeAnswer('Let me break this down for you. GIL is...'),
    makeAnswer('Here\'s a comprehensive overview of decorators...'),
    makeAnswer('Feel free to ask if you need more details'),
  ]),
  { cheater: true },
);

assert(
  'Одна AI-фраза среди нормальных ответов (не читер)',
  detectAiMarkers([
    makeAnswer('GIL — блокировка потоков в CPython.'),
    makeAnswer('Хороший вопрос! Ну, декоратор это обёртка.'),
    makeAnswer('Замыкание запоминает контекст.'),
  ]),
  { cheater: false, flaggedCount: 1 },
);

console.log('\n── Zero-width символы ──');

assert(
  'Несколько zero-width символов в ответах',
  detectAiMarkers([
    makeAnswer('GIL​ — ​глобальная​ блокировка​ интерпретатора'),
    makeAnswer('Декоратор​ —​ это​ функция-обёртка'),
  ]),
  { cheater: true, flaggedCount: 2 },
);

assert(
  'Один zero-width символ (допустимо — может попасть случайно)',
  detectAiMarkers([
    makeAnswer('GIL​ — глобальная блокировка'),
    makeAnswer('Декоратор — функция-обёртка'),
  ]),
  { cheater: false, flaggedCount: 0 },
);

console.log('\n── Смешанные кейсы ──');

assert(
  'AI-фраза + zero-width в одном ответе = один ответ, но много маркеров → читер',
  detectAiMarkers([
    makeAnswer('Отличный вопрос!​​ Надеюсь,​ это​ помогло!'),
    makeAnswer('Замыкание сохраняет контекст.'),
  ]),
  { cheater: true, flaggedCount: 1 },
);

assert(
  'AI-самоотнесение + AI-фраза в разных ответах',
  detectAiMarkers([
    makeAnswer('Как языковая модель, я объясню: GIL это блокировка потоков'),
    makeAnswer('Декоратор — обёртка. Не стесняйтесь задавать вопросы!'),
    makeAnswer('Замыкание — функция с контекстом.'),
  ]),
  { cheater: true, flaggedCount: 2 },
);

console.log('\n── Форматирование ChatGPT ──');

assert(
  'Эмодзи + markdown заголовки (типичный вывод ChatGPT)',
  detectAiMarkers([
    makeAnswer('🔢 Десятичная система\n\n## Основание: 10\n\nЦифры: 0–9\n\nПример:\n345 = 3×100 + 4×10 + 5×1'),
    makeAnswer('Замыкание — функция с контекстом.'),
  ]),
  { cheater: true, flaggedCount: 1 },
);

assert(
  'Эмодзи + bold markdown в одном ответе',
  detectAiMarkers([
    makeAnswer('✅ **Главная идея:** система счисления определяет, сколько цифр используется и какое значение имеет их позиция.'),
    makeAnswer('GIL блокирует потоки.'),
  ]),
  { cheater: true, flaggedCount: 1 },
);

assert(
  'Только одна эмодзи без другого форматирования (не читер)',
  detectAiMarkers([
    makeAnswer('GIL 👍 блокирует потоки.'),
    makeAnswer('Декоратор — обёртка.'),
  ]),
  { cheater: false, flaggedCount: 0 },
);

assert(
  'Множество ответов с ChatGPT форматированием',
  detectAiMarkers([
    makeAnswer('🔢 **Десятичная система**\n\nОснование: 10'),
    makeAnswer('💡 **Двоичная система**\n\n## Основание: 2'),
    makeAnswer('Замыкание — функция.'),
  ]),
  { cheater: true, flaggedCount: 2 },
);

assert(
  '15 чистых ответов — нет ложных срабатываний',
  detectAiMarkers(
    Array.from({ length: 15 }, (_, i) =>
      makeAnswer(`Ответ на вопрос ${i + 1}: это технический термин, означающий...`, i),
    ),
  ),
  { cheater: false, flaggedCount: 0 },
);

/* ---- итог ---- */

console.log(`\n${'═'.repeat(50)}`);
console.log(`  Результат: ${passed} passed, ${failed} failed из ${passed + failed}`);
console.log(`${'═'.repeat(50)}\n`);

process.exit(failed > 0 ? 1 : 0);
