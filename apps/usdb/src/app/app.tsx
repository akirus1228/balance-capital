// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { USDBLight, USDBDark } from '@fantohm/shared-ui-themes';
import { StakingChoicePage } from './pages/staking-choice/staking-choice';
import { Header } from './components/template';
import Messages from './components/messages/messages';
import { XfhmLqdrPage } from './pages/xfhm-lqdr/xfhm-lqdr';
import { HomePage } from './pages/home/home-page';
import Mint from './pages/mint/mint';
import { TradFiDeposit } from './pages/trad-fi/deposit/deposit';
import { TradFi } from './pages/trad-fi/trad-fi';
import MyAccount from './pages/my-account/my-account';
import { RootState } from './store';
import { loadAppDetails } from '@fantohm/shared-web3';
import { useWeb3Context } from '@fantohm/shared-web3';
import { calcBondDetails } from '@fantohm/shared-web3';
import { useAddress, useBonds } from '@fantohm/shared-web3';
import { calcGlobalBondDetails } from '@fantohm/shared-web3';
import { calcInvestmentDetails } from '@fantohm/shared-web3';
import { useInvestments } from '@fantohm/shared-web3';
import { fetchTokenPrice } from '@fantohm/shared-web3';
import {
  calculateUserBondDetails,
  loadAccountDetails,
} from '@fantohm/shared-web3';

export function App() {
  const themeType = useSelector((state: RootState) => state.app.theme);
  const [theme, setTheme] = useState(USDBLight);
  const dispatch = useDispatch();
  const { address, hasCachedProvider, chainId } = useWeb3Context();
  const { bonds, allBonds } = useBonds(chainId || 250);
  const { investments } = useInvestments();

  useEffect(() => {
    setTheme(themeType === 'light' ? USDBLight : USDBDark);
  }, [themeType]);
  useEffect(() => {
    dispatch(loadAppDetails({ networkId: chainId || 250 }));
    bonds.map((bond) => {
      dispatch(calcBondDetails({ bond, value: '', networkId: chainId || 250 }));
    });
    dispatch(calcGlobalBondDetails({ allBonds }));
    investments.map((investment) => {
      dispatch(calcInvestmentDetails({ investment }));
      dispatch(fetchTokenPrice({ investment }));
    });
  }, [chainId]);

  // Load account details
  useEffect(() => {
    if (address) {
      dispatch(loadAccountDetails({ networkId: chainId || 250, address }));
      bonds.map((bond) => {
        dispatch(
          calculateUserBondDetails({ address, bond, networkId: chainId || 250 })
        );
      });
    }
  }, [chainId, address]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ height: '100vh' }}>
        <Messages />
        <Header />
        <Routes>
          <Route path="/" element={<HomePage title="Home" />} />
          <Route path="/staking" element={<StakingChoicePage />} />
          <Route path="/trad-fi" element={<TradFi />}>
            <Route
              path="/trad-fi/deposit/:bondType"
              element={<TradFiDeposit bond={allBonds[0]} />}
            />
          </Route>
          <Route path="/mint" element={<Mint />} />
          <Route path="/my-account" element={<MyAccount />} />
          <Route path="/xfhm" element={<XfhmLqdrPage />} />
          <Route
            path="*"
            element={
              <main style={{ padding: '1rem' }}>
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
