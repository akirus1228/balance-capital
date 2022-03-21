import { Button, Grid, Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Outlet } from 'react-router-dom';
import LongArrowRight from '../../../assets/icons/long-arrow-right.svg';
import DepositChoice from './deposit-choice/deposit-choice';
import style from './trad-fi.module.scss';
import creditCards from '../../../assets/icons/credit-cards.svg';
import doughnutChart from '../../../assets/icons/doughnut-chart.svg';
import shield from '../../../assets/icons/shield.svg';
import Faq from '../../components/faq/faq';
import Logo from '../../components/logo/logo';
import Graph from './graph/graph';
import Headline from '../../components/headline/headline';

/* eslint-disable-next-line */
export interface TradfiProps {}

export const TradFi = (props: TradfiProps): JSX.Element => {
  const heroContent = {
    hero: true,
    title: "Take your investing to the next level",
    subtitle: ["The safest way to earn up to 32.5% on your stables.", "No risk. No surprises."]
  };
  const simpleSafe = {
    title: "Simple & safe returns",
    subtitle: ["USDB offers the safest way to earn up to 20% on your stables. No risk. No surprises."]
  };
  const getStarted = {
    title: "Get started today",
    subtitle: ["Lorem ipsum dolor sit amet, conctetur adipiscing elit. Etiam auctor commodo."]
  };
  return (
    <>
      <Box sx={{
        paddingTop: '300px'
      }}
      className={`flexCenterCol`}
    >
      <Headline hero={heroContent.hero}  title={heroContent.title} subtitle={heroContent.subtitle} />
      <a href="/trad-fi#get-started">
        <Button sx={{marginTop: '55px', px: '3em', py: '1em'}} variant="outlined">
          Get started 
          <img src={LongArrowRight} alt="Arrow to the right" style={{marginLeft: '2em'}}/>
        </Button>
      </a>
    </Box>
    <Box className={`flexCenterCol`}>
      <Box sx={{height: '20em'}}/>
      <Headline title={simpleSafe.title} subtitle={simpleSafe.subtitle} />
      <Graph />
      <Grid container spacing={2} maxWidth="md">
        <Grid item xs={12} md={4}>
          <Paper className={`${style['infoIcon']} ${style['lightBG']} softGradient`} elevation={0}>
            <img src={creditCards} alt="Credit Cards" />
            <span>no investment fee</span>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper className={`${style['infoIcon']} ${style['lightBG']} softGradient`} elevation={0}>
            <img src={doughnutChart} alt="Doughnut chart with a quarter filled" />
            <span>no management fee</span>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper className={`${style['infoIcon']} ${style['lightBG']} softGradient`} elevation={0}>
            <img src={shield} alt="Shield with lock" />
            <span>no risk of capital loss</span>
          </Paper>
        </Grid>
      </Grid>
    </Box>
    <Box sx={{height: '10em'}}/>
    <Headline title={getStarted.title} subtitle={getStarted.subtitle} />
    <DepositChoice id="get-started"/>
    <Outlet />
    <Faq />
    <Box className={`${style['tradFiBlock']} flexCenterCol`}>
      <Box sx={{height: '10em'}}/>
      <Headline title={simpleSafe.title} subtitle={simpleSafe.subtitle} />
    </Box>
    <Box className={`${style['tradFiBlock']} flexCenterCol`} sx={{paddingBottom: '4em'}}>
      <Logo />
    </Box>
  </>
  );
}

export default TradFi;
