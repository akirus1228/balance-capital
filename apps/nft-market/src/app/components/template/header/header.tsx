import { MouseEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  SvgIcon,
  SxProps,
  Theme,
} from "@mui/material";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import MenuIcon from "@mui/icons-material/Menu";
import { useWeb3Context, enabledNetworkIds } from "@fantohm/shared-web3";
import MenuLink from "./menu-link";
import { setCheckedConnection } from "../../../store/reducers/app-slice";
import styles from "./header.module.scss";
import UserMenu from "./user-menu";
import NotificationMenu from "./notification-menu";

type PageParams = {
  sx?: SxProps<Theme> | undefined;
  comingSoon?: boolean;
};

type Page = {
  title: string;
  params?: PageParams;
  href?: string;
};

const pages: Page[] = [
  { title: "Lend", href: "/lend" },
  { title: "Borrow", href: "/borrow" },
  { title: "Learn", href: "/learn" },
  { title: "Account", href: "/my-account" },
  { title: "About", href: "/about" },
];

export const Header = (): JSX.Element => {
  const { connect, connected, hasCachedProvider, chainId } = useWeb3Context();
  const dispatch = useDispatch();
  const allowedChain = chainId && enabledNetworkIds.includes(chainId);
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

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
                  href={page?.params?.comingSoon ? "#" : page.href}
                  onClick={handleCloseNavMenu}
                  key={page.title}
                >
                  <Typography
                    textAlign="center"
                    style={{ opacity: page?.params?.comingSoon ? 0.2 : 1 }}
                  >
                    <Button style={{ width: "100%" }}>{page.title}</Button>
                  </Typography>
                </MenuLink>
              ))}

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
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              {pages.map((page: any, index: number) => {
                return (
                  <Typography
                    key={`pagebtn-${index}`}
                    textAlign="center"
                    style={{ opacity: page?.params?.comingSoon ? 0.2 : 1 }}
                  >
                    <Link to={page.href}>
                      <Button style={{ width: "100%" }}>{page.title}</Button>
                    </Link>
                  </Typography>
                );
              })}
            </Box>
          </Box>
          <NotificationMenu />
          <UserMenu />
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
