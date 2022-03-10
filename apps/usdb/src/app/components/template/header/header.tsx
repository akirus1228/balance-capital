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
import { useWeb3Context,setWalletConnected } from '@fantohm/shared-web3';
import { useDispatch } from 'react-redux';
import USDBLogo from '../../../../assets/images/USDB-logo.svg';
import { Link } from 'react-router-dom';

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
  { title: 'Fixed Deposits', href: '/bonds' },
  { title: 'Indexes', params: { comingSoon: true } },
  { title: 'Single Stocks', params: { comingSoon: true } },
];

export const Header = (): JSX.Element => {
  const { connect, disconnect, connected } = useWeb3Context();
  const dispatch = useDispatch();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  useEffect(() => {
    dispatch(setWalletConnected(connected));
  }, [connected]);

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}
          >
            <Link to="/"><img src={USDBLogo} alt="USDB logo"/></Link>
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
                  <Typography textAlign="center"><Button href={page.href}>{page.title}</Button></Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
          >
            <img src={USDBLogo} />
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'flex-end',
              alignItems: 'end',
              flexDirection: 'row'
            }}
          >
            {pages.map((page: Pages) => (
              <Button
              autoCapitalize='none'  
              disabled={page.params?.comingSoon}
                key={page.title}
                href={page.href}
                sx={{...(page.params && page.params.sx)}}
              >
                {page.title}
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0, border: '1px solid #000', padding: '0.5em', borderRadius: '0.75em', mx: 2 }}>
            <Tooltip title="Connect Wallet">
              <Button onClick={connect} sx={{ p: 0 }} color="primary">
                {connected ? 'Disconnect' : 'Connect Wallet'}
              </Button>
            </Tooltip>
          </Box>
          <Box sx={{ flexGrow: 0, border: '1px solid #000', padding: '0.5em', borderRadius: '0.75em' }}>
            <Tooltip title="Toggle Light/Dark Mode">
              <IconButton onClick={connect} sx={{ p: 0 }} color="primary">
                <SvgIcon component={WbSunnyOutlinedIcon} />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
