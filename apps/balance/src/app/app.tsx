import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Backdrop, Box, Button, CssBaseline, Fade, Paper } from "@mui/material";
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
  isPendingTxn,
  txnButtonText,
} from "@fantohm/shared-web3";
import { Header, Footer } from "./components/template";
import { ScrollToTop } from "./components/scroll-to-top/scroll-to-top";
import { Messages } from "./components/messages/messages";
import { BalanceHomePage } from "./pages/home/balance-home-page";
import { RootState } from "./store";
import { loadAppDetails, setTheme } from "./store/reducers/app-slice";
import BalanceAboutPage from "./pages/balance-about-page/balance-about-page";
import { HomeHeader } from "./components/template/header/home-header";
import FhmPage from "./pages/fhm/fhm-page";
import Typography from "@mui/material/Typography";
import style from "./pages/trad-fi/deposit/deposit.module.scss";
import BlogPage from "./pages/blog/blog-page";
import BlogPostPage from "./components/blog-page/blog-post-page";
import { loadBlogPosts } from "./store/reducers/backend-slice";

export const App = (): JSX.Element => {
  const dispatch = useDispatch();

  const themeType = useSelector((state: RootState) => state.app.theme);
  const [theme, setTheme] = useState(USDBDark);
  const { address, chainId, connected } = useWeb3Context();
  const { bonds, allBonds } = useBonds(chainId || defaultNetworkId);
  const { investments } = useInvestments();
  const [promptTerms, setPromptTerms] = useState<boolean>(
    false
    //TODO localStorage.getItem("termsAgreed") !== "true"
  );
  const [isChecked, setIsChecked] = useState<boolean>(false);

  useEffect(() => {
    setTheme(themeType === "light" ? USDBLight : USDBDark);
  }, [themeType]);

  useEffect(() => {
    // if we aren't connected or don't yet have a chainId, we shouldn't try and load details
    dispatch(loadAppDetails());
  }, []);

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
        <HomeHeader />
        <Routes>
          <Route path="/" element={<BalanceHomePage />} />
          <Route path="/usdb-about" element={<BalanceAboutPage />} />
          <Route path="/fhm" element={<FhmPage />} />
          <Route path="/about" element={<BalanceAboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPostPage />} />

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
