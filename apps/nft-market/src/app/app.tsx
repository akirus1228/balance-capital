import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { USDBLight, USDBDark } from "@fantohm/shared-ui-themes";
import {
  useWeb3Context,
  calcBondDetails,
  useBonds,
  calcGlobalBondDetails,
  calcInvestmentDetails,
  useInvestments,
  fetchTokenPrice,
  loadAccountDetails,
  defaultNetworkId,
  calculateAllUserBondDetails,
} from "@fantohm/shared-web3";
import { Header, Footer } from "./components/template";
// import { Messages } from "./components/messages/messages";
import { HomePage } from "./pages/home/home-page";
import { RootState } from "./store";
import { ScrollToTop } from "@fantohm/shared/ui-helpers";

export const App = (): JSX.Element => {
  const dispatch = useDispatch();

  const themeType = useSelector((state: RootState) => state.app.theme);
  const [theme, setTheme] = useState(USDBDark);
  const { address, chainId, connected } = useWeb3Context();
  const { bonds, allBonds } = useBonds(chainId || defaultNetworkId);
  const { investments } = useInvestments();

  useEffect(() => {
    setTheme(themeType === "light" ? USDBLight : USDBDark);
  }, [themeType]);

  useEffect(() => {
    // if we aren't connected or don't yet have a chainId, we shouldn't try and load details
    if (!connected || !chainId) return;
    dispatch(loadAppDetails({ networkId: chainId || defaultNetworkId }));
    bonds.map((bond) => {
      dispatch(
        calcBondDetails({ bond, value: "", networkId: chainId || defaultNetworkId })
      );
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
      console.log("app-chainId, address: ", chainId, address);
      dispatch(loadAccountDetails({ networkId: chainId || defaultNetworkId, address }));
      dispatch(
        calculateAllUserBondDetails({
          address,
          allBonds: bonds,
          networkId: chainId || defaultNetworkId,
        })
      );
    }
  }, [chainId, address, dispatch]);

  const location = useLocation();
  useEffect(() => {
    //console.log(location.pathname);
    switch (location.pathname) {
      case "/":
        document.body.classList.add("heroBackground");
        break;
      default:
        document.body.classList.remove("heroBackground");
    }
  }, [location]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box paddingTop={5} paddingBottom={12} sx={{ height: "100vh" }}>
        <ScrollToTop />
        {/* <Messages /> */}
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="*"
            element={
              <main style={{ padding: "1rem" }}>
                <p>There's nothing here!</p>
              </main>
            }
          />
        </Routes>
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default App;
