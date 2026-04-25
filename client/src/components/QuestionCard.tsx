import { useState, memo } from 'react';
import { ChevronDown, Sparkles, X } from 'lucide-react';
import { DifficultyBadge } from './DifficultyBadge';
import { AiChat } from './AiChat';
import type { Question } from '../types/api';

type Props = { question: Question };

// Карточка вопроса. Открытое состояние показывает эталонный ответ + кнопку "Уточнить у ИИ".
// Кнопка разворачивает встроенный чат с ИИ прямо внутри карточки.
//
// memo() — карточек 600+, без него любой клик пересобирает все.
export const QuestionCard = memo(function QuestionCard({ question }: Props) {
  const [open, setOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const pct = Math.round(question.probability * 100);
  const hasAnswer = question.answer.trim().length > 0;

  // При закрытии карточки также закрываем чат — чтобы не было залипшего состояния
  function toggle() {
    setOpen((v) => {
      if (v) setAiOpen(false);
      return !v;
    });
  }

  return (
    <div className={`
      rounded-xl overflow-hidden transition-all duration-300
      ${open ? 'glass-strong ring-1 ring-accent-400/30' : 'glass-subtle hover:bg-white/[0.04]'}
    `}>
      {/* Шапка — всегда видима */}
      <button
        onClick={toggle}
        className="w-full flex items-start gap-4 p-4 text-left"
      >
        <div className="flex items-center justify-center w-16 flex-shrink-0 pt-0.5">
          <div className="text-2xl font-bold text-gradient leading-none tracking-tight">{pct}%</div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <DifficultyBadge difficulty={question.difficulty} />
            {question.topic && (
              <span className="text-[11px] text-fg-tertiary">{question.topic.name}</span>
            )}
          </div>
          <div className="text-[14px] font-medium text-fg-primary leading-snug">
            {question.text}
          </div>
        </div>

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

          {/* Кнопка "Уточнить у ИИ" / "Свернуть чат" — переключается в зависимости от aiOpen */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {!aiOpen ? (
              <button
                onClick={() => setAiOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold
                           bg-gradient-to-r from-accent-500/20 to-accent-600/15 text-accent-300 hover:text-accent-200
                           hover:from-accent-500/30 hover:to-accent-600/25
                           border border-accent-400/25 px-3 py-1.5 rounded-lg"
              >
                <Sparkles size={14} />
                Уточнить у ИИ
              </button>
            ) : (
              <button
                onClick={() => setAiOpen(false)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold
                           bg-white/[0.04] text-fg-secondary hover:text-fg-primary hover:bg-white/[0.08]
                           border border-white/[0.08] px-3 py-1.5 rounded-lg"
              >
                <X size={14} />
                Свернуть чат
              </button>
            )}
            <span className="text-[11px] text-fg-tertiary">
              Встретился в {question.occurrences} из {question.totalInterviews} интервью
            </span>
          </div>

          {/* Встроенный чат. key={question.id} гарантирует полную переинициализацию
              если карточку каким-то образом переиспользуют под другой вопрос */}
          {aiOpen && (
            <AiChat
              key={question.id}
              question={question}
              onClose={() => setAiOpen(false)}
            />
          )}
        </div>
      )}
    </div>
  );
});
