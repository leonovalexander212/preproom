import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { DirectionCard } from '../components/DirectionCard';
import type { Direction } from '../types/api';

// Главная страница. Hero + сетка направлений по категориям.
export function HomePage() {
  const { data: directions, isLoading, error } = useQuery({
    queryKey: ['directions'],
    queryFn: api.getDirections,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-fg-secondary">
        Загрузка...
      </div>
    );
  }

  if (error || !directions) {
    return (
      <div className="text-center py-24 text-fg-secondary">
        Не удалось загрузить направления. Проверь, что сервер запущен на порту 4000.
      </div>
    );
  }

  // Группируем направления по категориям, сохраняя порядок появления
  const byCategory = new Map<string, Direction[]>();
  for (const d of directions) {
    const cat = d.category || 'Прочее';
    if (!byCategory.has(cat)) byCategory.set(cat, []);
    byCategory.get(cat)!.push(d);
  }

  // Считаем общую статистику
  const totalQuestions = directions.reduce((sum, d) => sum + d._count.questions, 0);
  const totalInterviews = directions.reduce((sum, d) => sum + d._count.interviews, 0);
  const activeDirections = directions.filter(d => d._count.questions > 0).length;

  // Общий счётчик для stagger-анимаций (через все категории)
  let cardIndex = 0;

  return (
    <>
      {/* HERO */}
      <section className="text-center pt-12 pb-14">
        <div
          className="inline-block text-[11px] text-accent-300 glass-subtle px-3 py-1 rounded-full mb-6 tracking-wide font-semibold animate-fade-in"
          style={{ animationDelay: '0ms' }}
        >
          БЕТА · АПРЕЛЬ 2026
        </div>
        <h1
          className="text-4xl md:text-5xl font-bold text-fg-primary mb-5 leading-[1.1] tracking-tight animate-fade-in"
          style={{ animationDelay: '80ms' }}
        >
          Подготовка к техническим<br />
          <span className="text-gradient">собеседованиям по статистике</span>
        </h1>
        <p
          className="text-fg-secondary max-w-xl mx-auto leading-relaxed text-[15px] animate-fade-in"
          style={{ animationDelay: '160ms' }}
        >
          Вопросы ранжированы по частоте встречаемости в реальных интервью.
          Сначала изучайте то, что спрашивают чаще всего.
        </p>

        {/* Статистика в glass-пилле */}
        <div
          className="inline-flex items-center gap-6 mt-9 px-6 py-3 rounded-full glass animate-fade-in"
          style={{ animationDelay: '240ms' }}
        >
          <div className="text-sm">
            <span className="text-fg-primary font-bold text-[15px]">{totalQuestions}</span>
            <span className="text-fg-secondary ml-1.5">вопросов</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="text-sm">
            <span className="text-fg-primary font-bold text-[15px]">{totalInterviews}</span>
            <span className="text-fg-secondary ml-1.5">интервью</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="text-sm">
            <span className="text-fg-primary font-bold text-[15px]">{activeDirections}</span>
            <span className="text-fg-secondary ml-1.5">направлений</span>
          </div>
        </div>
      </section>

      {/* КАТЕГОРИИ */}
      <div className="space-y-10">
        {Array.from(byCategory.entries()).map(([category, items]) => (
          <section key={category}>
            <div className="text-xs text-fg-tertiary uppercase tracking-wider mb-3 font-semibold">
              {category}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {items.map((d) => (
                <DirectionCard key={d.id} direction={d} index={cardIndex++} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
