import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import directionsRouter from './routes/directions';
import aiRouter from './routes/ai';
import questionsRouter from './routes/questions';
import interviewsRouter from './routes/interviews';
import mockRouter from './routes/mock';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const CORS_ORIGIN = process.env.CORS_ORIGIN;
app.use(cors(CORS_ORIGIN ? { origin: CORS_ORIGIN } : undefined));
app.use(express.json({ limit: '2mb' }));
app.use('/static', express.static(path.join(__dirname, '..', 'public'), { maxAge: '7d' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/directions', directionsRouter);
app.use('/api/ai', aiRouter);
app.use('/api/questions', questionsRouter);
app.use('/api/interviews', interviewsRouter);
app.use('/api/mock', mockRouter);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('UNHANDLED ERROR', err);
  const isDev = process.env.NODE_ENV === 'development';
  res.status(500).json({
    error: 'Internal server error',
    ...(isDev ? { message: err?.message } : {}),
  });
});

process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION', reason);
});

app.listen(PORT, () => {
  console.log(`Server: ${PORT}`);
});