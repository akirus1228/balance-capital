import { MouseEvent, useState } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  SxProps,
  Theme,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { enabledNetworkIds, useWeb3Context } from "@fantohm/shared-web3";
import MenuLink from "./menu-link";
import styles from "./header.module.scss";
import UserMenu from "./user-menu";
import NotificationMenu from "./notification-menu";
import logo from "../../../../assets/images/logo.svg";

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
  const { connected, chainId } = useWeb3Context();
  const allowedChain = chainId && enabledNetworkIds.includes(chainId);
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Container maxWidth="xl" sx={{ pt: { xs: "1rem", md: "2.5rem" } }}>
        <Toolbar disableGutters>
          <Typography
            noWrap
            component="div"
            sx={{
              mr: 4,
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              fontSize: "28px",
              minWidth: "70px",
            }}
          >
            <Link to="/">
              <img src={logo} alt="liqd logo" style={{ height: "1.5em" }} />
            </Link>
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
            </Menu>
          </Box>
          <Typography
            component="div"
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
          >
            <Link to="/">
              <img src={logo} alt="liqd logo" style={{ height: "1.5em" }} />
            </Link>
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
              {pages.map((page: Page, index: number) => {
                return (
                  <Typography
                    key={`btn-${page.title}-${index}`}
                    textAlign="center"
                    style={{ opacity: page?.params?.comingSoon ? 0.2 : 1 }}
                  >
                    <Link to={page.href || "#"}>
                      <Button style={{ minWidth: "110px", padding: "1em 1em" }}>
                        {page.title}
                      </Button>
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
