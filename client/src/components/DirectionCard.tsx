import { Link } from 'react-router-dom';
import { Flame } from 'lucide-react';
import type { Direction } from '../types/api';

type Props = { direction: Direction };

// Карточка направления на главной. Если направление ещё без данных — показывается тускло и некликабельно.
// isFeatured → огонёк в углу (AI Engineer, Reverse Engineer).
export function DirectionCard({ direction }: Props) {
  const isEmpty = direction._count.questions === 0;
  const inner = (
    <div
      className={`
        relative rounded-xl p-4 border transition-all
        ${isEmpty
          ? 'bg-bg-surface/50 border-bg-border opacity-60 cursor-not-allowed'
          : 'bg-bg-surface border-bg-border hover:border-accent-500/50 hover:bg-bg-elevated cursor-pointer'}
      `}
    >
      {direction.isFeatured && (
        <div className="absolute top-3 right-3 text-orange-400" title="Новое направление">
          <Flame size={16} fill="currentColor" />
        </div>
      )}

      <div className="flex items-start gap-3 mb-3">
        <div className={`
          w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm
          ${isEmpty ? 'bg-bg-border text-fg-tertiary' : 'bg-accent-500/10 text-accent-400'}
        `}>
          {direction.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <div className="font-semibold text-fg-primary">{direction.name}</div>
            {isEmpty && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-bg-border text-fg-tertiary font-medium">
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

      <div className="flex gap-3 text-xs text-fg-tertiary pt-3 border-t border-bg-border">
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
