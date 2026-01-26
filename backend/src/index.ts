import express, { Request, Response } from 'express';
import cors from 'cors';
import monitorRoutes from './routes/apiMonitor';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Sample route
app.get('/', (_req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'Active', timestamp: new Date() });
});

app.get("/debug", (_, res) => {
  res.send("debug alive");
});

app.use('/api', monitorRoutes);

export default app;