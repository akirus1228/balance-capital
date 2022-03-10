// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Routes, Route, Link } from "react-router-dom";
import HomePage from './pages/home-page';
import { BondChoicePage } from './pages/bond-choice/bond-choice';
import { Header } from './components/template';
import { Box } from '@mui/material';
import Bond from "./pages/bond/bond";

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
        <Routes>
          <Route path="/" element={<HomePage title="Home"/>} />
          <Route path="/bonds" element={<BondChoicePage />} />
          <Route path="/bonds/:bondType" element={<Bond />} />
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
