import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { NftLight, NftDark } from "@fantohm/shared-ui-themes";
import {
  useWeb3Context,
  defaultNetworkId,
  authorizeAccount,
} from "@fantohm/shared-web3";
import { Header, Footer } from "./components/template";
// import { Messages } from "./components/messages/messages";
import { HomePage } from "./pages/home/home-page";
import { RootState } from "./store";
import { ScrollToTop } from "@fantohm/shared/ui-helpers";
import BorrowPage from "./pages/borrow-page/borrow-page";
import LendPage from "./pages/lend-page/lend-page";
import MyAccountPage from "./pages/my-account-page/my-account-page";
import BorrowerAssetDetailsPage from "./pages/borrower-asset-details-page/borrower-asset-details-page";
import { setCheckedConnection } from "./store/reducers/app-slice";

export const App = (): JSX.Element => {
  const dispatch = useDispatch();

  const themeType = useSelector((state: RootState) => state.theme.mode);
  const backend = useSelector((state: RootState) => state.nftMarketplace);

  const [theme, setTheme] = useState(NftLight);
  const { address, chainId, connected, hasCachedProvider, connect, provider } = useWeb3Context();

  useEffect(() => {
    setTheme(themeType === "light" ? NftLight : NftDark);
  }, [themeType]);

  // check for cached wallet connection
  useEffect(() => {
    // if there's a cached provider, try and connect
    if (hasCachedProvider && hasCachedProvider() && !connected) {
      try {
        connect();
      } catch (e) {
        console.log("Connection metamask error", e);
      }
    }
    // if there's a cached provider and it has connected, connection check is good.
    if (hasCachedProvider && hasCachedProvider && connected)
      dispatch(setCheckedConnection(true));

    // if there's not a cached provider and we're not connected, connection check is good
    if (hasCachedProvider && !hasCachedProvider() && !connected)
      dispatch(setCheckedConnection(true));
  }, [connected, hasCachedProvider, connect]);

  // when a user connects their wallet login to the backend api
  useEffect(() => {
    if (
      provider &&
      connected &&
      ["unknown", "failed"].includes(backend.accountStatus) &&
      backend.authSignature === null
    ) {
      dispatch(
        authorizeAccount({ networkId: chainId || defaultNetworkId, address, provider })
      );
    }
  }, [address, backend.accountStatus, connected]);

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
          <Route path="/borrow/:assetId" element={<BorrowerAssetDetailsPage />} />
          <Route path="/lend" element={<LendPage />} />
          <Route path="/my-account" element={<MyAccountPage />} />
          <Route
            path="*"
            element={
              <main style={{ padding: "1rem" }}>
                <h1>404</h1>
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
