import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { PrismaClient } from '../../generated/prisma/client';

type Difficulty = 'JUNIOR' | 'MIDDLE' | 'SENIOR';

type ParsedQuestion = {
  text: string;
  timecode: string | null;
  type: 'TECHNICAL' | 'BEHAVIORAL';
};

type ParsedInterview = {
  url: string;
  difficulty: Difficulty;
  questions: ParsedQuestion[];
};

const DIFF_MAP: Record<string, Difficulty> = {
  J: 'JUNIOR',
  M: 'MIDDLE',
  S: 'SENIOR',
};

const DIFF_ORDER: Record<Difficulty, number> = {
  JUNIOR: 0,
  MIDDLE: 1,
  SENIOR: 2,
};

/**
 * Определяет тип вопроса по тексту.
 * Поведенческие вопросы спрашивают о личном опыте, ситуациях, действиях кандидата.
 */
function detectQuestionType(text: string): 'TECHNICAL' | 'BEHAVIORAL' {
  const t = text.toLowerCase().trim();
  const behavioral = [
    /^расскажи(те)?.{0,6}(о\s+(своём|своем|вашем|свой|ваш|своей|вашей|себе))/,
    /^расскажи(те)?\s+.{0,50}(опыт|ситуаци|случа[йе]|команд|конфликт|проект)/,
    /^опиши(те)?\s+(свой|ваш|своё|ваш[еу]?|пример|ситуаци|момент|опыт)/,
    /^приведи(те)?\s+пример/,
    /^как\s+(вы|ты)\s+(справля|работали с|решали|подходили|обрабатывали|взаимодейств|поступ)/,
    /^как\s+(вы|ты)\s+(обычно|как правило)/,
    /^был(а)?\s+ли\s+у\s+(вас|тебя)/,
    /^что\s+(вы|ты)\s+(делали|сделали|предприняли|предпочли)\s/,
    /^как\s+бы\s+(вы|ты)\s/,
    /^(ваш|твой)\s+опыт[\s,]/,
    /^какой\s+(ваш|твой)\s+опыт/,
    /^что\s+для\s+(вас|тебя)\s/,
    /^как\s+(вы|ты)\s+обеспечива/,
    /^как\s+(вы|ты)\s+работаете\s+(в\s+команде|с\s+коллег)/,
  ];
  return behavioral.some(re => re.test(t)) ? 'BEHAVIORAL' : 'TECHNICAL';
}

// Timecode patterns (match group 1 = timecode HH:MM:SS, group 2 = question text):
//   [01:23:45] Question text
const RE_BRACKET   = /^\[(\d{1,2}:\d{2}:\d{2})\]\s+(.+)$/;
//   Question text | 01:23:45
const RE_PIPE      = /^(.+?)\s*\|\s*(\d{1,2}:\d{2}:\d{2})\s*$/;
//   01:23:45 – Question text   (em-dash, en-dash, or regular hyphen)
const RE_DASH_START = /^(\d{1,2}:\d{2}:\d{2})\s*[–—\-]\s*/;
//   01:23:45 Question text   (без разделителя — таймкод и текст разделены только пробелом)
const RE_PLAIN_START = /^(\d{1,2}:\d{2}:\d{2})\s+(\S.*)$/;

/**
 * Splits a single line that may contain multiple "HH:MM:SS – text" fragments.
 * Example: "00:09:38 – Question A 00:11:16 – Question B"
 */
function splitDashLine(line: string): ParsedQuestion[] {
  // Split on whitespace preceding a timecode+(dash or text) pattern
  const parts = line.split(/\s+(?=\d{1,2}:\d{2}:\d{2}\s*(?:[–—\-]|\S))/);
  return parts.map((part): ParsedQuestion | null => {
    // Принимаем и "HH:MM:SS – Текст", и "HH:MM:SS Текст" без разделителя
    const m = part.match(/^(\d{1,2}:\d{2}:\d{2})\s*(?:[–—\-]\s*)?(.+)$/s);
    if (!m) return null;
    const text = m[2].trim();
    return { timecode: m[1], text, type: detectQuestionType(text) };
  }).filter((q): q is ParsedQuestion => q !== null && q.text.length > 0);
}

