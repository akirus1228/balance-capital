import { Button, Icon, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Outlet } from 'react-router-dom';
import LongArrowRight from '../../../assets/icons/long-arrow-right.svg';
import DepositChoice from './deposit-choice/deposit-choice';
import style from './trad-fi.module.scss';

/* eslint-disable-next-line */
export interface TradfiProps {}

export const TradFi = (props: TradfiProps): JSX.Element => {
  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '300px'
    }}
    className={style['hero']}
  >
    <h1 className={style['heroH1']}>Take your investing to the next level</h1>
    <Typography variant="h2">The safest way to earn up to 32.5% on your stables.</Typography>
    <h2>No risk. No surprises.</h2>
    <Button sx={{marginTop: '55px', px: '3em', py: '1em'}} variant="outlined">
      Get started 
      <img src={LongArrowRight} alt="Arrow to the right" style={{marginLeft: '2em'}}/>
    </Button>
    <DepositChoice />
    <Outlet />
  </Box>
  );
}

export default TradFi;
