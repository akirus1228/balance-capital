import { Backdrop, Button, Fade, Grid, Icon, Paper } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import style from './deposit.module.scss';
import CloseIcon from '@mui/icons-material/Close';

/* eslint-disable-next-line */
export interface DepositProps {}

export const TradFiDeposit = (props: DepositProps): JSX.Element => {
  const { bondType } = useParams();
  const [isDeposit, setIsDeposit] = useState(true);
  
  return (
    <Fade in={true} mountOnEnter unmountOnExit>
      <Backdrop open={true}>
        <Paper className={`${style['flexCenterCol']} ${style['paperContainer']}`}>
          <Box sx={{display: 'flex', justifyContent:'flex-end'}}>
            <Button variant="outlined">
              <Icon component={CloseIcon} />
            </Button>
          </Box>
          <Box>
            <h3>Fixed Deposit</h3>
            <h2>{bondType}</h2>
          </Box>
          <Grid container>
            <Grid item xs={12} md={3}>
              Wallet Balance
            </Grid>
            <Grid item xs={12} md={5}>
              Amount
            </Grid>
            <Grid item xs={12} md={4}>
              <Button>Deposit</Button>
            </Grid>
            <Grid item xs={12}>
              <Box className={style['flexCenterRow']}>
                <h1>BOX</h1>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box className={style['flexCenterRow']}>
                <h2>BOX</h2>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Backdrop>
    </Fade>
  );
}

export default TradFiDeposit;
