import { Box, Grid, Paper, Typography } from '@mui/material';
import style from './ss-info-block.module.scss';
import { LightBankIcon, LightCardsIcon, LightDoughnutChartIcon, LightLockIcon, LightShieldIcon, TradFiIcon } from '@fantohm/shared/images';

/* eslint-disable-next-line */
export interface SsInfoBlockProps {}

export const SsInfoBlock = (props: SsInfoBlockProps): JSX.Element => {
  return (
    <Box sx={{mx: {xs: "1em", md: "3em"}}} className={style['infoBlockContainer']}>
      <Grid container spacing={12}>
        <Grid item xs={4}>
          <Box className="flexCenterCol" sx={{height: "100%"}}>
            <Paper className="softGradient" sx={{marginBottom: "3em", minHeight: "309px"}}>
              <Box className="flexCenterCol" sx={{height: "100%", justifyContent: 'flex-start'}}>
                <Typography variant="h1" style={{marginBottom: '1em'}}>No deposit fees</Typography>
                <img src={LightCardsIcon} alt="Illustration of Credit Cards Stacked" style={{width: '185px'}}/>
              </Box>
            </Paper>
            <Paper className="softGradient" sx={{height: "100%"}}>
              <Box className="flexCenterCol" >
                <Typography variant="h1">No lock up periods</Typography>
                <img src={LightLockIcon as string} alt="Illustration of padlock with a clock face" />
              </Box>
            </Paper>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box className="flexCenterCol" sx={{height: "100%"}}>
            <Paper className="softGradient" sx={{height: "100%"}}>
              <Box className={style['centerBox']} >
                <Typography variant="h1">Risk averse Investment</Typography>
                <Typography variant="h2">Lorem ipsum dolor sit amet, conctetur adipiscing elit. Etiam auctor commodo.</Typography>
                <img src={LightBankIcon as string} alt="Illustration depicting roman style building to infer a bank. USDB logo on the roof." style={{marginTop: 'auto', height: '305px'}}/>
              </Box>
            </Paper>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box className="flexCenterCol" sx={{height: "100%"}}>
            <Paper className="softGradient" sx={{marginBottom: "3em", minHeight: "309px"}}>
              <Box className="flexCenterCol">
                <Typography variant="h1">Zero Imperminant Loss</Typography>
                <img src={LightDoughnutChartIcon as string} alt="Illustration of doughnut chart with 1/4 filled in" />
              </Box>
            </Paper>
            <Paper className="softGradient" sx={{height: "100%"}}>
              <Box className="flexCenterCol">
                <Typography variant="h1">Earn Up to 20% Risk Free</Typography>
                <img src={LightShieldIcon as string} alt="Illustration of shield with a lock on front and graphs in front." />
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SsInfoBlock;
