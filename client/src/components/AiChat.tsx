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
      // Удаляем пустое сообщение ассистента, чтобы не висел "пустой пузырёк"
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
          <div className="rounded-lg p-3 text-[12px] text-grade-senior border border-grade-senior/30 bg-grade-senior/5">
            {error}
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
