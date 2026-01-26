import express, { Request, Response } from 'express';
import cors from 'cors';
import monitorRoutes from './routes/apiMonitor';
import { performHealthChecks } from './services/healthCheckService';

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

export const startServer = () => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  // Start health checks interval
  setInterval(() => {
    performHealthChecks();
  }, 10000);
};