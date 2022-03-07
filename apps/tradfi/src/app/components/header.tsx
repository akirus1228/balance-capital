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
import { MouseEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setWalletConnected } from '@fantohm/web3';

type PageParams = {
    sx?: SxProps<Theme> | undefined,
    comingSoon?: boolean
}

type Pages = {
    title: string,
    params?: PageParams
}

const pages: Pages[] = [
    {title: 'Fixed Deposits'}, 
    {title: 'Indexes', params: {comingSoon: true}},
    {title: 'Single Stocks', params: {comingSoon: true}}
];

export const Header = (): JSX.Element => {
    const { connect, disconnect, connected } = useWeb3Context();
    const dispatch = useDispatch()
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
    setAnchorElNav(null);
    };

    useEffect(() =>{
        dispatch(setWalletConnected(connected))
    },[connected])

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
                        {pages.map((page: Pages) => (
                            <MenuItem key={page.title} onClick={handleCloseNavMenu}>
                                <Typography textAlign="center">{page.title}</Typography>
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
                        {pages.map((page: Pages) => (
                            <Button
                                disabled={page.params?.comingSoon}
                                key={page.title}
                                onClick={handleCloseNavMenu}
                                sx={{...(page.params && page.params.sx), my: 2, color: 'white', display: 'block' }}
                            >
                                {page.title}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Connect Wallet">
                            <IconButton onClick={connect} sx={{ p: 0 }} color="primary">
                                <SvgIcon component={AccountBalanceWalletIcon} />
                            </IconButton>
                        </Tooltip>
                        
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}