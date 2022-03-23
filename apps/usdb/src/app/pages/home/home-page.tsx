import { Box, Container, Grid, Icon } from '@mui/material';
import style from './home-page.module.scss';
import IconGrid from './icon-grid/icon-grid';
import USDBLogoLight from '../../../assets/images/USDB-logo.svg';
import USDBLogoDark from '../../../assets/images/USDB-logo-dark.svg';
import { Link } from 'react-router-dom';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

export const HomePage = (): JSX.Element => {
  const themeType = useSelector((state: RootState) => state.app.theme);

  return (
    <Container
      maxWidth="xl"
      sx={{
        height: 'calc(100% - 89px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '112px',
        }}
        className={style['hero']}
      >
        <Grid
          container
          sx={{ marginTop: '55px' }}
          columnSpacing={2}
          rowSpacing={{ xs: 4, md: 0 }}
        >
          <Grid item lg={6} md={12} order={{ lg: 1, xs: 2 }}>
            <IconGrid />
          </Grid>
          <Grid item lg={6} md={12} order={{ lg: 2, xs: 1 }}>
            <Box className={style['heroRight']}>
              <Box sx={{ height: { xs: '132px', md: '180px' } }}>
                <img
                  src={themeType === 'light' ? USDBLogoLight : USDBLogoDark}
                  alt="USDB Logo"
                  className={style['heroLogo']}
                />
              </Box>
              <h1 className={style['heroTitle']}>
                Where traditional finance meets DeFi
              </h1>
              <h3 className={style['heroSubtitle']}>
                USDB provides a wide range of financial tools and services to
                individuals and institutions
              </h3>
              <Link to="/staking" className={style['heroLink']}>
                Learn more
                <Icon
                  component={ArrowUpwardIcon}
                  className={style['linkArrow']}
                />
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default HomePage;
