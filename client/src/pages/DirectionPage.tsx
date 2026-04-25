import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Search } from 'lucide-react';
import { api } from '../lib/api';
import { QuestionCard } from '../components/QuestionCard';
import type { Difficulty, QuestionType } from '../types/api';

type FilterState = {
  difficulty: Difficulty | null;  // null = все грейды
  type: QuestionType | null;      // null = все типы
  search: string;
};

// Страница направления с фильтрами по типу вопроса и грейду, плюс поиск.
// Кнопки работают как toggle: клик по активной — сбрасывает фильтр.
// По умолчанию активно "Технические" — это то, зачем пользователь пришёл в первую очередь.
export function DirectionPage() {
  const { slug } = useParams<{ slug: string }>();
  const [filter, setFilter] = useState<FilterState>({
    difficulty: null,
    type: 'TECHNICAL',
    search: '',
  });

  // queryKey включает и difficulty и type — при их смене будет новый запрос с пересчитанными процентами
  const { data, isLoading, error } = useQuery({
    queryKey: ['questions', slug, filter.difficulty, filter.type],
    queryFn: () =>
      api.getDirectionQuestions(slug!, {
        ...(filter.difficulty && { difficulty: filter.difficulty }),
        ...(filter.type && { type: filter.type }),
      }),
    enabled: !!slug,
  });

  // Нормализация для поиска: нижний регистр + ё → е.
  // Решает проблему "Чем/Чём", "все/всё", "ёлка/елка" — люди
  // редко печатают ё на клавиатуре.
  const normalize = (s: string) => s.toLowerCase().replace(/ё/g, 'е');

  // Поиск остаётся клиентским — быстро и не бомбит сервер
  const filtered = useMemo(() => {
    if (!data) return [];
    const s = normalize(filter.search.trim());
    if (!s) return data.questions;
    return data.questions.filter((q) => normalize(q.text).includes(s));
  }, [data, filter.search]);

  // Toggle-хелперы: клик по активному сбрасывает, по неактивному — выбирает
  const toggleType = (t: QuestionType) =>
    setFilter((f) => ({ ...f, type: f.type === t ? null : t }));
  const toggleDifficulty = (d: Difficulty) =>
    setFilter((f) => ({ ...f, difficulty: f.difficulty === d ? null : d }));

  if (isLoading) {
    return <div className="py-24 text-center text-fg-secondary">Загрузка вопросов...</div>;
  }
  if (error || !data) {
    return (
      <div className="py-24 text-center text-fg-secondary">
        Не удалось загрузить направление.
      </div>
    );
  }

  return (
    <>
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-fg-secondary hover:text-fg-primary transition-colors mb-5"
      >
        <ChevronLeft size={16} /> Все направления
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-fg-primary tracking-tight mb-1.5">
          {data.direction.name}
        </h1>
        <p className="text-fg-secondary text-[15px]">
          Вопросы ранжированы по частоте в {data.direction.totalInterviews} реальных интервью
        </p>
      </div>

      {/* Фильтры — без кнопок "Все". Клик по активной сбрасывает фильтр */}
      <div className="space-y-2.5 mb-5">
        {/* Тип */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs text-fg-tertiary font-semibold uppercase tracking-wider w-14">
            Тип
          </span>
          <div className="flex gap-1.5">
            <FilterPill
              label="Технические"
              active={filter.type === 'TECHNICAL'}
              onClick={() => toggleType('TECHNICAL')}
            />
            <FilterPill
              label="Поведенческие"
              active={filter.type === 'BEHAVIORAL'}
              onClick={() => toggleType('BEHAVIORAL')}
            />
          </div>
        </div>

        {/* Грейд */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs text-fg-tertiary font-semibold uppercase tracking-wider w-14">
            Грейд
          </span>
          <div className="flex gap-1.5">
            <FilterPill
              label="Junior"
              active={filter.difficulty === 'JUNIOR'}
              onClick={() => toggleDifficulty('JUNIOR')}
            />
            <FilterPill
              label="Middle"
              active={filter.difficulty === 'MIDDLE'}
              onClick={() => toggleDifficulty('MIDDLE')}
            />
            <FilterPill
              label="Senior"
              active={filter.difficulty === 'SENIOR'}
              onClick={() => toggleDifficulty('SENIOR')}
            />
          </div>
        </div>

        {/* Поиск */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-tertiary" />
          <input
            type="text"
            placeholder="Поиск по вопросу..."
            value={filter.search}
            onChange={(e) => setFilter((f) => ({ ...f, search: e.target.value }))}
            className="w-full glass-subtle rounded-lg
                       pl-9 pr-3 py-2 text-[13px] text-fg-primary placeholder:text-fg-tertiary
                       focus:outline-none focus:bg-white/[0.06] focus:border-accent-400/30 transition-colors"
          />
        </div>
      </div>

      <div className="text-xs text-fg-tertiary mb-3">
        Показано: {filtered.length} из {data.questions.length}
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center text-fg-secondary animate-page-enter">
          По выбранным фильтрам ничего не найдено
        </div>
      ) : (
        // Ключ включает все фильтры: при смене грейда/типа React пересобирает контейнер
        // — и все карточки внутри заново запускают анимацию появления.
        <div
          key={`${filter.type ?? 'all'}-${filter.difficulty ?? 'all'}`}
          className="space-y-2"
        >
          {filtered.map((q, i) => (
            <div
              key={q.id}
              className="animate-fade-in"
              style={{ animationDelay: `${Math.min(i * 15, 200)}ms` }}
            >
              <QuestionCard question={q} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-1.5 rounded-full text-xs font-semibold transition-all
        ${active
          ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-accent-50 ring-1 ring-accent-400/40 shadow-[0_4px_20px_-8px_rgba(109,102,237,0.6)]'
          : 'glass-subtle text-fg-secondary hover:text-fg-primary hover:bg-white/[0.06]'}
      `}
    >
      {label}
    </button>
  );
}
