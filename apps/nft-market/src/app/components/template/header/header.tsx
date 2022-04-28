import { MouseEvent, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  AppBar,
  Box,
  Skeleton,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  Tooltip,
  MenuItem,
  SvgIcon,
  SxProps,
  Theme,
} from "@mui/material";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import MenuIcon from "@mui/icons-material/Menu";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import {
  useWeb3Context,
  setWalletConnected,
  getBalances,
  trim,
  defaultNetworkId,
  enabledNetworkIds,
} from "@fantohm/shared-web3";
import MenuLink from "./menu-link";
import { RootState } from "../../../store";
import { setCheckedConnection } from "../../../store/reducers/app-slice";
import styles from "./header.module.scss";
import { NetworkMenu } from "./network-menu";
import { setTheme } from "@fantohm/shared-ui-themes";

type PageParams = {
  sx?: SxProps<Theme> | undefined;
  comingSoon?: boolean;
};

type Page = {
  title: string;
  params: PageParams;
  href?: string;
};

const pages: Page[] = [
  { title: "Lend", href: "/lend", params: { comingSoon: false } },
  { title: "Borrow", href: "/borrow", params: { comingSoon: false } },
  {
    title: "Bridge",
    href: "https://synapseprotocol.com/?inputCurrency=USDB&outputCurrency=USDB&outputChain=1",
    params: { comingSoon: false },
  },
];
export const Header = (): JSX.Element => {
  const { connect, disconnect, connected, address, hasCachedProvider, chainId } =
    useWeb3Context();
  const dispatch = useDispatch();
  const allowedChain = chainId && enabledNetworkIds.includes(chainId);
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElProductsMenu, setAnchorElProductsMenu] = useState<null | HTMLElement>(
    null
  );
  const [connectButtonText, setConnectButtonText] = useState<string>("Connect Wallet");

  const themeType = useSelector((state: RootState) => state.theme.mode);

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleConnect = useCallback(async () => {
    if (connected) {
      await disconnect();
    } else {
      try {
        await connect();
      } catch (e) {
        console.log("Connection metamask error", e);
      }
    }
  }, [connected, disconnect, connect]);

  useEffect(() => {
    dispatch(setWalletConnected(connected));
    dispatch(getBalances({ address: address, networkId: chainId || defaultNetworkId }));
    if (connected) {
      setConnectButtonText("Disconnect");
    } else {
      setConnectButtonText("Connect Wallet");
    }
  }, [connected, address, dispatch]);

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

  const toggleTheme = useCallback(() => {
    const type = themeType === "light" ? "dark" : "light";
    dispatch(setTheme(type));
  }, [dispatch, themeType]);

  const handleCloseProductsMenu = () => {
    setAnchorElProductsMenu(null);
  };

  return (
    <AppBar position="static" color="transparent" elevation={0} style={{ margin: 0 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            noWrap
            component="div"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              alignItems: "center",
            }}
          >
            <Link to="/">Logo</Link>
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              className={`${styles["navWrap"]}`}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page: Page) => (
                <MenuLink
                  // href={page.href ? page.href : '#'}
                  href={page.params.comingSoon ? "#" : page.href}
                  onClick={handleCloseNavMenu}
                  key={page.title}
                >
                  <Typography
                    textAlign="center"
                    style={{ opacity: page.params.comingSoon ? 0.2 : 1 }}
                  >
                    <Button style={{ width: "100%" }}>{page.title}</Button>
                  </Typography>
                </MenuLink>
              ))}

              <MenuItem
                sx={{ display: "flex", justifyContent: "start", padding: "0" }}
                onClick={handleCloseNavMenu}
                className={`${styles["mobileConnect"]}`}
              >
                <Typography textAlign="center">
                  <Button onClick={handleConnect}>{connectButtonText}</Button>
                </Typography>
              </MenuItem>
              <MenuItem
                sx={{ display: "flex", justifyContent: "start", padding: "0" }}
                onClick={handleCloseNavMenu}
                className={`${styles["mobileTheme"]}`}
              >
                <Typography textAlign="center">
                  <Button onClick={toggleTheme}>
                    <SvgIcon component={WbSunnyOutlinedIcon} fontSize="medium" />
                  </Button>
                </Typography>
              </MenuItem>

              <MenuItem
                sx={{
                  display: "flex",
                  justifyContent: "start",
                  paddingLeft: "20px",
                }}
                onClick={handleCloseNavMenu}
                className={`${styles["mobilePortfolio"]}`}
              >
                <Typography textAlign="center">
                  <Link to="/my-account">
                    <Button className="portfolio">
                      <Box display="flex" alignItems="center" mr="10px">
                        <SvgIcon component={AnalyticsIcon} fontSize="large" />
                      </Box>
                    </Button>
                  </Link>
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
          <Typography
            component="div"
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
          >
            <Link to="/">Logo</Link>
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "flex-start",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Box>
              <Button
                className={`menuButton ${styles["productsButton"]}`}
                onClick={(e) => setAnchorElProductsMenu(e.currentTarget)}
              >
                Products
              </Button>
              <Menu
                id="products-menu"
                anchorEl={anchorElProductsMenu}
                open={Boolean(anchorElProductsMenu)}
                onClose={handleCloseProductsMenu}
                MenuListProps={{
                  "aria-labelledby": "products-button",
                }}
              >
                {pages.map((page: any) => {
                  return (
                    <MenuLink
                      // href={page.href ? page.href : '#'}
                      href={page.params.comingSoon ? "#" : page.href}
                      onClick={handleCloseProductsMenu}
                      key={page.title}
                    >
                      <Typography
                        textAlign="center"
                        style={{ opacity: page.params.comingSoon ? 0.2 : 1 }}
                      >
                        <Button style={{ width: "100%" }}>{page.title}</Button>
                      </Typography>
                    </MenuLink>
                  );
                })}
              </Menu>
            </Box>
          </Box>

          <Box mr="1em">
            <NetworkMenu />
          </Box>

          <Tooltip title="Connect Wallet">
            <Button
              onClick={handleConnect}
              sx={{ px: "3em", display: { xs: "none", md: "flex" } }}
              color="primary"
              className="menuButton"
            >
              {connectButtonText}
            </Button>
          </Tooltip>
          <Tooltip title="Toggle Light/Dark Mode">
            <Button
              onClick={toggleTheme}
              sx={{ display: { xs: "none", md: "flex" } }}
              color="primary"
              className={`menuButton ${styles["toggleTheme"]}`}
            >
              <SvgIcon component={WbSunnyOutlinedIcon} fontSize="large" />
            </Button>
          </Tooltip>
        </Toolbar>
      </Container>
      {!allowedChain && connected && (
        <div className={styles["errorNav"]}>
          Network unsupported. Please change to one of: [Fantom, Ethereum]
        </div>
      )}
    </AppBar>
  );
};
