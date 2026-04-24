// Типы данных, которые возвращает наш API. Соответствуют тому, что отдаёт бэкенд

export type Difficulty = 'JUNIOR' | 'MIDDLE' | 'SENIOR';
export type QuestionType = 'TECHNICAL' | 'BEHAVIORAL' | 'LOGIC_PUZZLE';

export type Direction = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  iconUrl: string | null;
  category: string | null;
  hasDifficultyLevels: boolean;
  isFeatured: boolean;
  _count: {
    questions: number;
    interviews: number;
  };
};

export type Question = {
  id: string;
  text: string;
  difficulty: Difficulty | null;
  type: QuestionType;
  answer: string;
  topic: { name: string; slug: string } | null;
  occurrences: number;
  totalInterviews: number;
  probability: number;
};

export type DirectionQuestionsResponse = {
  direction: {
    name: string;
    slug: string;
    totalInterviews: number;
  };
  questions: Question[];
};
