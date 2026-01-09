import express from 'express';
import cors from 'cors';
import { performHealthChecks } from './services/healthCheckService';
// import { monitoredApis } from './constants/apiRegistry';
import monitorRoutes from './routes/apiMonitor';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/health', (_req, res) => {
  res.json({ status: 'Active', timestamp: new Date() });
});

/*
app.get('/api-monitor', (_req, res) => {
  res.json(monitoredApis);
});
*/

app.use('/api-monitor', monitorRoutes)

setInterval(() => {
  performHealthChecks();
}, 10000);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});