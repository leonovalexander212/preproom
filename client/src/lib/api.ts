import axios from 'axios';
import type { Direction, DirectionQuestionsResponse, Difficulty, QuestionType, VideoAnswer, Interview } from '../types/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const client = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const api = {
  getDirections: async (): Promise<Direction[]> => {
    const res = await client.get<Direction[]>('/api/directions');
    return res.data;
  },

  getDirectionQuestions: async (
    slug: string,
    filters?: { difficulty?: Difficulty; topic?: string; type?: QuestionType }
  ): Promise<DirectionQuestionsResponse> => {
    const res = await client.get<DirectionQuestionsResponse>(
      `/api/directions/${slug}/questions`,
      { params: filters }
    );
    return res.data;
  },

  getQuestionVideoAnswers: async (questionId: string): Promise<VideoAnswer[]> => {
    const res = await client.get<VideoAnswer[]>(`/api/questions/${questionId}/video-answers`);
    return res.data;
  },

  getInterviews: async (filters?: { direction?: string; difficulty?: Difficulty }): Promise<Interview[]> => {
    const res = await client.get<Interview[]>('/api/interviews', { params: filters });
    return res.data;
  },
};
