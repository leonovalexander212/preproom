import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import directionsRouter from './routes/directions';
import aiRouter from './routes/ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/directions', directionsRouter);
app.use('/api/ai', aiRouter);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('=== UNHANDLED ERROR ===');
  console.error(err);
  console.error('=======================');
  res.status(500).json({ error: 'Internal server error', message: err?.message });
});

process.on('unhandledRejection', (reason) => {
  console.error('=== UNHANDLED REJECTION ===');
  console.error(reason);
  console.error('===========================');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});