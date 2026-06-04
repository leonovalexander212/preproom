import 'dotenv/config';
import OpenAI from 'openai';

// Universal LLM client. Provider selection via LLM_PROVIDER env.

type Provider = 'groq' | 'ollama' | 'openrouter';

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
        baseURL: process.env.GROQ_BASE_URL ?? 'https://api.groq.com/openai/v1',
      }),
      model: process.env.GROQ_MODEL ?? 'llama-3.3-70b-versatile',
    };
  }

  if (provider === 'ollama') {
    return {
      provider: 'ollama',
      client: new OpenAI({
        apiKey: 'ollama', // Ollama requires non-empty string
        baseURL: process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434/v1',
      }),
      model: process.env.OLLAMA_MODEL ?? 'qwen2.5:14b',
    };
  }

  throw new Error(`Unknown LLM_PROVIDER: ${provider}`);
}

export const llm = buildClient();

console.log(`LLM: ${llm.provider}`);
