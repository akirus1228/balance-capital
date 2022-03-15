// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Routes, Route } from "react-router-dom";
import { StakingChoicePage } from './pages/staking-choice/staking-choice';
import { Header } from './components/template';
import { Box } from '@mui/material';
import { ThemeProvider } from "@mui/material/styles";
import { HomePage } from './pages/home/home-page';
import { Bond } from "./pages/bond/bond";
import { TradFi } from "./pages/trad-fi/trad-fi";
import { RootState } from './store';
import { useSelector } from "react-redux";
import { USDBLight, USDBDark } from "@fantohm/shared-ui-themes";
import { useEffect, useState } from "react";

export function App() {
  const themeType = useSelector((state: RootState) => state.app.theme);
  const [theme, setTheme] = useState(USDBLight);

  useEffect(() => { setTheme(themeType === 'light' ? USDBLight : USDBDark)}, [themeType]);

  return (
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  );
}

export default App;
