import "dotenv/config";
import { promises as fs } from "node:fs";
import path from "node:path";
import { prisma } from "../src/lib/prisma";
import { askJson, sleep, cleanupModel } from "./_ai";

/**
 * Фильтр мусорных вопросов.
 *
 * Помечает вопросы, которые НЕ имеют смысла вне контекста видео:
 *  - отсылки к коду/экрану которого не видно ("найди ошибки в этом примере")
 *  - обращения к зрителям ("для тех кто смотрит, объясни...")
 *  - просьбы что-то написать/показать прямо сейчас без самостоятельной темы
 *
 * Работает в 2 прохода:
 *  1. Анализ: батчами шлёт вопросы модели → пишет suggestions JSON.
 *  2. Применение (--apply): удаляет помеченные вопросы (каскадно удаляются
 *     и связи с видео — такие вопросы бесполезны).
 *
 * Запуск:
 *   npm run junk:analyze <slug>          # анализ → data/<slug>-junk.json
 *   npm run junk:analyze <slug> --apply  # анализ + сразу удалить
 *   npm run junk:apply <slug>            # применить готовый json
 */

const SLUG = process.argv.find((a) => !a.startsWith("--") && a !== process.argv[0] && a !== process.argv[1]) ?? "python";
const DO_APPLY = process.argv.includes("--apply");
const APPLY_ONLY = process.argv.includes("--apply-only");
const BATCH_SIZE = 30;
const VERIFY_MODEL = process.env.CLEANUP_VERIFY_MODEL ?? "google/gemini-2.5-pro";
const DELAY_MS = 350;

type JunkVerdict = { junk: number[] }; // индексы (1-based) мусорных вопросов в батче

const SYSTEM = `Ты — аккуратный редактор базы вопросов для собеседований IT.
Твоя задача — находить ТОЛЬКО те вопросы, которые буквально невозможно понять вне видео.
Ты крайне осторожен: удаление необратимо, поэтому при любых сомнениях оставляешь вопрос.`;

function buildPrompt(batch: { text: string }[]): string {
  const list = batch.map((q, i) => `${i + 1}. ${q.text}`).join("\n");
  return `Ниже список вопросов с IT-собеседований. Часть была автоматически нарезана из видео, и отдельные куски невозможно понять на сайте.

Пометь номер вопроса как МУСОР, ТОЛЬКО если выполняется хотя бы одно из ЭТИХ условий:
1. Вопрос ссылается на конкретный код/пример/картинку, которых на сайте НЕТ. Маркеры: "посмотри на этот код", "что выведет данный код", "найди ошибки в этом примере", "в данном куске", "[код ...]".
2. Вопрос обращается к зрителям видео или к ходу беседы: "для тех кто смотрит", "как я уже говорил", "давайте вместе посмотрим", "вернёмся к".
3. Вопрос про КОНКРЕТНОЕ событие именно этого собеседования: "что было в итоге конфликта с тестировщиком", "как прошло сегодняшнее собеседование", "понравилось ли тебе это интервью".
4. Это обрывок/огрызок фразы, начинается или заканчивается на середине, не является цельным предложением (например начинается со скобки ")" или "и выше)").
5. Содержит иероглифы (китайские/японские) или явный мусор.

ОЧЕНЬ ВАЖНО — НЕ помечай мусором (оставляй) такие вопросы:
- Обычные технические вопросы, даже если звучат как сценарий: "Как корректно сравнивать числовые значения в строках?", "Можно ли в имени переменной использовать точку?", "Почему генераторы нельзя обойти повторно?", "Какой SQL-запрос сделать для UPSERT?".
- Поведенческие вопросы (про опыт, мотивацию, себя): "Расскажи о себе", "Расскажи про сложную задачу и как решал", "Какой у тебя основной фреймворк?", "Сталкивался ли ты с метапрограммированием?". Это валидные вопросы (на сайте есть вкладка поведенческих).
- Любой самодостаточный вопрос, который человек поймёт без видео.

Правило: сомневаешься — НЕ помечай. Лучше оставить лишнее, чем удалить нужное.

Вопросы:
${list}

Верни СТРОГО JSON без markdown и пояснений — массив номеров мусорных вопросов:
{"junk": [2, 5, 7]}
Если мусора нет: {"junk": []}`;
}