/**
 * Parses a single line into 0-N questions with optional timecodes.
 * Returns empty array when the line is a section header or noise.
 */
function parseLine(line: string): ParsedQuestion[] {
  if (!line) return [];

  // Pre-clean: убираем markdown-мусор, оставшийся в транскриптах:
  //   "00:37:23** – ..."   → "00:37:23 – ..."
  //   "**Текст?**"         → "Текст?"
  //   "00:06:04 – Что? **" → "00:06:04 – Что?"
  line = line
    .replace(/\*+/g, '')        // убираем все ** где бы они ни были
    .replace(/\s+/g, ' ')       // схлопываем пробелы после удалений
    .trim();
  if (!line) return [];

  // Format 1: [HH:MM:SS] text
  const bracketMatch = line.match(RE_BRACKET);
  if (bracketMatch) {
    const text = bracketMatch[2].trim();
    return [{ timecode: bracketMatch[1], text, type: detectQuestionType(text) }];
  }

  // Format 2: text | HH:MM:SS
  const pipeMatch = line.match(RE_PIPE);
  if (pipeMatch) {
    const text = pipeMatch[1].trim();
    return [{ timecode: pipeMatch[2], text, type: detectQuestionType(text) }];
  }

  // Format 3: HH:MM:SS – text (possibly multiple per line, dash separator)
  if (RE_DASH_START.test(line)) {
    return splitDashLine(line);
  }

  // Format 4: HH:MM:SS text   (без разделителя, текст через пробел).
  // Используем splitDashLine — он умеет оба варианта.
  // Важно: ставим этот случай ПОСЛЕ всех остальных, иначе он перехватит
  // строки вида "[01:02:03] ..." уже распарсенные RE_BRACKET выше.
  if (RE_PLAIN_START.test(line)) {
    return splitDashLine(line);
  }

  // Plain text — keep only if it looks like a real question (ends with ?)
  // This filters out section headers like "Технические вопросы и тайминги",
  // "Python и типы данных", "Алгоритмическая сложность", etc.
  if (line.endsWith('?')) {
    return [{ timecode: null, text: line, type: detectQuestionType(line) }];
  }

  return [];
}

/**
 * Нормализует текст вопроса для сравнения дубликатов:
 * "Что такое Event Loop?" === "что   такое event-loop"
 */
export function normalizeQuestionText(text: string): string {
  return text
    .toLowerCase()
    .replace(/ё/g, 'е')                   // ё → е
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')    // всё кроме букв/цифр/пробелов → пробел
    .replace(/\s+/g, ' ')                  // множественные пробелы → один
    .trim();
}

/**
 * Стандартные интеррогативные префиксы — они не несут смысла,
 * но делают одинаковые по сути вопросы "уникальными":
 *   "Что такое X?" / "Расскажи про X" / "Объясни X" / "Как работает X?"
 * После strip-а все они дают одинаковый ключ "X".
 */
