import { useEffect, useRef, useState } from 'react';
import { Send, Sparkles, Loader2, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { Question } from '../types/api';

type Props = {
  question: Question;
  onClose: () => void;
};

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Встроенный чат с ИИ внутри раскрытой карточки.
// Появляется при клике "Уточнить у ИИ", закрывается крестиком.
// Стримит ответ ИИ через SSE — текст печатается по словам.
export function AiChat({ question, onClose }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Сохраняем последний запрос на случай ошибки — кнопка "Повторить" вызовет его снова
  const lastRequestRef = useRef<{ text: string; questionId?: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const initRef = useRef(false);

  // При первом монтировании автоматически отправляем "объясни подробно"
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    sendMessage('Объясни этот вопрос подробно — что нужно знать, чтобы ответить хорошо.', question.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Автоскролл к низу при новых чанках
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  // Если компонент размонтируют пока стрим идёт — отменяем fetch
  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  async function sendMessage(text: string, questionId?: string) {
    // Запоминаем запрос для возможного повтора
    lastRequestRef.current = { text, questionId };

    const newUserMsg: ChatMessage = { role: 'user', content: text };
    const newAssistantMsg: ChatMessage = { role: 'assistant', content: '' };

    // Собираем историю из текущего стейта СНАЧАЛА, потом обновляем.
    // Раньше был хак с присваиванием в callback setMessages — это ломается в React Strict Mode,
    // где callback может вызваться дважды, и fullHistory оказывается пустым.
    const fullHistory: ChatMessage[] = [...messages, newUserMsg];
    setMessages([...fullHistory, newAssistantMsg]);

    setStreaming(true);
    setError(null);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch(`${API_URL}/api/ai/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, messages: fullHistory }),
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

      // Парсим SSE-поток: события вида "data: {json}\n\n"
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
              setMessages((prev) => {
                const next = [...prev];
                const last = next[next.length - 1];
                if (last && last.role === 'assistant') {
                  next[next.length - 1] = { ...last, content: last.content + event.content };
                }
                return next;
              });
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
      // Удаляем и пустое сообщение assistant, и то сообщение user, которое не дошло —
      // иначе в истории окажутся два user подряд, и следующий запрос LLM откажёт (400)
      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last?.role === 'assistant' && !last.content) next.pop();
        const newLast = next[next.length - 1];
        if (newLast?.role === 'user') next.pop();
        return next;
      });
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || streaming) return;
    setInput('');
    sendMessage(trimmed);
  }

  return (
    <div className="mt-3 glass rounded-xl overflow-hidden animate-fade-in">
      {/* Шапка с заголовком и крестиком */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 text-xs font-semibold text-accent-300">
          <Sparkles size={13} />
          УТОЧНЕНИЕ У ИИ
        </div>
        <button
          onClick={onClose}
          className="text-fg-tertiary hover:text-fg-primary p-1 -m-1 rounded"
          aria-label="Закрыть чат"
        >
          <X size={16} />
        </button>
      </div>

      {/* Лента сообщений. max-h ограничивает рост — длинные диалоги скроллятся внутри */}
      <div className="max-h-[420px] overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={m.role === 'user'
              ? 'glass-subtle rounded-lg p-3 ml-8 text-[13px] text-fg-primary'
              : 'mr-8 text-[13px] text-fg-primary leading-relaxed'
            }
          >
            {m.role === 'assistant' && !m.content && streaming ? (
              <div className="flex items-center gap-2 text-fg-tertiary">
                <Loader2 size={13} className="animate-spin" />
                <span>Думаю...</span>
              </div>
            ) : m.role === 'assistant' ? (
              <div className="markdown-body">
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>
            ) : (
              m.content
            )}
          </div>
        ))}
        {error && (
          <div className="rounded-lg p-3 text-[12px] text-grade-senior border border-grade-senior/30 bg-grade-senior/5 flex items-center justify-between gap-3">
            <span>{error}</span>
            {lastRequestRef.current && (
              <button
                onClick={() => {
                  const last = lastRequestRef.current!;
                  setError(null);
                  sendMessage(last.text, last.questionId);
                }}
                className="text-[12px] font-semibold text-fg-primary hover:text-accent-300 px-2 py-1 rounded border border-white/[0.1] hover:border-accent-400/30 flex-shrink-0"
              >
                Повторить
              </button>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Поле ввода */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 p-3 border-t border-white/[0.06]"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={streaming ? 'Дождитесь ответа...' : 'Уточнить или задать вопрос...'}
          disabled={streaming}
          className="flex-1 glass-subtle rounded-lg
                     px-3 py-2 text-[13px] text-fg-primary placeholder:text-fg-tertiary
                     focus:outline-none focus:bg-white/[0.06] focus:border-accent-400/30
                     disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={streaming || !input.trim()}
          className="px-3.5 rounded-lg bg-gradient-to-r from-accent-500 to-accent-600
                     text-accent-50 disabled:opacity-40 disabled:cursor-not-allowed
                     hover:from-accent-400 hover:to-accent-500"
          aria-label="Отправить"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
