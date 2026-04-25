import { useEffect, useRef, useState } from 'react';
import { Sparkles, Loader2, X, RotateCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { Question } from '../types/api';

type Props = {
  question: Question;
  onClose: () => void;
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Одноразовое объяснение от ИИ. Никакого диалога — только ответ на вопрос карточки.
// Это предотвращает prompt injection и не даёт пользователю случайно вытащить
// системный промпт или ключи. Если ответ упал — есть кнопка "Повторить".
export function AiChat({ question, onClose }: Props) {
  const [answer, setAnswer] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Запросить объяснение. Вызывается при монтировании и по кнопке "Повторить".
  async function explain() {
    // Отменяем предыдущий стрим, если был
    abortRef.current?.abort();

    setAnswer('');
    setError(null);
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch(`${API_URL}/api/ai/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: question.id,
          messages: [{
            role: 'user',
            content: 'Объясни этот вопрос подробно — что нужно знать, чтобы ответить хорошо.',
          }],
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data.error === 'rate_limit'
            ? 'ИИ сейчас перегружен. Попробуйте через минуту.'
            : data.message || `Ошибка сервера (${response.status})`
        );
      }

      // Парсим SSE-поток
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const json = line.slice(6).trim();
          if (!json) continue;

          try {
            const event = JSON.parse(json);
            if (event.type === 'chunk') {
              setAnswer((prev) => prev + event.content);
            } else if (event.type === 'error') {
              throw new Error(event.message);
            }
          } catch (e) {
            console.warn('SSE parse error:', e);
          }
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setError(err.message || 'Ошибка соединения');
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }

  // Запускаем при монтировании
  useEffect(() => {
    explain();
    return () => abortRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mt-3 glass rounded-xl overflow-hidden animate-fade-in">
      {/* Шапка */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 text-xs font-semibold text-accent-300">
          <Sparkles size={13} />
          ОБЪЯСНЕНИЕ ОТ ИИ
        </div>
        <button
          onClick={onClose}
          className="text-fg-tertiary hover:text-fg-primary p-1 -m-1 rounded"
          aria-label="Закрыть"
        >
          <X size={16} />
        </button>
      </div>

      {/* Тело ответа */}
      <div className="max-h-[480px] overflow-y-auto p-4">
        {streaming && !answer ? (
          <div className="flex items-center gap-2 text-fg-tertiary text-[13px]">
            <Loader2 size={13} className="animate-spin" />
            <span>Думаю...</span>
          </div>
        ) : error ? (
          <div className="rounded-lg p-3 text-[12px] text-grade-senior border border-grade-senior/30 bg-grade-senior/5 flex items-center justify-between gap-3">
            <span>{error}</span>
            <button
              onClick={explain}
              className="text-[12px] font-semibold text-fg-primary hover:text-accent-300 px-2 py-1 rounded border border-white/[0.1] hover:border-accent-400/30 flex-shrink-0 inline-flex items-center gap-1"
            >
              <RotateCw size={12} /> Повторить
            </button>
          </div>
        ) : (
          <div className="markdown-body text-[13px] text-fg-primary leading-relaxed">
            <ReactMarkdown>{answer}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
