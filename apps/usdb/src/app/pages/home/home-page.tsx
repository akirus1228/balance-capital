import { Box, Button, Grid, Icon } from "@mui/material";
import style from "./home-page.module.scss";
import IconGrid from "./icon-grid/icon-grid";
import BUSDLogo from '../../../assets/images/USDB-logo.svg';
import { Link } from "react-router-dom";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

export const HomePage = ({ title }: { title: string }): JSX.Element => {
  return (
    <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '56px'
      }}
      className={style['hero']}
    >
      <Grid container sx={{marginTop: '55px'}}>
        <Grid item lg={6} md={12} order={{lg: 1, md:2}}>
          <IconGrid />
        </Grid>
        <Grid item lg={6} md={12} order={{lg: 2, md:1}}>
          <Box className={style['heroRight']}>
            <img src={BUSDLogo} alt="BUSD Logo" className={style['heroLogo']} />
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
  );
}

export default HomePage;