const STRIP_PREFIXES: RegExp[] = [
  /^что\s+такое\s+/,
  /^что\s+это\s+(?:такое\s+)?/,
  /^что\s+(?:вы\s+|ты\s+)?(?:знаешь|знаете)\s+(?:о|об|про)\s+/,
  /^что\s+(?:вы\s+|ты\s+)?понимаете(?:ся)?\s+под\s+/,
  /^что\s+понимаешь\s+под\s+/,
  /^что\s+мы\s+знаем\s+о\s+/,
  /^что\s+можешь\s+сказать\s+(?:о|об|про)\s+/,
  /^что\s+можете\s+сказать\s+(?:о|об|про)\s+/,
  /^расскажи(?:те)?\s+(?:мне\s+|нам\s+)?(?:немного\s+)?(?:о|об|про)\s+/,
  /^расскажи(?:те)?\s+(?:мне\s+|нам\s+)?/,
  /^объясни(?:те)?\s+(?:мне\s+|нам\s+)?(?:что\s+такое\s+|работу\s+|как\s+работает\s+)?/,
  /^опиши(?:те)?\s+(?:что\s+такое\s+|работу\s+|процесс\s+|как\s+работает\s+)?/,
  /^как\s+(?:именно\s+)?работае(?:т|шь|те)\s+/,
  /^как\s+устроен(?:а|о|ы)?\s+/,
  /^как\s+(?:вы\s+)?понимае(?:те|шь)\s+/,
  /^как\s+бы\s+(?:вы\s+|ты\s+)?описал(?:и|а)?\s+/,
  /^какие\s+(?:бывают\s+|существуют\s+|есть\s+|знаешь\s+|ты\s+знаешь\s+|вы\s+знаете\s+)?/,
  /^какой\s+(?:бывает\s+|есть\s+)?/,
  /^какая\s+(?:бывает\s+|есть\s+)?/,
  /^какое\s+(?:бывает\s+|есть\s+)?/,
  /^зачем\s+нуж(?:ен|на|но|ны)\s+/,
  /^зачем\s+(?:использу(?:ется|ются))\s+/,
  /^зачем\s+/,
  /^для\s+чего\s+(?:нуж(?:ен|на|но|ны)|использу(?:ется|ются))\s+/,
  /^для\s+чего\s+/,
  /^в\s+чем\s+(?:разница|отличие|различие)\s+(?:между\s+)?/,
  /^чем\s+отличае(?:тся|шься|тесь)\s+/,
  /^чем\s+отличаются?\s+/,
  /^приведи(?:те)?\s+пример(?:ы)?\s+(?:использования\s+)?/,
  /^дай(?:те)?\s+определение\s+/,
  /^определение\s+/,
  /^знаешь\s+ли\s+ты\s+(?:что\s+такое\s+|о\s+|про\s+|об\s+)?/,
  /^знаете\s+ли\s+вы\s+(?:что\s+такое\s+|о\s+|про\s+|об\s+)?/,
];

const STRIP_TRAILING: RegExp[] = [
  /\s+с\s+примерами?\s*$/,
  /\s+с\s+примером\s*$/,
  /\s+простыми\s+словами\s*$/,
  /\s+своими\s+словами\s*$/,
  /\s+на\s+примере\s*$/,
  /\s+(?:в|на)\s+(?:java|python|javascript|js|php|qa)\s*$/,
  /\s+(?:объясни(?:те)?|расскажи(?:те)?|поясни(?:те)?)\s*$/,
];

/** Слова-шумы — встречаются в любой позиции и не несут смысла */
const NOISE_RE = /\b(?:немного|пожалуйста|вкратце|коротко|кратко|детально|подробно)\b/g;

/**
 * Канонизирует текст вопроса для дедупликации по смыслу.
 * Только БЕЗОПАСНЫЕ преобразования — срезаем интеррогативные обёртки в начале
 * и узкие шаблоны в самом конце. Никогда не вырезаем середину строки —
 * иначе разные вопросы могут сложиться в один (например, и "как и где X"
 * и "как в Y Z" превратились бы в "как").
 *
 *   "Что такое замыкание?"      → "замыкание"
 *   "Расскажи про замыкания"    → "замыкания"
 *   "Объясни замыкание"         → "замыкание"
 *   "Как работает замыкание?"   → "замыкание"
 *
 * Если после канонизации текст слишком короткий (≤ 2 значащих токенов) —
 * откатываемся к полной нормализации, чтобы не схлопнуть несвязанные вопросы
 * с одинаковым ключевым словом.
 */
