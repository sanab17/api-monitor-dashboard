import app from './index';
import { performHealthChecks } from './services/healthCheckService';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

setInterval(() => {
  performHealthChecks();
}, 10000);
