import { useState, memo } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { DifficultyBadge } from './DifficultyBadge';
import type { Question } from '../types/api';

type Props = { question: Question };

// Карточка одного вопроса. Слева — крупный процент вероятности, справа — текст вопроса,
// грейд и опционально топик. При клике раскрывается с эталонным ответом и кнопкой "уточнить у ИИ".
//
// memo() оборачивает компонент и заставляет React перерендерить его только при изменении props.
// Без этого: при клике на любую карточку React пересобирает все 737 карточек — отсюда лаги.
export const QuestionCard = memo(function QuestionCard({ question }: Props) {
  const [open, setOpen] = useState(false);
  const pct = Math.round(question.probability * 100);
  const hasAnswer = question.answer.trim().length > 0;

  return (
    <div className={`
      rounded-xl overflow-hidden transition-all duration-300
      ${open ? 'glass-strong ring-1 ring-accent-400/30' : 'glass-subtle hover:bg-white/[0.04]'}
    `}>
      {/* Шапка — всегда видима, кликабельна */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start gap-4 p-4 text-left"
      >
        {/* Колонка с процентом */}
        <div className="flex items-center justify-center w-16 flex-shrink-0 pt-0.5">
          <div className="text-2xl font-bold text-gradient leading-none tracking-tight">{pct}%</div>
        </div>

        {/* Содержимое */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <DifficultyBadge difficulty={question.difficulty} />
            {question.topic && (
              <span className="text-[11px] text-fg-tertiary">
                {question.topic.name}
              </span>
            )}
          </div>
          <div className="text-[14px] font-medium text-fg-primary leading-snug">
            {question.text}
          </div>
        </div>

        {/* Шеврон */}
        <div className={`text-fg-tertiary mt-1 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
          <ChevronDown size={18} />
        </div>
      </button>

      {/* Раскрытое содержимое */}
      {open && (
        <div className="px-4 pb-4 pl-[5.5rem] animate-fade-in">
          {hasAnswer ? (
            <div className="glass rounded-lg p-4 text-[13px] text-fg-secondary leading-relaxed whitespace-pre-wrap">
              {question.answer}
            </div>
          ) : (
            <div className="glass rounded-lg p-4 text-[13px] text-fg-tertiary italic">
              Эталонный ответ пока не добавлен. Воспользуйтесь кнопкой ниже,
              чтобы получить объяснение от ИИ.
            </div>
          )}

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <button
              className="inline-flex items-center gap-1.5 text-xs font-semibold
                         bg-gradient-to-r from-accent-500/20 to-accent-600/15 text-accent-300 hover:text-accent-200
                         hover:from-accent-500/30 hover:to-accent-600/25
                         border border-accent-400/25 px-3 py-1.5 rounded-lg transition-all"
            >
              <Sparkles size={14} />
              Уточнить у ИИ
            </button>
            <span className="text-[11px] text-fg-tertiary">
              Встретился в {question.occurrences} из {question.totalInterviews} интервью
            </span>
          </div>
        </div>
      )}
    </div>
  );
});
