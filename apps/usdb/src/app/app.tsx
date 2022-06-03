import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { USDBLight, USDBDark } from "@fantohm/shared-ui-themes";
import Mint from "./pages/mint/mint";
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
import { StakingChoicePage } from "./pages/staking-choice/staking-choice";
import { Header, Footer } from "./components/template";
import { ScrollToTop } from "./components/scroll-to-top/scroll-to-top";
import { Messages } from "./components/messages/messages";
import { XfhmLqdrPage } from "./pages/xfhm-lqdr/xfhm-lqdr";
import { BalanceHomePage } from "./pages/home/balance-home-page";
import { TradFiDeposit } from "./pages/trad-fi/deposit/deposit";
import { TradFi } from "./pages/trad-fi/trad-fi";
import { MyAccount } from "./pages/my-account/my-account";
import { RootState } from "./store";
import { loadAppDetails } from "./store/reducers/app-slice";
import StakingV1Page from "./pages/staking-v1/staking-v1";
import BalanceAboutPage from "./pages/balance-about-page/balance-about-page";
import { HomeHeader } from "./components/template/header/home-header";
import HomePage from "./pages/home/home-page";
import FhmPage from "./pages/fhm/fhm-page";
import BlogPage from "./pages/blog/blog-page";
import BlogPostPage from "./components/blog-page/blog-post-page";
import { loadBlogPosts } from "./store/reducers/backend-slice";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const contentful = require("contentful");

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
    dispatch(loadBlogPosts());
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
      case "/trad-fi":
      case "/staking":
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
        <Messages />
        {location.pathname === "/" ||
        location.pathname === "/about" ||
        location.pathname === "/fhm" ||
        location.pathname.includes("/blog") ? (
          <HomeHeader />
        ) : (
          <Header />
        )}
        <Routes>
          <Route path="/" element={<BalanceHomePage />} />
          <Route path="/usdb" element={<HomePage />} />
          <Route path="/usdb-about" element={<BalanceAboutPage />} />
          <Route path="/staking" element={<StakingChoicePage />} />
          <Route path="/staking-v1" element={<StakingV1Page />} />
          <Route path="/trad-fi" element={<TradFi />}>
            <Route path="/trad-fi/deposit/:bondType" element={<TradFiDeposit />} />
          </Route>
          <Route path="/xfhm" element={<XfhmLqdrPage />} />
          <Route path="/mint" element={<Mint />} />
          <Route path="/fhm" element={<FhmPage />} />
          <Route path="/my-account" element={<MyAccount />} />
          <Route path="/about" element={<BalanceAboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:name" element={<BlogPostPage />} />

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
