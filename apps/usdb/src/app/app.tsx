import { Box } from '@mui/material';
import { Routes, Route } from "react-router-dom";

import { Header } from './components/template';
import HomePage from './pages/home/home-page';
import XfhmLqdrPage from './pages/xfhm-lqdr/xfhm-lqdr';
import { BondChoicePage } from './pages/bond-choice/bond-choice';
import Bond from "./pages/bond/bond";

export function App() {

  return (
    <Box sx={{
      bgcolor: 'background.default',
      width: '100%',
      color: 'text.primary',
      height: '100vh',
      paddingTop: '57px',
    }}>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage title="Home"/>} />
          <Route path="/bonds" element={<BondChoicePage />} />
          <Route path="/bonds/:bondType" element={<Bond />} />
          <Route path="/xfhm-lqdr" element={<XfhmLqdrPage />} />
          <Route
            path="*"
            element={
              <main style={{ padding: "1rem" }}>
                <p>There's nothing here!</p>
              </main>
            }
          />
        </Routes>
      </div>
    </Box>
  );
}

export default App;
