import rateLimit from 'express-rate-limit';

export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'rate_limit', message: 'Слишком много запросов. Подождите минуту.' },
  keyGenerator: (req) => {
    const fwd = (req.headers['x-forwarded-for'] as string) ?? '';
    return fwd.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
  },
});

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'rate_limit', message: 'Слишком много запросов.' },
  keyGenerator: (req) => {
    const fwd = (req.headers['x-forwarded-for'] as string) ?? '';
    return fwd.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
  },
});
