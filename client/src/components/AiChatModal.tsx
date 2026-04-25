import { useEffect, useRef, useState } from 'react';
import { X, Send, Sparkles, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { Question } from '../types/api';

type Props = {
  question: Question | null;  // null означает что модалка закрыта
  onClose: () => void;
};

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Модалка-чат с ИИ. Открывается когда передан question, закрывается через onClose.
// Состояние: история сообщений, флаг "генерируется ответ", текст инпута.
export function AiChatModal({ question, onClose }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // При открытии модалки под новый вопрос — сбрасываем чат и автоматически отправляем
  // первое сообщение "Объясни этот вопрос подробно".
  useEffect(() => {
    if (!question) return;
    setMessages([]);
    setError(null);
    setInput('');
    sendMessage('Объясни этот вопрос подробно — что нужно знать, чтобы ответить хорошо.', question.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question?.id]);

  // Автоскролл вниз при новых сообщениях/чанках стрима
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  // Esc закрывает модалку
  useEffect(() => {
    if (!question) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [question, onClose]);

  // Если модалку закрывают пока стрим идёт — отменяем fetch
  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  // Блокируем скролл основной страницы пока модалка открыта
  useEffect(() => {
    if (!question) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [question]);

  async function sendMessage(text: string, questionId?: string) {
    const newUserMsg: ChatMessage = { role: 'user', content: text };
    const newAssistantMsg: ChatMessage = { role: 'assistant', content: '' };

    let fullHistory: ChatMessage[] = [];
    setMessages((prev) => {
      fullHistory = [...prev, newUserMsg];
      return [...fullHistory, newAssistantMsg];
    });

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
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant' && !last.content) return prev.slice(0, -1);
        return prev;
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

  if (!question) return null;

  return (
    <>
      {/* Затемнение фона. Клик по фону закрывает модалку */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 animate-fade-in"
      />

      {/* Модалка по центру */}
      <div
        className="fixed inset-0 z-40 flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          className="glass-strong rounded-2xl w-full max-w-2xl h-[80vh] max-h-[720px]
                     flex flex-col overflow-hidden pointer-events-auto
                     animate-modal-enter shadow-2xl"
        >
          {/* Шапка с вопросом */}
          <header className="flex-shrink-0 p-5 border-b border-white/[0.06]">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-accent-300">
                <Sparkles size={14} />
                УТОЧНЕНИЕ У ИИ
              </div>
              <button
                onClick={onClose}
                className="text-fg-tertiary hover:text-fg-primary p-1 -m-1 rounded"
                aria-label="Закрыть"
              >
                <X size={18} />
              </button>
            </div>
            <div className="text-[14px] text-fg-secondary leading-snug line-clamp-2">
              {question.text}
            </div>
          </header>

          {/* Лента сообщений */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.role === 'user'
                  ? 'glass rounded-xl p-3.5 ml-12 text-[13px] text-fg-primary'
                  : 'mr-12 text-[14px] text-fg-primary leading-relaxed'
                }
              >
                {m.role === 'assistant' && !m.content && streaming ? (
                  <div className="flex items-center gap-2 text-fg-tertiary text-sm">
                    <Loader2 size={14} className="animate-spin" />
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
              <div className="glass rounded-xl p-3.5 text-[13px] text-grade-senior border border-grade-senior/30">
                {error}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Поле ввода */}
          <form
            onSubmit={handleSubmit}
            className="flex-shrink-0 p-4 border-t border-white/[0.06] flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={streaming ? 'Дождитесь ответа...' : 'Уточнить или задать вопрос...'}
              disabled={streaming}
              className="flex-1 glass-subtle rounded-lg
                         px-3.5 py-2.5 text-[13px] text-fg-primary placeholder:text-fg-tertiary
                         focus:outline-none focus:bg-white/[0.06] focus:border-accent-400/30
                         disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={streaming || !input.trim()}
              className="px-4 rounded-lg bg-gradient-to-r from-accent-500 to-accent-600
                         text-accent-50 disabled:opacity-40 disabled:cursor-not-allowed
                         hover:from-accent-400 hover:to-accent-500"
              aria-label="Отправить"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
