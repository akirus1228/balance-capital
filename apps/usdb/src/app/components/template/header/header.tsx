import {
  useWeb3Context,
  setWalletConnected,
  getBalances,
  useBonds,
  trim,
  defaultNetworkId,
} from '@fantohm/shared-web3';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { SvgIcon, SxProps, Theme } from '@mui/material';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import { MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import MenuLink from './menu-link';
import { RootState } from '../../../store';
import { setCheckedConnection, setTheme } from '../../../store/reducers/app-slice';
import USDBLogoLight from '../../../../assets/images/USDB-logo.svg';
import USDBLogoDark from '../../../../assets/images/USDB-logo-dark.svg';
import styles from './header.module.scss';
import { NetworkMenu } from './network-menu';

type PageParams = {
  sx?: SxProps<Theme> | undefined;
  comingSoon?: boolean;
};

type Pages = {
  title: string;
  params?: PageParams;
  href?: string;
};

const pages: Pages[] = [
  // { title: 'Staking', href: '/staking' },
  { title: 'Traditional Finance', href: '/trad-fi' },
  // { title: 'Mint USDB', href: '/mint' },
  // { title: 'xFHM', href: '/xfhm?enable-testnet=true' },
  {
    title: 'Synapse Bridge',
    href: 'https://synapseprotocol.com/?inputCurrency=USDT&outputCurrency=USDC&outputChain=42161',
  },
];

export const Header = (): JSX.Element => {
  const {
    connect,
    disconnect,
    connected,
    address,
    hasCachedProvider,
    chainId,
  } = useWeb3Context();
  const dispatch = useDispatch();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElProductsMenu, setAnchorElProductsMenu] =
    useState<null | HTMLElement>(null);
  const [connectButtonText, setConnectButtonText] =
    useState<string>('Connect Wallet');

  const themeType = useSelector((state: RootState) => state.app.theme);
  const { bonds } = useBonds(chainId ?? defaultNetworkId);
  const accountBonds = useSelector((state: RootState) => {
    return state.account.bonds;
  });

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
      await connect();
    }
  }, [connected, disconnect, connect]);

  useEffect(() => {
    dispatch(setWalletConnected(connected));
    dispatch(
      getBalances({ address: address, networkId: chainId || defaultNetworkId })
    );
    if (connected) {
      setConnectButtonText('Disconnect');
    } else {
      setConnectButtonText('Connect Wallet');
    }
  }, [connected, address, dispatch]);

  useEffect(() => {
    // if there's a cached provider, try and connect
    if (hasCachedProvider && hasCachedProvider() && !connected) {
      connect();
    }
    // if there's a cached provider and it has connected, connection check is good.
    if (hasCachedProvider && hasCachedProvider && connected)
      dispatch(setCheckedConnection(true));
    
    // if there's not a cached provider and we're not connected, connection check is good
    if(hasCachedProvider && !hasCachedProvider() && !connected)
      dispatch(setCheckedConnection(true));
  }, [connected, hasCachedProvider, connect]);

  const toggleTheme = useCallback(() => {
    const type = themeType === 'light' ? 'dark' : 'light';
    dispatch(setTheme(type));
    localStorage.setItem('use-theme', type);
  }, [dispatch, themeType]);

  const useTheme = localStorage.getItem('use-theme');
  if (useTheme) {
    dispatch(setTheme(useTheme === 'dark' ? 'dark' : 'light'));
  }

  const handleCloseProductsMenu = () => {
    setAnchorElProductsMenu(null);
  };

  const totalBalances = useMemo(() => {
    if (accountBonds && chainId) {
      return bonds.reduce((prevBalance, bond) => {
        const bondName = bond.name;
        const accountBond = accountBonds[bondName];
        if (accountBond) {
          const userBonds = accountBond.userBonds;
          return (
            prevBalance +
            userBonds.reduce(
              (balance, bond) => balance + Number(bond.amount),
              0
            )
          );
        }
        return prevBalance;
      }, 0);
    }
    return 0;
  }, [address, JSON.stringify(accountBonds)]);

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      style={{ margin: 0 }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            noWrap
            component="div"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
            }}
          >
            <Link to="/">
              <img
                src={themeType === 'light' ? USDBLogoLight : USDBLogoDark}
                alt="USDB logo"
              />
            </Link>
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
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
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page: Pages) => (
                <MenuLink
                  href={page.href ? page.href : '#'}
                  onClick={handleCloseNavMenu}
                  key={page.title}
                >
                  <Typography textAlign="center">
                    <Button style={{ width: '100%' }}>{page.title}</Button>
                  </Typography>
                </MenuLink>
              ))}

              <MenuItem onClick={handleCloseNavMenu}>
                <Typography textAlign="center">
                  <Button onClick={handleConnect}>{connectButtonText}</Button>
                </Typography>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Typography textAlign="center">
                  <Button onClick={toggleTheme}>
                    <SvgIcon
                      component={WbSunnyOutlinedIcon}
                      fontSize="medium"
                    />
                  </Button>
                </Typography>
              </MenuItem>

              <MenuItem onClick={handleCloseNavMenu}>
                <Typography textAlign="center">
                  <Link to="/my-account">
                    <Button className="portfolio">
                      <Box display="flex" alignItems="center" mr="10px">
                        <SvgIcon component={AnalyticsIcon} fontSize="large" />
                      </Box>
                      <Box display="flex" alignItems="center" mt="2px">
                        My Portfolio:&nbsp;
                      </Box>
                      <Box display="flex" alignItems="center" mt="2px">
                        ${trim(totalBalances, 2)}
                      </Box>
                    </Button>
                  </Link>
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
          <Typography
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
          >
            <Link to="/">
              <img
                src={themeType === 'light' ? USDBLogoLight : USDBLogoDark}
                alt="USDB logo"
                className={`${styles['usdbLogo']}`}
              />
            </Link>
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'flex-start',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <Box>
              <Button
                className={`menuButton ${styles['productsButton']}`}
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
                  'aria-labelledby': 'products-button',
                }}
              >
                {pages.map((page: any) => {
                  return (
                    <MenuLink
                      href={page.href ? page.href : '#'}
                      onClick={handleCloseNavMenu}
                      key={page.title}
                    >
                      <Typography textAlign="center">
                        <Button style={{ width: '100%' }}>{page.title}</Button>
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
          {connected && (
            <Tooltip title={`My Portfolio: $${totalBalances}`}>
              <Link to="/my-account">
                <Button
                  className="portfolio"
                  sx={{ display: { xs: 'none', md: 'flex' } }}
                >
                  <Box display="flex" alignItems="center" mr="10px">
                    <SvgIcon component={AnalyticsIcon} fontSize="large" />
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    mt="2px"
                    sx={{ display: { xs: 'none', lg: 'flex' } }}
                  >
                    My Portfolio:&nbsp;
                  </Box>
                  <Box display="flex" alignItems="center" mt="2px">
                    ${trim(totalBalances, 2)}
                  </Box>
                </Button>
              </Link>
            </Tooltip>
          )}

          <Tooltip title="Connect Wallet">
            <Button
              onClick={handleConnect}
              sx={{ px: '3em', display: { xs: 'none', md: 'flex' } }}
              color="primary"
              className="menuButton"
            >
              {connectButtonText}
            </Button>
          </Tooltip>
          <Tooltip title="Toggle Light/Dark Mode">
            <Button
              onClick={toggleTheme}
              sx={{ display: { xs: 'none', md: 'flex' } }}
              color="primary"
              className={`menuButton ${styles['toggleTheme']}`}
            >
              <SvgIcon component={WbSunnyOutlinedIcon} fontSize="large" />
            </Button>
          </Tooltip>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
