import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { theme } from './theme';
import StatusDashboard from './components/StatusDashboard';
// import Dashboard from './pages/Dashboard';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalize CSS across browsers */}
      <StatusDashboard />
    </ThemeProvider>
  );
  /*
  return (
    <div style={{ padding: "2rem" }}>
      <Dashboard />
    </div>
  );
  */
}

export default App;
