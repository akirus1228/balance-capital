import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { USDBLight, USDBDark } from "@fantohm/shared-ui-themes";
import {
  useWeb3Context,
  loadAccountDetails,
  defaultNetworkId,
} from "@fantohm/shared-web3";
import { Header, Footer } from "./components/template";
// import { Messages } from "./components/messages/messages";
import { HomePage } from "./pages/home/home-page";
import { RootState } from "./store";
import { ScrollToTop } from "@fantohm/shared/ui-helpers";
import BorrowPage from "./pages/borrow-page/borrow-page";
import LendPage from "./pages/lend-page/lend-page";

export const App = (): JSX.Element => {
  const dispatch = useDispatch();

  const themeType = useSelector((state: RootState) => state.theme.mode);
  const [theme, setTheme] = useState(USDBDark);
  const { address, chainId, connected } = useWeb3Context();

  useEffect(() => {
    setTheme(themeType === "light" ? USDBLight : USDBDark);
  }, [themeType]);

  // Load account details
  useEffect(() => {
    if (address) {
      console.log("app-chainId, address: ", chainId, address);
      dispatch(loadAccountDetails({ networkId: chainId || defaultNetworkId, address }));
    }
  }, [chainId, address, dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box paddingTop={5} paddingBottom={12} sx={{ height: "100vh" }}>
        <ScrollToTop />
        {/* <Messages /> */}
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/borrow" element={<BorrowPage />} />
          <Route path="/lend" element={<LendPage />} />
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
