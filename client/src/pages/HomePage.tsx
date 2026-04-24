import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { DirectionCard } from '../components/DirectionCard';
import type { Direction } from '../types/api';

// Главная страница сайта. Показывает список направлений, сгруппированный по категориям.
export function HomePage() {
  // useQuery сам вызовет api.getDirections при монтировании и закеширует результат.
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

  return (
    <>
      {/* HERO */}
      <section className="text-center pt-10 pb-12">
        <div className="inline-block text-xs text-accent-400 bg-accent-500/10 px-3 py-1 rounded-full mb-5 tracking-wide font-medium">
          БЕТА · апрель 2026
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-fg-primary mb-5 leading-[1.1] tracking-tight">
          Подготовка к техническим<br />собеседованиям по статистике
        </h1>
        <p className="text-fg-secondary max-w-xl mx-auto leading-relaxed text-[15px]">
          Вопросы ранжированы по частоте встречаемости в реальных интервью.
          Сначала изучайте то, что спрашивают чаще всего.
        </p>

        {/* Статистика */}
        <div className="flex items-center justify-center gap-6 mt-9 text-sm text-fg-secondary">
          <div>
            <span className="text-fg-primary font-semibold">{totalQuestions}</span>{' '}вопросов
          </div>
          <div className="w-1 h-1 rounded-full bg-fg-tertiary" />
          <div>
            <span className="text-fg-primary font-semibold">{totalInterviews}</span>{' '}интервью
          </div>
          <div className="w-1 h-1 rounded-full bg-fg-tertiary" />
          <div>
            <span className="text-fg-primary font-semibold">{activeDirections}</span>{' '}направлений
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
                <DirectionCard key={d.id} direction={d} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
