import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Search } from 'lucide-react';
import { api } from '../lib/api';
import { QuestionCard } from '../components/QuestionCard';
import type { Difficulty, QuestionType } from '../types/api';

type FilterState = {
  difficulty: Difficulty | null;  // null = все грейды
  type: QuestionType | 'ALL';     // ALL = все типы, иначе один тип
  search: string;
};

// Страница направления с двумя рядами фильтров: грейд и тип вопроса, плюс поиск.
// По умолчанию показываем только TECHNICAL — это то, зачем пользователь пришёл в первую очередь.
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
        ...(filter.type !== 'ALL' && { type: filter.type }),
      }),
    enabled: !!slug,
  });

  // Поиск остаётся клиентским — быстро и не бомбит сервер
  const filtered = useMemo(() => {
    if (!data) return [];
    const s = filter.search.trim().toLowerCase();
    if (!s) return data.questions;
    return data.questions.filter((q) => q.text.toLowerCase().includes(s));
  }, [data, filter.search]);

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

      {/* Два ряда фильтров */}
      <div className="space-y-2.5 mb-5">
        {/* Ряд 1: тип вопроса */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs text-fg-tertiary font-semibold uppercase tracking-wider w-14">
            Тип
          </span>
          <div className="flex gap-1.5">
            <FilterPill
              label="Технические"
              active={filter.type === 'TECHNICAL'}
              onClick={() => setFilter((f) => ({ ...f, type: 'TECHNICAL' }))}
            />
            <FilterPill
              label="Поведенческие"
              active={filter.type === 'BEHAVIORAL'}
              onClick={() => setFilter((f) => ({ ...f, type: 'BEHAVIORAL' }))}
            />
            <FilterPill
              label="Все"
              active={filter.type === 'ALL'}
              onClick={() => setFilter((f) => ({ ...f, type: 'ALL' }))}
            />
          </div>
        </div>

        {/* Ряд 2: грейд */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs text-fg-tertiary font-semibold uppercase tracking-wider w-14">
            Грейд
          </span>
          <div className="flex gap-1.5">
            <FilterPill
              label="Все"
              active={filter.difficulty === null}
              onClick={() => setFilter((f) => ({ ...f, difficulty: null }))}
            />
            <FilterPill
              label="Junior"
              active={filter.difficulty === 'JUNIOR'}
              onClick={() => setFilter((f) => ({ ...f, difficulty: 'JUNIOR' }))}
            />
            <FilterPill
              label="Middle"
              active={filter.difficulty === 'MIDDLE'}
              onClick={() => setFilter((f) => ({ ...f, difficulty: 'MIDDLE' }))}
            />
            <FilterPill
              label="Senior"
              active={filter.difficulty === 'SENIOR'}
              onClick={() => setFilter((f) => ({ ...f, difficulty: 'SENIOR' }))}
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
            className="w-full bg-bg-surface border border-bg-border rounded-lg
                       pl-9 pr-3 py-2 text-[13px] text-fg-primary placeholder:text-fg-tertiary
                       focus:outline-none focus:border-accent-500/50 transition-colors"
          />
        </div>
      </div>

      <div className="text-xs text-fg-tertiary mb-3">
        Показано: {filtered.length} из {data.questions.length}
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center text-fg-secondary">
          По выбранным фильтрам ничего не найдено
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((q) => (
            <QuestionCard key={q.id} question={q} />
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
        px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border
        ${active
          ? 'bg-accent-500 border-accent-500 text-accent-50'
          : 'bg-transparent border-bg-border text-fg-secondary hover:text-fg-primary hover:border-fg-tertiary'}
      `}
    >
      {label}
    </button>
  );
}
