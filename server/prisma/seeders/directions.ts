import type { PrismaClient } from '../../generated/prisma/client';

const DIRECTIONS = [
  // Программирование
  { slug: 'python',   name: 'Python',           category: 'Программирование', description: 'Backend, data science, автоматизация',    order: 1,  hasDifficultyLevels: true },
  { slug: 'frontend', name: 'Frontend',         category: 'Программирование', description: 'React, TypeScript, интерфейсы',           order: 2,  hasDifficultyLevels: true },
  { slug: 'java',     name: 'Java',             category: 'Программирование', description: 'Enterprise разработка, Spring',           order: 3,  hasDifficultyLevels: true },
  { slug: 'csharp',   name: 'C# / .NET',        category: 'Программирование', description: 'Корпоративные приложения, игры',          order: 4,  hasDifficultyLevels: true },
  { slug: 'cpp',      name: 'C++',              category: 'Программирование', description: 'Системное программирование, игры',        order: 5,  hasDifficultyLevels: true },
  { slug: 'go',       name: 'Go',               category: 'Программирование', description: 'Высоконагруженные сервисы, микросервисы', order: 6,  hasDifficultyLevels: true },
  { slug: 'rust',     name: 'Rust',             category: 'Программирование', description: 'Системный язык с безопасной памятью',     order: 7,  hasDifficultyLevels: true },
  { slug: 'php',      name: 'PHP',              category: 'Программирование', description: 'Веб-разработка, CMS, бэкенд сайтов',      order: 8,  hasDifficultyLevels: true },
  { slug: 'android',  name: 'Android',          category: 'Программирование', description: 'Kotlin, Java, мобильная разработка',      order: 9,  hasDifficultyLevels: true },
  { slug: 'unity',    name: 'Unity / Game Dev', category: 'Программирование', description: 'Разработка игр на Unity Engine',          order: 10, hasDifficultyLevels: true },
  { slug: '1c',       name: '1C',               category: 'Программирование', description: 'Разработка в платформе 1C',               order: 11, hasDifficultyLevels: true },

  // Инфраструктура
  { slug: 'devops',        name: 'DevOps',        category: 'Инфраструктура', description: 'CI/CD, Docker, Kubernetes, облака',     order: 20, hasDifficultyLevels: true },
  { slug: 'data-engineer', name: 'Data Engineer', category: 'Инфраструктура', description: 'ETL, data pipelines, хранилища данных', order: 21, hasDifficultyLevels: true },

  // Тестирование
  { slug: 'qa',  name: 'QA',            category: 'Тестирование', description: 'Ручное тестирование, чек-листы, баг-репорты', order: 30, hasDifficultyLevels: true },
  { slug: 'aqa', name: 'AQA / Automation', category: 'Тестирование', description: 'Автотесты на Selenium, Playwright, pytest',    order: 31, hasDifficultyLevels: true },

  // Аналитика и менеджмент
  { slug: 'data-science',    name: 'Data Science',        category: 'Аналитика', description: 'ML, статистика, исследование данных',       order: 40, hasDifficultyLevels: false },
  { slug: 'data-analyst',    name: 'Data Analyst',        category: 'Аналитика', description: 'SQL, дашборды, метрики продукта',            order: 41, hasDifficultyLevels: false },
  { slug: 'business-analyst', name: 'Business Analyst',    category: 'Аналитика', description: 'Требования, процессы, постановка задач',    order: 42, hasDifficultyLevels: false },
  { slug: 'product-manager', name: 'Product Manager',     category: 'Аналитика', description: 'Продуктовая стратегия, roadmap, метрики',   order: 43, hasDifficultyLevels: false },

  // Креатив
  { slug: 'seo',       name: 'SEO Specialist', category: 'Креатив', description: 'Поисковая оптимизация, контент, ссылки',    order: 50, hasDifficultyLevels: false },
  { slug: '3d-artist', name: '3D Artist',       category: 'Креатив', description: 'Моделирование, текстурирование, рендер',   order: 51, hasDifficultyLevels: false },

  // Новое и интересное — с огоньком
  { slug: 'ai-engineer',       name: 'AI Engineer',       category: 'Новое', description: 'LLM, RAG, ML-инженерия, продакшн ИИ',    order: 60, hasDifficultyLevels: true,  isFeatured: true },
  { slug: 'reverse-engineer',  name: 'Reverse Engineer',   category: 'Новое', description: 'Анализ бинарников, исследование защит', order: 61, hasDifficultyLevels: true,  isFeatured: true },
];

export async function seedDirections(prisma: PrismaClient): Promise<void> {
  console.log('📁 Обновляем направления...');
  for (const d of DIRECTIONS) {
    await prisma.direction.upsert({
      where: { slug: d.slug },
      update: d,
      create: d,
    });
  }
  console.log(`  ✓ Направлений в БД: ${DIRECTIONS.length}`);
}