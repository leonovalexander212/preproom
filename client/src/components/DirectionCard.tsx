import { Link } from 'react-router-dom';
import { Flame } from 'lucide-react';
import type { Direction } from '../types/api';
import { useReveal } from '../hooks/useReveal';

type Props = { direction: Direction; index?: number };

// Карточка направления на главной — glass-стиль с hover-lift.
// index используется для stagger задержки при появлении.
export function DirectionCard({ direction, index = 0 }: Props) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const isEmpty = direction._count.questions === 0;

  const inner = (
    <div
      ref={ref}
      className={`
        reveal ${visible ? 'is-visible' : ''}
        relative rounded-xl p-4
        ${isEmpty
          ? 'glass-subtle opacity-60 cursor-not-allowed'
          : 'glass card-hover cursor-pointer'}
      `}
      style={{ transitionDelay: visible ? `${Math.min(index * 40, 320)}ms` : '0ms' }}
    >
      {direction.isFeatured && (
        <div className="absolute top-3 right-3 text-orange-400" title="Новое направление">
          <Flame size={16} fill="currentColor" />
        </div>
      )}

      <div className="flex items-start gap-3 mb-3">
        <div className={`
          w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm
          ${isEmpty
            ? 'bg-white/5 text-fg-tertiary'
            : 'bg-gradient-to-br from-accent-500/25 to-accent-600/15 text-accent-300 ring-1 ring-accent-400/20'}
        `}>
          {direction.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <div className="font-semibold text-fg-primary">{direction.name}</div>
            {isEmpty && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-fg-tertiary font-medium border border-white/[0.06]">
                скоро
              </span>
            )}
          </div>
          {direction.description && (
            <div className="text-xs text-fg-secondary leading-snug line-clamp-2">
              {direction.description}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 text-xs text-fg-tertiary pt-3 border-t border-white/[0.06]">
        <span>
          <span className={isEmpty ? 'text-fg-tertiary' : 'text-fg-primary font-semibold'}>
            {direction._count.questions || '—'}
          </span>
          {' '}вопросов
        </span>
        <span>
          <span className={isEmpty ? 'text-fg-tertiary' : 'text-fg-primary font-semibold'}>
            {direction._count.interviews || '—'}
          </span>
          {' '}интервью
        </span>
      </div>
    </div>
  );

  if (isEmpty) return inner;
  return <Link to={`/d/${direction.slug}`}>{inner}</Link>;
}
