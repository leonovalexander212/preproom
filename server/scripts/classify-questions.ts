import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

const DIRECTION_SLUG = process.argv[2] ?? 'python';

type QuestionType = 'TECHNICAL' | 'BEHAVIORAL' | 'LOGIC_PUZZLE';

// Маркеры для поведенческих вопросов (HR/soft skills).
// Если хоть одна фраза из этого списка встречается в вопросе — классифицируем как BEHAVIORAL.
const BEHAVIORAL_MARKERS = [
  // Личный опыт
  'расскажите о себе',
  'расскажите о своём',
  'расскажите о своем',
  'расскажите о ваших',
  'расскажите о вашем',
  'расскажите о наиболее',
  'расскажите о самом',
  'расскажите про свой',
  'расскажите про ваш',
  'расскажите про опыт',
  'расскажи о себе',

  // Опыт работы
  'сколько вы работаете',
  'сколько лет опыта',
  'как давно вы',
  'какой у вас опыт',
  'какой у тебя опыт',
  'опыт работы',

  // Проекты
  'наиболее интересных',
  'наиболее сложных',
  'самых сложных проект',
  'самых интересных проект',
  'интересные проекты',
  'сложные проекты',
  'какие проекты',
  'над какими проектами',
  'реализовали самостоятельно',

  // Мотивация
  'почему вы выбрали',
  'почему вы решили',
  'почему ты выбрал',
  'почему ты решил',
  'почему именно',
  'что вас привлекает',
  'что мотивирует',
  'зачем вы',

  // Смена работы
  'почему вы уходите',
  'почему ушли',
  'почему уходите',
  'причина смены',
  'причины ухода',
  'планы на будущее',
  'через 5 лет',
  'где видите себя',

  // Ожидания / зарплата
  'зарплатные ожидания',
  'ожидания по зарплате',
  'размер зарплаты',
  'сколько хотите',

  // Команда / soft skills
  'как вы работаете в команде',
  'работа в команде',
  'конфликт',
  'стресс',
  'как вы справляетесь',
  'сильные стороны',
  'слабые стороны',
  'как вы оцениваете свои',
  'как вы обучаетесь',
  'как изучаете',

  // Общие HR-клише
  'какие технологии и библиотеки вы использовали',
  'какие книги',
  'какие источники',
  'что читаете',
  'как относитесь к',
  'есть ли вопросы',
  'есть ли у вас вопросы',
  'есть вопросы ко мне',
];

// Маркеры для логических задач/загадок (не путать с code-задачками — те технические)
const PUZZLE_MARKERS = [
  'как бы вы взвесили',
  'почему люки',
  'сколько мячей для гольфа',
  'если бы вы были',
  'три лампочки',
  'шарики в коробке',
  'монеты и весы',
];

function classify(text: string): QuestionType {
  const normalized = text.toLowerCase().replace(/\s+/g, ' ').trim();

  for (const marker of PUZZLE_MARKERS) {
    if (normalized.includes(marker)) return 'LOGIC_PUZZLE';
  }
  for (const marker of BEHAVIORAL_MARKERS) {
    if (normalized.includes(marker)) return 'BEHAVIORAL';
  }
  return 'TECHNICAL';
}

async function main() {
  console.log(`\nКлассификация вопросов для "${DIRECTION_SLUG}" (локальные правила)\n`);

  const direction = await prisma.direction.findUnique({ where: { slug: DIRECTION_SLUG } });
  if (!direction) throw new Error(`Направление "${DIRECTION_SLUG}" не найдено`);

  const questions = await prisma.question.findMany({
    where: { directionId: direction.id },
    select: { id: true, text: true },
  });

  console.log(`  Всего вопросов: ${questions.length}`);

  const counts = { TECHNICAL: 0, BEHAVIORAL: 0, LOGIC_PUZZLE: 0 };
  const behavioralSamples: string[] = [];
  const puzzleSamples: string[] = [];

  for (const q of questions) {
    const type = classify(q.text);
    counts[type]++;
    if (type === 'BEHAVIORAL' && behavioralSamples.length < 10) {
      behavioralSamples.push(q.text);
    }
    if (type === 'LOGIC_PUZZLE' && puzzleSamples.length < 5) {
      puzzleSamples.push(q.text);
    }

    await prisma.question.update({
      where: { id: q.id },
      data: { type },
    });
  }

  console.log(`\n  TECHNICAL:    ${counts.TECHNICAL}`);
  console.log(`  BEHAVIORAL:   ${counts.BEHAVIORAL}`);
  console.log(`  LOGIC_PUZZLE: ${counts.LOGIC_PUZZLE}`);

  if (behavioralSamples.length) {
    console.log(`\n  Примеры поведенческих:`);
    behavioralSamples.forEach((s) => console.log(`    - ${s.slice(0, 90)}${s.length > 90 ? '...' : ''}`));
  }
  if (puzzleSamples.length) {
    console.log(`\n  Примеры загадок:`);
    puzzleSamples.forEach((s) => console.log(`    - ${s.slice(0, 90)}${s.length > 90 ? '...' : ''}`));
  }
}

main()
  .catch((e) => {
    console.error('Ошибка:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
