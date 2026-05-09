# PrepRoom

Платформа для подготовки к техническим собеседованиям. Вопросы ранжированы по частоте встречаемости в реальных интервью — пользователь видит, что спросят с наибольшей вероятностью, и начинает подготовку с этого.

## Особенности

- **Статистика на основе реальных интервью.** Вопросы собираются из транскриптов видеособеседований, дедуплицируются с помощью локальных эмбеддингов (multilingual-e5-small) и семантической кластеризации, сортируются по частоте встречаемости.
- **Разделение по грейду и типу.** Junior/Middle/Senior плюс технические и поведенческие вопросы (классификация через эвристики).
- **Контекстный процент вероятности.** При фильтре "Junior" процент считается от Junior-интервью, не от всех — чтобы цифра была осмысленной.
- **Интеграция LLM.** AI-ответы через провайдер-агрегатор.

## Стек

**Backend**
- Node.js + Express + TypeScript
- PostgreSQL + Prisma 7 (с driver adapter `@prisma/adapter-pg`)
- OpenAI SDK (универсальный, baseURL через env)
- Xenova Transformers для локальных embeddings
- Zod для валидации

**Frontend**
- React 19 + TypeScript + Vite
- TanStack Query для серверного стейта
- React Router
- Tailwind CSS (кастомная тёмная палитра)
- Lucide Icons

## Структура

```
interview-platform/
├── server/              # Backend (Express + Prisma)
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seeders/     # Модули для заливки направлений и вопросов
│   │   └── seed.ts
│   ├── src/
│   │   ├── lib/         # Prisma client, OpenRouter client
│   │   ├── routes/      # API endpoints
│   │   └── index.ts
│   ├── scripts/         # Скрипты дедупликации и классификации
│   └── data/            # Сырые транскрипты интервью (.txt)
└── client/              # Frontend (React + Vite)
    └── src/
        ├── components/
        ├── pages/
        ├── lib/
        └── types/
```

## Запуск локально

### Требования
- Node.js 20+
- PostgreSQL 16+
- LLM API key (для AI-фич) — настройте через .env

### 1. Клонирование
```bash
git clone https://github.com/leonovalexander212/interview-platform.git
cd interview-platform
```

### 2. База данных
Создайте БД `interview_platform` в PostgreSQL (через pgAdmin или `createdb`).

### 3. Backend
```bash
cd server
npm install
cp .env.example .env
# Откройте .env и укажите ваш DATABASE_URL и OPENROUTER_API_KEY

npx prisma migrate dev
npx prisma generate
npm run db:seed
npm run dev
```

Сервер поднимется на `http://localhost:4000`.

### 4. Frontend
В другом терминале:
```bash
cd client
npm install
npm run dev
```

Откройте `http://localhost:5173`.

## Скрипты

### Backend
- `npm run dev` — запуск сервера в режиме разработки
- `npm run db:seed` — пересев данных из `data/*.txt`
- `npm run dedupe:analyze <slug> -- --skip-llm` — анализ дубликатов
- `npm run dedupe:apply <slug>` — применение дедупликации
- `npm run classify <slug>` — классификация вопросов по типу (техн./поведенч.)
- `npm run prisma:studio` — GUI для БД

## Пайплайн обработки данных

1. **Транскрибация.** Вопросы из видеособеседований записываются в текстовый файл `data/<direction>.txt` по формату:
   ```
   J:
   1) https://youtube.com/watch?v=xxx
   Что такое GIL?
   Расскажите про замыкания.
   2) https://youtube.com/watch?v=yyy
   ...
   ```

2. **Сидинг.** `npm run db:seed` парсит файл, создаёт интервью и вопросы в БД, базовая дедупликация по нормализованному тексту.

3. **Семантическая дедупликация.** Скрипт `dedupe-analyze` считает эмбеддинги всех вопросов через Xenova multilingual-e5-small (локально, без API), кластеризует их через union-find с порогом косинусной близости 0.92. Результат пишется в JSON для ручной проверки.

4. **Применение.** `dedupe-apply` сливает подтверждённые группы в один канонический вопрос, переносит связи с интервью.

5. **Классификация.** `classify` помечает каждый вопрос как TECHNICAL, BEHAVIORAL или LOGIC_PUZZLE на основе локальных эвристик.

## Архитектурные решения

- **Вероятность не хранится в БД.** Рассчитывается на лету через `COUNT(DISTINCT interview_id) / total` — это защищает от рассинхронизации при добавлении новых интервью.
- **Контекстный знаменатель.** При фильтрации по грейду/типу знаменатель вероятности сужается до интервью, где этот грейд/тип встречается. Иначе все проценты размываются и теряют смысл.
- **Driver adapter в Prisma 7.** Rust-движок отключён, подключение к Postgres идёт через нативный `pg`.
- **Без Docker.** Вся инфраструктура поднимается локально, чтобы упростить онбординг.

## Лицензия

MIT
