import pinoHttp from 'pino-http';
import { logger } from './logger';
import { randomUUID } from 'node:crypto';

export const httpLogger = pinoHttp({
  logger,
  genReqId: () => randomUUID().slice(0, 8),
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      remoteAddress: req.remoteAddress,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
  },
  autoLogging: {
    ignore: (req) => req.url === '/api/health',
  },
});
