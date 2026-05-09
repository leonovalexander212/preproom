if (!import.meta.env.VITE_API_URL) {
  throw new Error("VITE_API_URL is required");
}
const API_URL = import.meta.env.VITE_API_URL;

async function get(path, params) {
  const url = new URL(API_URL + path);
  if (params) Object.entries(params).forEach(([k, v]) => v != null && url.searchParams.set(k, v));
  const r = await fetch(url, { headers: { "Content-Type": "application/json" } });
  if (!r.ok) throw new Error(`API ${path} ${r.status}`);
  return r.json();
}

export const api = {
  base: API_URL,
  getDirections: () => get("/api/directions"),
  getDirectionQuestions: (slug, filters) => get(`/api/directions/${slug}/questions`, filters),
  getQuestionVideoAnswers: (id) => get(`/api/questions/${id}/video-answers`),
  getInterviews: (filters) => get("/api/interviews", filters),
};