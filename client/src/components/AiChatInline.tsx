import { useEffect, useRef, useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

type Props = {
  questionId: string;
  // Когда чат закрывается — родитель может почистить состояние, но обычно не нужно
  onCollapse?: () => void;
};

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Inline-чат с ИИ, который встраивается внутрь раскрытой карточки вопроса.
// При первом монтировании сам отправляет первый запрос "объясни этот вопрос".
// Стримит ответ через SSE, поддерживает дальнейшие уточняющие вопросы.
export function AiChatInline({ questionId }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // useRef-флаг защищает от двойного запуска первого сообщения в React StrictMode
  // (там useEffect намеренно вызывается дважды для проверки идемпотентности)
  const initialSentRef = useRef(false);

  useEffect(() => {
    if (initialSentRef.current) return;
    initialSentRef.current = true;
    sendMessage('Объясни этот вопрос подробно — что нужно знать, чтобы ответить хорошо.');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Отменяем активный fetch при размонтировании
  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  // Автоскролл к концу диалога при новых чанках стрима
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages]);

  async function sendMessage(text: string) {
    // ВАЖНО: на сервер шлём только реплики с непустым content.
    // Используем функциональный setter и собираем "чистую" историю через колбэк.
    const userMsg: ChatMessage = { role: 'user', content: text };

    // 1) Добавляем сообщение пользователя сразу
    setMessages((prev) => [...prev, userMsg]);

    // 2) Готовим payload с актуальной историей: возьмём из state.
    //    Используем небольшой трюк — забираем актуальное состояние через колбэк.
    let payload: ChatMessage[] = [];
    setMessages((prev) => {
      payload = prev.filter((m) => m.content.trim().length > 0);
      // Также добавляем пустой assistant-плейсхолдер для стрима (он остаётся в UI, но не уйдёт на сервер)
      return [...prev, { role: 'assistant', content: '' }];
    });

    setStreaming(true);
    setError(null);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch(`${API_URL}/api/ai/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId,
          messages: payload,  // только заполненные реплики
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        let errMsg = `Ошибка сервера (${response.status})`;
        try {
          const data = await response.json();
          if (data?.error === 'rate_limit') errMsg = 'ИИ перегружен. Попробуйте через минуту.';
          else if (data?.message) errMsg = data.message;
        } catch {}
        throw new Error(errMsg);
      }

      // Парсим SSE-поток вручную (через ReadableStream)
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
            if (event.type === 'chunk' && event.content) {
              setMessages((prev) => {
                const next = [...prev];
                const last = next[next.length - 1];
                if (last && last.role === 'assistant') {
                  next[next.length - 1] = { ...last, content: last.content + event.content };
                }
                return next;
              });
            } else if (event.type === 'error') {
              throw new Error(event.message ?? 'Stream error');
            }
          } catch (e) {
            // Игнорируем повреждённые SSE-кадры
          }
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setError(err.message || 'Ошибка соединения');
      // Удаляем пустой assistant-плейсхолдер чтобы не висел "пустой пузырёк"
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
    <div className="mt-3 glass rounded-xl border-accent-400/20 overflow-hidden animate-fade-in">
      {/* Лента сообщений. Ограничиваем высоту, при переполнении внутренний скролл */}
      <div className="px-4 py-4 max-h-[480px] overflow-y-auto space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={m.role === 'user'
              ? 'glass-subtle rounded-lg px-3 py-2 text-[13px] text-fg-primary ml-8'
              : 'mr-8 text-[13.5px] text-fg-primary leading-relaxed'
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
          <div className="glass-subtle rounded-lg p-3 text-[12.5px] text-grade-senior border border-grade-senior/30">
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
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
