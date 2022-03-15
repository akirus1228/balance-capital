import { Box, Button, Container, Grid, Icon } from "@mui/material";
import style from "./home-page.module.scss";
import IconGrid from "./icon-grid/icon-grid";
import BUSDLogo from '../../../assets/images/USDB-logo.svg';
import { Link } from "react-router-dom";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

export const HomePage = ({ title }: { title: string }): JSX.Element => {
  return (
    <Container maxWidth="xl">
      <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '56px'
        }}
        className={style['hero']}
      >
        <Grid container sx={{marginTop: '55px'}} columnSpacing={2} rowSpacing={{xs: 4, md:0}}>
          <Grid item lg={6} md={12} order={{lg: 1, xs:2}}>
            <IconGrid />
          </Grid>
          <Grid item lg={6} md={12} order={{lg: 2, xs:1}}>
            <Box className={style['heroRight']}>
              <Box sx={{height: {xs: '132px', md: '180px'}}}>
                <img src={BUSDLogo} alt="BUSD Logo" className={style['heroLogo']} />
              </Box>
              <h1 className={style['heroTitle']}>Where traditional finance meets DeFi</h1>
              <h3 className={style['heroSubtitle']}>USDB others a plethora of financial tools and services for individuals and insitutions</h3>
              <Link to="/bonds" className={style['heroLink']}>
                Learn more
                <Icon component={ArrowUpwardIcon} className={style['linkArrow']}/>
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default HomePage;
