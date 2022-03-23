import { Box, Grid, Paper, Typography } from '@mui/material';
import { LightBankIcon, LightCardsIcon, LightDoughnutChartIcon, LightLockIcon, LightShieldIcon } from '@fantohm/shared/images';
import style from './ss-info-block.module.scss';


export const SsInfoBlock = (): JSX.Element => {
  return (
    <Box sx={{mx: {xs: '1em', md: '3em'}}} className={style['infoBlockContainer']} maxWidth="lg" alignSelf="center">
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Box className='flexCenterCol h-full' sx={{alignItems:'flex-end'}}>
            <Paper className='softGradient' sx={{marginBottom: '2em', minHeight: '309px', width: '100%'}}>
              <Box className='flexCenterCol h-full' sx={{justifyContent: 'flex-start'}}>
                <Typography variant='h1' style={{marginBottom: '1em'}}>No Deposit Fees</Typography>
                <Box className='flexCenterCol h-full'>
                  <img src={LightCardsIcon} alt='Illustration of Credit Cards Stacked' style={{width: '185px'}}/>
                </Box>
              </Box>
            </Paper>
            <Paper className='softGradient h-full' sx={{width: '100%'}}>
              <Box className='flexCenterCol' >
                <Typography variant='h1'>No Lock-Up Periods</Typography>
                <Box className='flexCenterCol h-full'>
                  <img src={LightLockIcon} alt='Illustration of padlock with a clock face' />
                </Box>
              </Box>
            </Paper>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box className='flexCenterCol' sx={{height: '100%'}}>
            <Paper className='softGradient' sx={{height: '100%', width: '100%'}}>
              <Box className={style['centerBox']} >
                <Typography variant='h1'>Risk Averse Investment</Typography>
                <Typography variant='h2'>Investors only need to provide DAI, while our protocol provides the other token in the pair, USDB.</Typography>
                <Box className='flexCenterCol h-full'>
                  <img src={LightBankIcon} alt='Illustration depicting roman style building to infer a bank. USDB logo on the roof.'/>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box className='flexCenterCol' sx={{height: '100%'}}>
            <Paper className='softGradient' sx={{marginBottom: '2em', minHeight: '309px', width: '100%'}}>
              <Box className='flexCenterCol'>
                <Typography variant='h1'>Zero Imperminant Loss</Typography>
                <Box className='flexCenterCol h-full'>
                  <img src={LightDoughnutChartIcon} alt='Illustration of doughnut chart with 1/4 filled in' />
                </Box>
              </Box>
            </Paper>
            <Paper className='softGradient' sx={{height: '100%', width: '100%'}}>
              <Box className='flexCenterCol'>
                <Typography variant='h1'>Earn 20% APR</Typography>
                <Box className='flexCenterCol h-full'>
                  <img src={LightShieldIcon} alt='Illustration of shield with a lock on front and graphs in front.' />
                </Box>
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SsInfoBlock;
