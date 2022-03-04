import * as React from 'react';
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
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useWeb3Context } from '@fantohm/web3';

type PageParams = {
    sx?: SxProps<Theme> | undefined,
    comingSoon?: boolean
}

type pages = {
    title: string,
    params?: PageParams
}

const pages = [
    {title: 'Fixed Deposits'}, 
    {title: 'Indexes', params: {comingSoon: true}},
    {title: 'Single Stocks', params: {comingSoon: true}}
];

export const Header = (): JSX.Element => {
    const {connect} = useWeb3Context();
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
    setAnchorElNav(null);
    };

    return (
        <AppBar position="static" color="transparent" elevation={0}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
                        >
                        Axcapital Logo
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
                        {pages.map(({title, params}) => (
                            <MenuItem key={title} onClick={handleCloseNavMenu}>
                                <Typography textAlign="center">{title}</Typography>
                            </MenuItem>
                        ))}
                        </Menu>
                    </Box>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
                    >
                    Axcapital Logo
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, 'justify-content': 'right' }}>
                        {pages.map(({title, params}) => (
                            <Button
                                key={title}
                                onClick={handleCloseNavMenu}
                                sx={{...(params && params.sx), my: 2, color: 'white', display: 'block' }}
                            >
                                {title}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Connect Wallet">
                            <IconButton onClick={connect} sx={{ p: 0 }}>
                                <SvgIcon component={AccountBalanceWalletIcon} />
                            </IconButton>
                        </Tooltip>
                        
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}