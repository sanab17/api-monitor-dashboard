import express, { Request, Response } from 'express';
import cors from 'cors';
import dashboardRoutes from './routes/dashboardRoutes';
// import monitorRoutes from './routes/apiMonitor';
// import { performHealthChecks } from './services/healthCheckService';
import { healthCheckService } from './services/healthCheckService';

const app = express();

// Middleware
// app.use(cors());
app.use(cors({
  origin: [
    'https://api-monitor-dashboard.netlify.app',
    'http://localhost:5173', // Vite dev server
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json());

// Sample route
app.get('/', (_req: Request, res: Response) => {
  res.send('Hello, World! API Monitoring Dashboard Backend');
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'Active', timestamp: new Date() });
});

app.get("/debug", (_, res) => {
  res.send("debug alive");
});

// Dashboard routes
// app.use('/api', monitorRoutes);
app.use('/api/dashboard', dashboardRoutes);

export default app;

export const startServer = () => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  // Start health check monitoring
  healthCheckService.startMonitoring();

  // Start health checks interval
  /*
  setInterval(() => {
    performHealthChecks();
  }, 10000);
  */
};