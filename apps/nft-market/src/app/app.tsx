import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Backdrop, Box, Button, CssBaseline, Fade, Paper } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { NftLight, NftDark } from "@fantohm/shared-ui-themes";
import {
  useWeb3Context,
  defaultNetworkId,
  isDev,
  NetworkIds,
  loadPlatformFee,
} from "@fantohm/shared-web3";
import { Header, Footer } from "./components/template";
// import { Messages } from "./components/messages/messages";
import { HomePage } from "./pages/home/home-page";
import { RootState } from "./store";
import { BorrowPage } from "./pages/borrow-page/borrow-page";
import { LendPage } from "./pages/lend-page/lend-page";
import { MyAccountPage } from "./pages/my-account-page/my-account-page";
import { setCheckedConnection } from "./store/reducers/app-slice";
import { authorizeAccount, logout } from "./store/reducers/backend-slice";
import Typography from "@mui/material/Typography";
import { AssetDetailsPage } from "./pages/asset-details-page/asset-details-page";
import { TestHelper } from "./pages/test-helper/test-helper";
import Growl from "./components/growl/growl";

export const App = (): JSX.Element => {
  const dispatch = useDispatch();

  const themeType = useSelector((state: RootState) => state.theme.mode);
  const { user, authorizedAccount, accountStatus } = useSelector(
    (state: RootState) => state.backend
  );
  const backend = useSelector((state: RootState) => state.backend);
  const [promptTerms, setPromptTerms] = useState<boolean>(
    true
    //TODO localStorage.getItem("termsAgreedUsdb") !== "true"
  );
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [theme, setTheme] = useState(NftLight);
  const {
    address,
    chainId,
    connected,
    hasCachedProvider,
    connect,
    provider,
    switchEthereumChain,
  } = useWeb3Context();

  useEffect(() => {
    setTheme(themeType === "light" ? NftLight : NftDark);
  }, [themeType]);

  // if the wallet address doesn't equal the logged in user, log out
  useEffect(() => {
    if (
      address &&
      user &&
      user.address &&
      address.toLowerCase() !== user.address.toLowerCase()
    ) {
      dispatch(logout());
    }
  }, [address, user]);

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
      address &&
      (!authorizedAccount || address.toLowerCase() !== authorizedAccount.toLowerCase()) &&
      accountStatus !== "pending" &&
      typeof user.address == "undefined"
    ) {
      dispatch(
        authorizeAccount({ networkId: chainId || defaultNetworkId, address, provider })
      );
    }
  }, [provider, address, connected, authorizedAccount, accountStatus, user]);

  // when a user connects their wallet login to the backend api
  useEffect(() => {
    if (provider && connected && address) {
      const expectedChain = isDev() ? NetworkIds.Rinkeby : NetworkIds.Ethereum;
      if (switchEthereumChain && chainId !== expectedChain) {
        switchEthereumChain(expectedChain);
      }
    }
  }, [provider, address, connected]);

  // when a user connects their wallet login to the backend api
  useEffect(() => {
    if (provider && connected) {
      dispatch(loadPlatformFee({ networkId: chainId || defaultNetworkId, address }));
    }
  }, [address, connected, authorizedAccount]);

  const handleAgree = () => {
    setPromptTerms(false);
    localStorage.setItem("termsAgreedUsdb", "true");
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {promptTerms ? (
        <Box paddingTop={5} paddingBottom={12} sx={{ height: "100vh" }}>
          <Fade in={true} mountOnEnter unmountOnExit>
            <Backdrop open={true} className={` ${"backdropElement"}`}>
              <Paper className={` ${"paperContainer"}`}>
                <Box
                  sx={{ display: "block", justifyContent: "flex-end" }}
                  className={"closeDeposit"}
                >
                  <Typography>
                    Accept the Terms of Service and Privacy Policy.{" "}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: "20px",
                    }}
                    className={"closeDeposit"}
                  >
                    <input
                      type="checkbox"
                      defaultChecked={isChecked}
                      onChange={() => setIsChecked(!isChecked)}
                    />
                    <Typography>
                      I agree that I have read, understood and accepted all of the{" "}
                      <a href={"./../assets/Terms_and_Conditions.pdf"} target="_blank">
                        Terms
                      </a>{" "}
                      and{" "}
                      <a href="./../assets/Privacy_Policy.pdf" target="_blank">
                        Privacy Policy
                      </a>{" "}
                      .
                    </Typography>
                  </Box>
                </Box>
                <Button
                  style={{ marginTop: "20px" }}
                  variant="contained"
                  color="primary"
                  disabled={!isChecked}
                  onClick={handleAgree}
                >
                  Agree
                </Button>
              </Paper>
            </Backdrop>
          </Fade>
        </Box>
      ) : (
        <Box paddingTop={5} paddingBottom={12} sx={{ height: "100vh" }}>
          <Header />
          <Growl />
          <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/borrow" element={<BorrowPage />} />
          <Route path="/lend" element={<LendPage />} />
          <Route path="/asset/:contractAddress/:tokenId" element={<AssetDetailsPage />} />
          <Route path="/my-account" element={<MyAccountPage />} />
          <Route path="/th" element={<TestHelper />} />
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
      )}
    </ThemeProvider>
  );
};

export default App;