export function canonicalizeQuestionText(text: string): string {
  let t = normalizeQuestionText(text);
  if (!t) return '';
  const original = t;

  let prev: string;

  // 1) узкие хвосты, всегда в конце строки (`\s*$`) — безопасно
  do {
    prev = t;
    for (const re of STRIP_TRAILING) t = t.replace(re, '');
    t = t.trim();
  } while (t !== prev && t.length > 0);

  // 2) итеративно срезаем интеррогативные префиксы
  do {
    prev = t;
    for (const re of STRIP_PREFIXES) {
      const next = t.replace(re, '');
      if (next !== t) { t = next.trim(); break; }
    }
  } while (t !== prev && t.length > 0);

  // 3) шумовые слова в любой позиции
  t = t.replace(NOISE_RE, ' ').replace(/\s+/g, ' ').trim();

  // 4) Защита от over-merge: если канонизация съела почти всё,
  //    что-то пошло не так — лучше держать оригинал.
  const tokens = t.split(/\s+/).filter(Boolean);
  if (tokens.length < 2) return original;

  return t;
}

// ─── Кластеризация близких по смыслу вопросов ────────────────────────────────
//
// Идея: tokenize → stem → отбросить стоп-слова → для каждой пары вопросов
// считаем Jaccard-сходство множеств стемов. Если ≥ THRESHOLD — объединяем
// в один кластер через Union-Find. Все вопросы из одного кластера получают
// один и тот же дедуп-ключ, и значит, схлопываются в одну запись с общим
// списком таймкодов из всех интервью кластера.
//
// ВАЖНО: для надёжности также требуем минимум 2 общих стема — иначе пары вида
// «X в Java» / «X в Python» (общий только X) могут ложно склеиться.

const STOP_WORDS = new Set<string>([
  'и','или','но','а','не','ни','же','ли','бы','ведь','вот','тоже','также','еще','ещё',
  'в','на','с','со','к','ко','по','до','от','из','за','для','у','о','об','про','перед','после','при',
  'над','под','между','через','без','около','среди','против',
  'кто','что','это','то','как','когда','где','куда','откуда','почему','зачем','если','чем','чему',
  'может','можно','нужно','нужен','нужна','нужны','следует','стоит','стоят',
  'есть','был','была','было','были','будет','буду','будем','будут','быть',
  'я','ты','мы','вы','он','она','оно','они','мне','тебе','нам','вам','нас','вас','их','её','его','ему','ей',
  'свой','своя','своё','свои','мой','моя','моё','мои','твой','твоя','твоё','твои','наш','ваш',
  'этот','эта','эти','тот','та','те','себя','себе','собой',
  'который','которая','которое','которые',
  'тогда','теперь','сейчас','уже','только','просто','очень','много','мало','сколько','несколько',
  'один','одна','одно','одни','каждый','каждая','каждое',
  'какая','какие','какое','какой','какова','каков','такая','такие','такое','такой',
  'другой','другая','другие','другое',
  'основные','основной','основная','основное','главные','главное','главный','главная',
  'опиши','объясни','расскажи','опишите','объясните','расскажите','поясни','поясните',
  'например','примеру','случае','случай','образом',
  'своими','словами','коротко','кратко','подробно','детально','вкратце','немного',
  'между','различие','различия','отличие','отличия','разница',
  'данном','данный','данная','данное','данные','определение','смысл',
]);

/**
 * Очень простой rule-based стеммер для русского — режет частые окончания.
 * Не идеален, но дешёв и не требует словарей.
 */
function stem(word: string): string {
  const w = word.toLowerCase().replace(/ё/g, 'е');
  if (w.length <= 4) return w;
  // Длинные суффиксы пробуем первыми
  const SUFFIXES = [
    'ость','ются','ется','иями','ыми','ими','ого','его','ому','ему','ами','ями',
    'ишь','ешь','ить','еть','ать','ять','ах','ях','ам','ям','ом','ем','ой','ей',
    'ая','яя','ые','ие','ую','юю','ое','ее',
    'ы','и','у','ю','а','я','е','о','й',
  ];
  for (const suf of SUFFIXES) {
    if (w.endsWith(suf) && w.length - suf.length >= 3) {
      return w.slice(0, -suf.length);
    }
  }
  return w;
}

/** Возвращает множество значимых стемов из текста (для Jaccard). */
function extractStems(text: string): Set<string> {
  const normalized = normalizeQuestionText(text);
  return new Set(
    normalized.split(/\s+/)
      .filter(w => w.length >= 3 && !STOP_WORDS.has(w))
      .map(stem)
  );
}

