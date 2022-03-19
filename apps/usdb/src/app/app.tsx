// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider } from "@mui/material/styles";
import { USDBLight, USDBDark } from "@fantohm/shared-ui-themes";
import { StakingChoicePage } from './pages/staking-choice/staking-choice';
import { Header } from './components/template';
import { HomePage } from './pages/home/home-page';
import { TradFiDeposit } from './pages/trad-fi/deposit/deposit';
import { TradFi } from "./pages/trad-fi/trad-fi";
import MyAccount from './pages/my-account/my-account';
import { RootState } from './store';


export function App() {
  const themeType = useSelector((state: RootState) => state.app.theme);
  const [theme, setTheme] = useState(USDBLight);

  useEffect(() => { setTheme(themeType === 'light' ? USDBLight : USDBDark)}, [themeType]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{height: '100vh'}}>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage title="Home"/>} />
          <Route path="/staking" element={<StakingChoicePage />} />
          <Route path="/trad-fi/deposit/:bondType" element={<TradFiDeposit />} />
          <Route path="/trad-fi" element={<TradFi />} />
          <Route path="/my-account" element={<MyAccount />} />
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
