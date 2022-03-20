// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from "react";
import {useDispatch, useSelector} from "react-redux";
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
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {loadAppDetails} from "../../../../libs/shared/web3/src/lib/slices/app-slice";
import {useWeb3Context} from "@fantohm/shared-web3";
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {calcBondDetails} from "../../../../libs/shared/web3/src/lib/slices/bond-slice";
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {useAddress, useBonds} from "../../../../libs/shared/web3/src/lib/hooks";
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {calcGlobalBondDetails} from "../../../../libs/shared/web3/src/lib/slices/global-bond-slice";
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {calcInvestmentDetails} from "../../../../libs/shared/web3/src/lib/slices/investment-slice";
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import useInvestments from "../../../../libs/shared/web3/src/lib/hooks/investments";
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {fetchTokenPrice} from "../../../../libs/shared/web3/src/lib/slices/token-price-slice";
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {calculateUserBondDetails, loadAccountDetails} from 'libs/shared/web3/src/lib/slices/account-slice';

export function App() {
  const themeType = useSelector((state: RootState) => state.app.theme);
  const [theme, setTheme] = useState(USDBLight);
  const dispatch = useDispatch();
  const { address, hasCachedProvider, chainID } = useWeb3Context();
  const { bonds, allBonds } = useBonds(chainID || 250);
  const { investments } = useInvestments();

  useEffect(() => { setTheme(themeType === 'light' ? USDBLight : USDBDark)}, [themeType]);
  useEffect(() => {
    dispatch(loadAppDetails({networkId: chainID || 250 }));
    bonds.map(bond => {
      dispatch(calcBondDetails({ bond, value: "", networkId: chainID || 250 }));
    });
    dispatch(calcGlobalBondDetails({ allBonds }));
    investments.map(investment => {
      dispatch(calcInvestmentDetails({ investment }));
      dispatch(fetchTokenPrice({ investment }));
    });
  }, [chainID]);

  // Load account details
  useEffect(() => {
    if (address) {
      dispatch(loadAccountDetails({ networkId: chainID || 250, address }));
      bonds.map(bond => {
        dispatch(calculateUserBondDetails({ address, bond, networkId: chainID || 250 }));
      });
    }
  }, [chainID, address]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{height: '100vh'}}>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage title="Home"/>} />
          <Route path="/staking" element={<StakingChoicePage />} />
          <Route path="/trad-fi" element={<TradFi />}>
            <Route path="/trad-fi/deposit/:bondType" element={<TradFiDeposit  bond={allBonds[0]}/>} />
          </Route>
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
