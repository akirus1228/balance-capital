// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Routes, Route, Link } from "react-router-dom";
import HomePage from './pages/home-page';
import BondsPage from './pages/bonds/bonds';
import { Header } from './components/header';
import { Box } from '@mui/material';

export function App() {
  return (
    <Box sx={{
      bgcolor: 'background.default',
      width: '100%',
      color: 'text.primary',
      height: '100vh'
    }}>
      <div>
        <Header />
        <Link to="/bonds">Bonds</Link>
        <div>Footer</div>
      </div>
      <Routes>
        <Route path="/" element={<HomePage title="Home"/>} />
        <Route path="/bonds" element={<BondsPage />} />
      </Routes>
    </Box>
  );
}

export default App;
