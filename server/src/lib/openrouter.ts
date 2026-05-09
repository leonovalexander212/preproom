import 'dotenv/config';
import OpenAI from 'openai';

if (!process.env.OPENROUTER_API_KEY) {
  throw new Error('OPENROUTER_API_KEY is not defined in .env');
}

export const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: process.env.OPENROUTER_BASE_URL ?? 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': process.env.OPENROUTER_REFERER ?? 'http://localhost:4000',
    'X-Title': process.env.OPENROUTER_TITLE ?? 'Interview Platform',
  },
});