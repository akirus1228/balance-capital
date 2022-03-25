// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { USDBLight, USDBDark } from '@fantohm/shared-ui-themes';
import Mint from './pages/mint/mint';
import {
  useWeb3Context,
  calcBondDetails,
  useBonds,
  calcGlobalBondDetails,
  calcInvestmentDetails,
  useInvestments,
  fetchTokenPrice,
  calculateUserBondDetails,
  loadAccountDetails,
  defaultNetworkId
} from '@fantohm/shared-web3';
import { StakingChoicePage } from './pages/staking-choice/staking-choice';
import { Header } from './components/template';
import { Messages } from './components/messages/messages';
import { XfhmLqdrPage } from './pages/xfhm-lqdr/xfhm-lqdr';
import { HomePage } from './pages/home/home-page';
import { TradFiDeposit } from './pages/trad-fi/deposit/deposit';
import { TradFi } from './pages/trad-fi/trad-fi';
import { MyAccount } from './pages/my-account/my-account';
import { RootState } from './store';
import { loadAppDetails } from './store/reducers/app-slice';

export const App = (): JSX.Element => {
  const dispatch = useDispatch();

  const themeType = useSelector((state: RootState) => state.app.theme);
  const [theme, setTheme] = useState(USDBDark);
  const { address, chainId, connected } = useWeb3Context();
  const { bonds, allBonds } = useBonds(chainId || defaultNetworkId);
  const { investments } = useInvestments();

  useEffect(() => {
    setTheme(themeType === 'light' ? USDBLight : USDBDark);
  }, [themeType]);

  useEffect(() => {
    if(!connected)
      return;
    dispatch(loadAppDetails({ networkId: chainId || defaultNetworkId }));
    bonds.map((bond) => {
      dispatch(calcBondDetails({ bond, value: '', networkId: chainId || defaultNetworkId }));
    });
    dispatch(calcGlobalBondDetails({ allBonds }));
    investments.map((investment) => {
      dispatch(calcInvestmentDetails({ investment }));
      dispatch(fetchTokenPrice({ investment }));
    });
  }, [chainId, address, dispatch, connected]);

  // Load account details
  useEffect(() => {
    if (address) {
      console.log('app-chainId, address: ', chainId, address);
      dispatch(loadAccountDetails({ networkId: chainId || defaultNetworkId, address }));
      bonds.map((bond) => {
        dispatch(
          calculateUserBondDetails({ address, bond, networkId: chainId || defaultNetworkId })
        );
      });
    }
  }, [chainId, address, dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box paddingTop={5} paddingBottom={12} sx={{ height: '100vh' }}>
        <Messages />
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/staking" element={<StakingChoicePage />} />
          <Route path="/trad-fi" element={<TradFi />}>
            <Route
              path="/trad-fi/deposit/:bondType"
              element={<TradFiDeposit />}
            />
          </Route>
          <Route path="/xfhm" element={<XfhmLqdrPage />} />
          <Route path="/mint" element={<Mint />} />
          <Route path="/my-account" element={<MyAccount />} />
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
};

export default App;