/**
 * Объединяет похожие по смыслу вопросы в кластеры через Union-Find.
 * Возвращает массив cluster-id той же длины, что и вход.
 */
export function clusterSimilarQuestions(
  texts: string[],
  threshold = 0.55,
  minSharedStems = 2,
): number[] {
  const N = texts.length;
  if (N === 0) return [];

  const stemSets = texts.map(extractStems);

  // Инвертированный индекс: стем → индексы вопросов
  const index = new Map<string, number[]>();
  stemSets.forEach((set, i) => {
    for (const s of set) {
      const arr = index.get(s);
      if (arr) arr.push(i); else index.set(s, [i]);
    }
  });

  // Union-Find
  const parent = Array.from({ length: N }, (_, i) => i);
  const find = (x: number): number => {
    while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
    return x;
  };
  const union = (a: number, b: number) => {
    const ra = find(a), rb = find(b);
    if (ra !== rb) parent[ra] = rb;
  };

  for (let i = 0; i < N; i++) {
    const myStems = stemSets[i];
    if (myStems.size < minSharedStems) continue;

    // Кандидаты: j > i с хотя бы одним общим стемом
    const candidates = new Set<number>();
    for (const s of myStems) {
      const arr = index.get(s);
      if (!arr) continue;
      for (const j of arr) if (j > i) candidates.add(j);
    }

    for (const j of candidates) {
      const otherStems = stemSets[j];
      if (otherStems.size < minSharedStems) continue;

      let intersect = 0;
      for (const s of myStems) if (otherStems.has(s)) intersect++;
      if (intersect < minSharedStems) continue;

      const unionSize = myStems.size + otherStems.size - intersect;
      if (intersect / unionSize >= threshold) union(i, j);
    }
  }

  // Сжимаем cluster-id в плотный диапазон 0..K-1
  const idMap = new Map<number, number>();
  return Array.from({ length: N }, (_, i) => {
    const root = find(i);
    let id = idMap.get(root);
    if (id === undefined) { id = idMap.size; idMap.set(root, id); }
    return id;
  });
}

/**
 * Парсит текстовый файл с транскрибациями в структурированный список интервью.
 *
 * @param content         Содержимое файла
 * @param defaultDifficulty  Грейд по умолчанию, когда в файле нет заголовков J:/M:/S:.
 *                           Нужен для файлов вида направления/java/junior.txt.
 */