async function analyze() {
  const direction = await prisma.direction.findUnique({ where: { slug: SLUG } });
  if (!direction) throw new Error(`Направление "${SLUG}" не найдено`);

  const questions = await prisma.question.findMany({
    where: { directionId: direction.id },
    select: { id: true, text: true, _count: { select: { interviewQuestions: true } } },
    orderBy: { createdAt: "asc" },
  });

  console.log(`\n🧹 Фильтр мусора для "${SLUG}" (модель: ${cleanupModel})`);
  console.log(`   Всего вопросов: ${questions.length}`);
  const batches = Math.ceil(questions.length / BATCH_SIZE);
  console.log(`   Батчей по ${BATCH_SIZE}: ${batches}\n`);

  const junk: { id: string; text: string; occurrences: number }[] = [];

  for (let b = 0; b < batches; b++) {
    const slice = questions.slice(b * BATCH_SIZE, (b + 1) * BATCH_SIZE);
    process.stdout.write(`   Батч ${b + 1}/${batches}`);

    const verdict = await askJson<JunkVerdict>(buildPrompt(slice), { system: SYSTEM, temperature: 0 });
    const indices = verdict?.junk ?? [];

    for (const idx of indices) {
      const q = slice[idx - 1];
      if (q) junk.push({ id: q.id, text: q.text, occurrences: q._count.interviewQuestions });
    }
    process.stdout.write(` → мусора: ${indices.length}\n`);
    if (b < batches - 1) await sleep(DELAY_MS);
  }

  // ── Второй проход: умная модель перепроверяет каждый помеченный вопрос в изоляции
  // и спасает нормальные (ложные срабатывания первого прохода).
  console.log(`\n   🔎 Перепроверка ${junk.length} кандидатов моделью ${VERIFY_MODEL}...`);
  const verifiedJunk: typeof junk = [];
  const VB = 20; // батч для верификации
  for (let i = 0; i < junk.length; i += VB) {
    const slice = junk.slice(i, i + VB);
    const list = slice.map((q, k) => `${k + 1}. ${q.text}`).join("\n");
    const prompt = `Эти вопросы — кандидаты на удаление из базы вопросов для подготовки к IT-собеседованиям.
Перепроверь КАЖДЫЙ по отдельности. Верни номер вопроса на удаление, ТОЛЬКО если пользователь сайта НЕ поймёт/не ответит на него без видео или невидимого кода.

УДАЛЯТЬ: ссылки на невидимый код/пример ("посмотри на этот код", "ошибка на строке 13"), вопросы про сам процесс интервью ("как прошло собеседование", "вопросы к компании", "разрешение на запись"), про конкретное событие интервью ("конфликт с тестировщиком"), обрывки фраз, иероглифы/мусор.
НЕ УДАЛЯТЬ: самодостаточные задачи (даже с префиксом [Задача]: "Как написать функцию, которая считает символы без len?"), любые технические вопросы ("Откуда импортировать Callable?", "Есть ли в Django select_or_create?", "Как сделать async-декоратор?"), поведенческие вопросы (про опыт/себя).

Вопросы:
${list}

Верни СТРОГО JSON — номера тех, кого реально надо удалить: {"remove":[...]}`;

    const v = await askJson<{ remove: number[] }>(prompt, { temperature: 0, model: VERIFY_MODEL });
    const rm = v?.remove ?? [];
    for (const idx of rm) { const q = slice[idx - 1]; if (q) verifiedJunk.push(q); }
    process.stdout.write(`   проверено ${Math.min(i + VB, junk.length)}/${junk.length}, подтверждён мусор: ${verifiedJunk.length}\r`);
    if (i + VB < junk.length) await sleep(DELAY_MS);
  }
  console.log(`\n   После перепроверки осталось мусора: ${verifiedJunk.length} (спасено: ${junk.length - verifiedJunk.length})`);
  junk.length = 0;
  junk.push(...verifiedJunk);


  const dataDir = path.resolve(process.cwd(), "data");
  await fs.mkdir(dataDir, { recursive: true });
  const outPath = path.join(dataDir, `${SLUG}-junk.json`);
  await fs.writeFile(
    outPath,
    JSON.stringify({ slug: SLUG, total: questions.length, junk }, null, 2),
    "utf-8",
  );

  console.log(`\n   Найдено мусора: ${junk.length} из ${questions.length}`);
  console.log(`   💾 Список записан в ${outPath}`);
  console.log(`   ⚠️  ПРОВЕРЬ файл глазами, удали из него ложные срабатывания, потом примени.\n`);
  return junk.map((j) => j.id);
}

async function apply(ids?: string[]) {
  let toDelete = ids;
  if (!toDelete) {
    const inPath = path.resolve(process.cwd(), "data", `${SLUG}-junk.json`);
    const parsed = JSON.parse(await fs.readFile(inPath, "utf-8")) as { junk: { id: string }[] };
    toDelete = parsed.junk.map((j) => j.id);
  }
  if (!toDelete.length) {
    console.log("   Нечего удалять.");
    return;
  }

  console.log(`\n🗑️  Удаляю ${toDelete.length} мусорных вопросов (каскадно удалятся и связи с видео)...`);
  const res = await prisma.question.deleteMany({ where: { id: { in: toDelete } } });
  console.log(`   ✓ Удалено: ${res.count}\n`);
}

async function main() {
  if (APPLY_ONLY) {
    await apply();
    return;
  }
  const ids = await analyze();
  if (DO_APPLY) await apply(ids);
}

main()
  .catch((e) => {
    console.error("❌ Ошибка:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
