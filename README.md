
<div align="center">

# 🎯 PrepRoom

### Платформа для подготовки к техническим собеседованиям

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)](https://prisma.io)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Three.js](https://img.shields.io/badge/Three.js-r170-000000?logo=threedotjs&logoColor=white)](https://threejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[![CI](https://github.com/leonovalexander212/preproom/actions/workflows/ci.yml/badge.svg)](https://github.com/leonovalexander212/preproom/actions)
[![Questions](https://img.shields.io/badge/questions-28,000+-brightgreen)](#-данные)
[![Directions](https://img.shields.io/badge/directions-23-blue)](#-направления)

**[🇷🇺 Русский](#-о-проекте)** · **[🇬🇧 English](#-about)**

<br>

<img src="docs/preview-landing.png" alt="PrepRoom Landing" width="100%">

</div>

---

## 🇷🇺 О проекте

**PrepRoom** — open-source платформа, которая помогает разработчикам готовиться к техническим собеседованиям. Вопросы собраны из реальных интервью, ранжированы по частоте встречаемости — ты видишь, что спросят с наибольшей вероятностью, и начинаешь подготовку с этого.

### ✨ Ключевые возможности

- **28,000+ вопросов** из реальных собеседований, сгруппированных по 23 IT-направлениям
- **Mock-интервью с AI** — полная имитация собеседования с оценкой, таймером и античит-системой
- **Coding-задачи** с автоматической проверкой кода
- **AI-ассистент** для объяснения любого вопроса в один клик
- **Вероятность вопроса** — процент рассчитывается по реальной статистике интервью
- **3 грейда** — Junior, Middle, Senior с контекстной статистикой
- **Видеоответы** — прямые ссылки на момент в реальном интервью, где отвечают на вопрос
- **Тёмная и светлая темы** с анимированным 3D-фоном на Three.js
- **Тест «Какое направление выбрать»** — 8 вопросов → рекомендация направления

### 🗂 Направления

<table>
<tr>
<td>🐍 Python</td><td>☕ Java</td><td>🌐 Frontend</td><td>🐘 PHP</td>
</tr>
<tr>
<td>🤖 Android</td><td>⚡ Go</td><td>🦀 Rust</td><td>💜 C#</td>
</tr>
<tr>
<td>⚙️ C++</td><td>🔧 DevOps</td><td>🧪 QA</td><td>🤖 AQA</td>
</tr>
<tr>
<td>📊 Data Science</td><td>📈 Data Analytics</td><td>🏗 Data Engineer</td><td>🧠 AI Engineer</td>
</tr>
<tr>
<td>🎮 Unity</td><td>🎨 3D Artist</td><td>🔍 SEO</td><td>📋 Product Manager</td>
</tr>
<tr>
<td>💼 Business Analyst</td><td>🔓 Reverse Engineer</td><td>🏢 1C</td><td></td>
</tr>
</table>

### 📊 Данные

| Метрика | Значение |
|---------|----------|
| Уникальных вопросов | 28,000+ |
| IT-направлений | 23 |
| Грейдов | 3 (Junior / Middle / Senior) |
| Типов вопросов | 3 (Technical / Behavioral / Logic) |
| Реальных интервью в базе | 1,200+ |
| Видеоответов с таймкодами | 15,000+ |

---

## 🏗 Архитектура

```
┌──────────────────────────────────────────────────────┐
│                    Client (React 19)                  │
│  Vite · React Router · Three.js · react-helmet-async │
├──────────────────────────────────────────────────────┤
│                   nginx (reverse proxy)               │
│               SSL (Let's Encrypt) · gzip             │
├──────────────────────────────────────────────────────┤
│               Server (Express 5 + TypeScript)         │
│  Helmet · Rate Limiter · Zod · Pino · SSE Streaming  │
├──────────────────────────────────────────────────────┤
│              PostgreSQL 16 + Prisma 7                 │
│         28K questions · sessions · rate limits        │
├──────────────────────────────────────────────────────┤
│                   LLM Integration                     │
│            Groq · Ollama · OpenRouter                 │
└──────────────────────────────────────────────────────┘
```

### Структура проекта

```
preproom/
├── client/                  # Frontend (React 19 + Vite)
│   └── src/
│       ├── components/      # NavBar, Footer, AiChat, BackgroundScene
│       ├── pages/           # Landing, Directions, MockInterview...
│       └── lib/             # API client
├── server/                  # Backend (Express 5 + TypeScript)
│   ├── src/
│   │   ├── routes/          # API: directions, questions, interviews, mock, ai
│   │   └── lib/             # prisma, llm, logger, rateLimiter, mockStore
│   ├── prisma/
│   │   ├── schema.prisma    # 8 моделей
│   │   ├── seeders/         # Парсинг и импорт данных
│   │   └── migrations/
│   └── scripts/             # dedupe-analyze, dedupe-apply, classify
├── questions/               # MD coding-задачи по направлениям
├── .github/workflows/       # CI (tests + build)
├── nginx.conf               # Production nginx config
└── ecosystem.config.js      # PM2 config
```

---

## 🚀 Быстрый старт

### Требования

- Node.js 20+
- PostgreSQL 16+
- LLM API key (Groq рекомендуется — бесплатно)

### Установка

```bash
# Клонирование
git clone https://github.com/leonovalexander212/preproom.git
cd preproom

# Backend
cd server
npm install
cp .env.example .env
# Заполните .env: DATABASE_URL, GROQ_API_KEY, MOCK_SIGN_SECRET, CORS_ORIGIN

# БД
npx prisma generate
npx prisma migrate dev

# Сидинг данных
npx tsx prisma/seed.ts

# Запуск сервера
npm run dev
# → http://localhost:4000

# Frontend (новый терминал)
cd ../client
npm install
npm run dev
# → http://localhost:5173
```

---

## 🧪 Тестирование

```bash
# Server (vitest)
cd server && npm test

# Client
cd client && npm test

# TypeScript check
cd server && npx tsc --noEmit
```

---

## 🔧 Пайплайн данных

```
Видеособеседования (YouTube)
        │
        ▼
  Транскрипция в .txt (формат: URL + вопросы + таймкоды)
        │
        ▼
  seed.ts → парсинг, нормализация, базовая дедупликация (стемминг)
        │
        ▼
  dedupe-analyze → эмбеддинги (multilingual-e5-small, локально)
                 → кластеризация (cosine similarity > 0.92)
                 → LLM-подтверждение групп (Ollama/Groq)
        │
        ▼
  dedupe-apply → мерж подтверждённых дубликатов
        │
        ▼
  classify → TECHNICAL / BEHAVIORAL / LOGIC_PUZZLE (эвристики)
        │
        ▼
  28,000+ уникальных вопросов в PostgreSQL
```

---

## 🔒 Безопасность

- **Helmet** — CSP, HSTS, X-Frame-Options, X-Content-Type-Options
- **Rate Limiting** — 15 req/min на AI-эндпоинты, 300/15min глобально
- **Zod-валидация** — все входные данные проверяются на сервере
- **Prompt injection защита** — XML-тегирование user input + серверная валидация LLM output
- **CORS** — строгий origin, падает без CORS_ORIGIN в production
- **Graceful shutdown** — SIGTERM/SIGINT → 10s timeout → clean exit

---

## 📦 Production деплой

```bash
# Build
cd client && npm run build
cd ../server && npx tsc

# PM2
pm2 start ecosystem.config.js
pm2 save

# Nginx + SSL
sudo certbot --nginx -d preproom.ru
```

---

## 🛠 Скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск сервера в dev-режиме |
| `npm run build` | Компиляция TypeScript |
| `npm test` | Запуск тестов (vitest) |
| `npm run db:seed` | Импорт данных из текстовых файлов |
| `npm run dedupe:analyze <slug>` | Анализ дубликатов с эмбеддингами + LLM |
| `npm run dedupe:apply <slug>` | Применение подтверждённых мержей |
| `npm run classify <slug>` | Классификация вопросов по типу |

---

## 🇬🇧 About

**PrepRoom** is an open-source platform for technical interview preparation. Questions are collected from real interviews, ranked by frequency — you see what's most likely to be asked and start preparing from there.

### Key Features

- **28,000+ questions** from real interviews across 23 IT directions
- **AI mock interviews** — full interview simulation with scoring, timer, and anti-cheat system
- **Coding challenges** with automated code evaluation
- **AI assistant** — one-click explanation for any question
- **Question probability** — calculated from real interview statistics
- **3 grades** — Junior, Middle, Senior with contextual stats
- **Video answers** — direct links to the moment in real interviews where the question is answered
- **Dark/Light themes** with animated 3D background (Three.js)

### Tech Stack

**Backend:** Node.js 20 · Express 5 · TypeScript · PostgreSQL 16 · Prisma 7 · Zod · Pino · Helmet

**Frontend:** React 19 · Vite · React Router · Three.js · react-helmet-async

**AI/ML:** Groq · Ollama · OpenRouter · Xenova Transformers (local embeddings)

**Infrastructure:** nginx · PM2 · Let's Encrypt · GitHub Actions CI

---

## 📄 Лицензия / License

[MIT](LICENSE)

---

<div align="center">

**Made with ❤️ for the developer community**

[⬆ Back to top](#-preproom)

</div>