export function parseInterviewFile(
  content: string,
  defaultDifficulty: Difficulty = 'JUNIOR',
): ParsedInterview[] {
  const lines = content.split('\n').map((l) => l.trim());
  const result: ParsedInterview[] = [];

  let currentDifficulty: Difficulty = defaultDifficulty;
  let currentInterview: ParsedInterview | null = null;
  // Текущая секция — "Технические" или "Поведенческие" — определяется
  // по заголовку-разделу внутри интервью. null = заголовок не встретился,
  // тогда тип определяется регуляркой detectQuestionType.
  let currentSection: 'TECHNICAL' | 'BEHAVIORAL' | null = null;

  const DIFF_HEADER         = /^([JMS]):$/;
  const LANG_HEADER         = /^[A-ZА-Я0-9#/.\s-]+:$/;   // PYTHON:, JAVA:, C#:
  const INTERVIEW_START     = /^(\d+)\)(.*)$/;
  const URL_LINE            = /^https?:\/\//;
  const SEPARATOR           = /^=+$/;
  // Заголовки секций — БЕЗ ":" в конце, в любом регистре, могут содержать пояснения в скобках
  const SECTION_TECHNICAL   = /^(?:техническ(?:ие|их|ого)|technical)[\s,]/i;
  const SECTION_BEHAVIORAL  = /^(?:поведенческ(?:ие|их|ого)|behavioral|soft)[\s,(]/i;

  for (const line of lines) {
    if (!line || SEPARATOR.test(line)) continue;

    // Заголовок уровня: "J:", "M:", "S:"
    const diffMatch = line.match(DIFF_HEADER);
    if (diffMatch) {
      currentDifficulty = DIFF_MAP[diffMatch[1]];
      currentInterview = null;
      currentSection = null;
      continue;
    }

    // Заголовок секции внутри интервью: "Технические вопросы", "Поведенческие вопросы"
    if (SECTION_BEHAVIORAL.test(line)) { currentSection = 'BEHAVIORAL'; continue; }
    if (SECTION_TECHNICAL.test(line))  { currentSection = 'TECHNICAL';  continue; }

    // Заголовок направления: "PYTHON:", "JAVA:" — игнорируем
    if (LANG_HEADER.test(line)) continue;

    // Начало нового интервью: "1)URL" или просто "1)"
    const startMatch = line.match(INTERVIEW_START);
    if (startMatch) {
      const url = startMatch[2].trim();
      currentInterview = {
        url,
        difficulty: currentDifficulty,
        questions: [],
      };
      result.push(currentInterview);
      currentSection = null; // сброс — новое интервью начинается с неизвестной секции
      continue;
    }

    // Отдельная URL-строка после начала интервью
    if (URL_LINE.test(line)) {
      if (currentInterview && !currentInterview.url) {
        currentInterview.url = line;
      }
      continue;
    }

    // Всё остальное — пытаемся распарсить как вопрос(ы)
    if (currentInterview) {
      const parsed = parseLine(line);
      // Если мы внутри явной секции — её тип авторитетнее регулярки,
      // потому что регулярка ловит лишь часть поведенческих формулировок.
      if (currentSection) {
        for (const q of parsed) q.type = currentSection;
      }
      currentInterview.questions.push(...parsed);
    }
  }

  return result;
}

/**
 * Читает файл интервью, парсит и заливает в БД с учётом дедупликации вопросов.
 * Предварительно очищает данные указанного направления.
 *
 * @param prisma
 * @param filePath          Путь к файлу (относительно cwd сервера)
 * @param directionSlug
 * @param defaultDifficulty Грейд по умолчанию для файлов без J:/M:/S: заголовков
 */
export async function seedInterviewFile(
  prisma: PrismaClient,
  filePath: string,
  directionSlug: string,
  defaultDifficulty: Difficulty = 'JUNIOR',
): Promise<void> {
  console.log(`\n📂 Импорт ${filePath} → направление "${directionSlug}"`);

  const direction = await prisma.direction.findUnique({
    where: { slug: directionSlug },
  });
  if (!direction) {
    throw new Error(`Направление "${directionSlug}" не найдено. Сначала seedDirections.`);
  }

  // Очищаем только данные этого направления
  await prisma.interview.deleteMany({ where: { directionId: direction.id } });
  await prisma.question.deleteMany({ where: { directionId: direction.id } });

  // Читаем и парсим файл
  const absolutePath = path.resolve(process.cwd(), filePath);
  const content = await fs.readFile(absolutePath, 'utf-8');
  const interviews = parseInterviewFile(content, defaultDifficulty);
  console.log(`  📋 Найдено интервью: ${interviews.length}`);

  // ─── Этап 1: собираем все канонические ключи направления ───────────────────
  // Один и тот же canonical может встречаться много раз — собираем уникальные.
  const uniqueCanonicals: string[] = [];
  const canonicalIndex   = new Map<string, number>();
  // Для каждого canonical запоминаем самый короткий raw-вариант — он станет
  // отображаемым текстом вопроса (короче = читабельнее).
  const shortestRaw      = new Map<string, string>();

  for (const iw of interviews) {
    if (!iw.url) continue;
    for (const q of iw.questions) {
      const normalized = normalizeQuestionText(q.text);
      if (!normalized) continue;
      const canonical = canonicalizeQuestionText(q.text) || normalized;

      if (!canonicalIndex.has(canonical)) {
        canonicalIndex.set(canonical, uniqueCanonicals.length);
        uniqueCanonicals.push(canonical);
        shortestRaw.set(canonical, q.text);
      } else {
        const prevShortest = shortestRaw.get(canonical)!;
        if (q.text.length < prevShortest.length) shortestRaw.set(canonical, q.text);
      }
    }
  }

  // ─── Этап 2: кластеризуем похожие по смыслу вопросы ───────────────────────
  const clusterIds = clusterSimilarQuestions(uniqueCanonicals, 0.55, 2);

  // Для каждого кластера выбираем представителя — canonical с самым коротким raw,
  // тогда отображаемый текст будет минимально-понятным.
  const clusterRepresentative = new Map<number, string>(); // cluster id → canonical
  for (let i = 0; i < uniqueCanonicals.length; i++) {
    const cid    = clusterIds[i];
    const canon  = uniqueCanonicals[i];
    const myRaw  = shortestRaw.get(canon) ?? canon;
    const repCan = clusterRepresentative.get(cid);
    if (!repCan) {
      clusterRepresentative.set(cid, canon);
    } else {
      const repRaw = shortestRaw.get(repCan) ?? repCan;
      if (myRaw.length < repRaw.length) clusterRepresentative.set(cid, canon);
    }
  }

  // canonical → дедуп-ключ (canonical-представитель кластера)
  const dedupKey = new Map<string, string>();
  for (let i = 0; i < uniqueCanonicals.length; i++) {
    dedupKey.set(uniqueCanonicals[i], clusterRepresentative.get(clusterIds[i])!);
  }

  // Статистика для логов
  const clusterCount = clusterRepresentative.size;
  if (clusterCount < uniqueCanonicals.length) {
    console.log(`  🔗 Кластеризация: ${uniqueCanonicals.length} → ${clusterCount} (-${uniqueCanonicals.length - clusterCount})`);
  }

  // ─── Этап 3: основной цикл — создаём interview, question, interviewQuestion ─
  const questionCache = new Map<string, { id: string; difficulty: Difficulty }>();

  let totalQuestions = 0;
  let totalLinks = 0;
  let skippedNoUrl = 0;

  for (let i = 0; i < interviews.length; i++) {
    const iw = interviews[i];
    if (!iw.url) {
      skippedNoUrl++;
      continue;
    }

    const createdInterview = await prisma.interview.create({
      data: {
        directionId: direction.id,
        title: `${iw.difficulty} интервью #${i + 1}`,
        videoUrl: iw.url,
      },
    });

    for (const { text: rawText, timecode, type: qType } of iw.questions) {
      const normalized = normalizeQuestionText(rawText);
      if (!normalized) continue;

      const canonical = canonicalizeQuestionText(rawText) || normalized;
      const key       = dedupKey.get(canonical) ?? canonical;
      // Отображаемый текст — самый короткий raw из кластера
      const displayText = shortestRaw.get(key) ?? rawText;

      let cached = questionCache.get(key);

      if (!cached) {
        const created = await prisma.question.create({
          data: {
            directionId: direction.id,
            text: displayText,
            normalizedText: key,
            difficulty: iw.difficulty,
            answer: '',
            type: qType,
          },
        });
        cached = { id: created.id, difficulty: iw.difficulty };
        questionCache.set(key, cached);
        totalQuestions++;
      } else if (DIFF_ORDER[iw.difficulty] < DIFF_ORDER[cached.difficulty]) {
        await prisma.question.update({
          where: { id: cached.id },
          data: { difficulty: iw.difficulty },
        });
        cached.difficulty = iw.difficulty;
      }

      try {
        await prisma.interviewQuestion.create({
          data: {
            interviewId: createdInterview.id,
            questionId: cached.id,
            timecode: timecode ?? null,
          },
        });
        totalLinks++;
      } catch {
        // Уже связан — ок (unique constraint)
      }
    }
  }

  console.log(`  ✓ Уникальных вопросов: ${totalQuestions}`);
  console.log(`  ✓ Связей вопрос↔интервью: ${totalLinks}`);
  if (skippedNoUrl) console.log(`  ⚠️  Пропущено без URL: ${skippedNoUrl}`);
}
