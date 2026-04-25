import 'dotenv/config';
import OpenAI from 'openai';

// Универсальный LLM-клиент. Все провайдеры (Groq, Ollama, OpenRouter) совместимы
// с OpenAI Chat Completions API, так что используем один SDK с разными baseURL.
//
// Выбор провайдера через переменную окружения LLM_PROVIDER.
// Это даёт возможность переключиться на запасной вариант одной строкой в .env.

type Provider = 'groq' | 'ollama';

const provider = (process.env.LLM_PROVIDER ?? 'groq') as Provider;

function buildClient(): { client: OpenAI; model: string; provider: Provider } {
  if (provider === 'groq') {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not defined in .env (LLM_PROVIDER=groq)');
    }
    return {
      provider: 'groq',
      client: new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: 'https://api.groq.com/openai/v1',
      }),
      model: 'llama-3.3-70b-versatile',
    };
  }

  if (provider === 'ollama') {
    return {
      provider: 'ollama',
      client: new OpenAI({
        // Ollama не требует ключа, но SDK падает если его нет — отдаём заглушку
        apiKey: 'ollama',
        baseURL: process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434/v1',
      }),
      model: process.env.OLLAMA_MODEL ?? 'qwen2.5:14b',
    };
  }

  throw new Error(`Unknown LLM_PROVIDER: ${provider}`);
}

export const llm = buildClient();

console.log(`🤖 LLM provider: ${llm.provider} (model: ${llm.model})`);
