import { MouseEvent, useEffect, useState } from 'react';
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
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import { useWeb3Context, setWalletConnected } from '@fantohm/shared-web3';
import { setTheme } from '../../../store/reducers/app-slice';
import { useDispatch, useSelector } from 'react-redux';
import USDBLogoLight from '../../../../assets/images/USDB-logo.svg';
import USDBLogoDark from '../../../../assets/images/USDB-logo-dark.svg';
import { Link } from 'react-router-dom';
import style from './header.module.scss';
import { RootState } from '../../../store';
import { getBalances } from '@fantohm/shared-web3';


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
  { title: 'Staking', href: '/staking' },
  { title: 'Traditional Finance', href: '/trad-fi' },
  { title: 'USDBank', params: { comingSoon: true } },
];

export const Header = (): JSX.Element => {
  const { connect, disconnect, connected, address } = useWeb3Context();
  const dispatch = useDispatch();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const themeType = useSelector((state: RootState) => state.app.theme);

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  useEffect(() => {
    dispatch(setWalletConnected(connected));
    dispatch(getBalances({networkId: 4002, address: address }));
  }, [connected]);

  const toggleTheme = () => {
    dispatch(setTheme(themeType === 'light' ? 'dark' : 'light'));
  }

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}
          >
            <Link to="/"><img src={themeType === 'light' ? USDBLogoLight : USDBLogoDark} alt="USDB logo"/></Link>
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
                <MenuItem key={page.title} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">
                    <Button href={page.href}>{page.title}</Button>
                  </Typography>
                </MenuItem>
              ))}

              <MenuItem onClick={handleCloseNavMenu}>
                <Typography textAlign="center">
                  <Button onClick={connect}>{connected ? 'Disconnect' : 'Connect Wallet'}</Button>
                </Typography>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Typography textAlign="center">
                  <Button onClick={toggleTheme}>
                    <SvgIcon component={WbSunnyOutlinedIcon} fontSize='large' />
                  </Button>
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
          <Typography
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
          >
            <img src={themeType === 'light' ? USDBLogoLight : USDBLogoDark} />
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'flex-end',
              alignItems: 'center',
              flexDirection: 'row'
            }}
          >
            {pages.map((page: Pages) => (
              <Box sx={{display: 'flex'}} key={page.title}>
                {!!page.params && typeof(page.params.comingSoon) == 'boolean' && page.params.comingSoon === true ?
                  (
                    <Box sx={{mx: '1.5em', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                      <span className={style['comingSoonTitle']}>
                        {page.title}
                      </span>
                      <span className={style['comingSoonSubtitle']}>
                        Coming Soon
                      </span>
                    </Box>
                  ) : (
                    <Button
                      autoCapitalize='none'
                      disabled={page.params?.comingSoon}
                      href={page.href}
                      sx={{...(page.params && page.params.sx)}}
                    >
                      {page.title}
                    </Button>
                  )}
              </Box>
            ))}
          </Box>
          <Tooltip title="Connect Wallet">
            <Button onClick={connect} sx={{ px: '3em', display: { xs: 'none', md: 'flex' }}} color="primary" className='menuButton'>
              {connected ? 'Disconnect' : 'Connect Wallet'}
            </Button>
          </Tooltip>
          <Tooltip title="Toggle Light/Dark Mode">
            <Button onClick={toggleTheme} sx={{ display: { xs: 'none', md: 'flex' }}} color="primary" className='menuButton'>
              <SvgIcon component={WbSunnyOutlinedIcon} fontSize='large' />
            </Button>
          </Tooltip>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
