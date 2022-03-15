// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Routes, Route, Link } from "react-router-dom";
import { StakingChoicePage } from './pages/staking-choice/staking-choice';
import { Header } from './components/template';
import { Box } from '@mui/material';
import { HomePage } from './pages/home/home-page';
import { Bond } from "./pages/bond/bond";
import { TradFi } from "./pages/trad-fi/trad-fi";

export function App() {
  
  return (
    <Box sx={{
      color: 'text.primary',
      height: '100vh',
      paddingTop: '57px',
    }}>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage title="Home"/>} />
        <Route path="/staking" element={<StakingChoicePage />} />
        <Route path="/bonds/:bondType" element={<Bond />} />
        <Route path="/trad-fi" element={<TradFi />} />
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
      </Routes>
    </Box>
  );
}

export default App;
