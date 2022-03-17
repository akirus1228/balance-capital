import { Backdrop, Button, Fade, Grid, Icon, Paper } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import style from './deposit.module.scss';
import CloseIcon from '@mui/icons-material/Close';

/* eslint-disable-next-line */
export interface DepositProps {}
export interface IBond {
  title: string;
}
export interface IBondType {
  [key: string]: IBond
}

// route: /trad-fi/deposit/:bondType
export const TradFiDeposit = (props: DepositProps): JSX.Element => {
  const { bondType } = useParams();
  const [isDeposit, setIsDeposit] = useState(true);
  const bondTypes: IBondType = {
    '3month': {
      title: '3 Month'
    },
    '6month': {
      title: '6 Month'
    }
  };
  const [currentBond, setCurrentBond] = useState<IBond>({title: ''});

  const navigate = useNavigate();
  const goBack = () => {
    navigate('/trad-fi');
  }

  useEffect(() => {
    const thisBond: IBond = !!bondType && !!bondTypes[bondType] ? bondTypes[bondType] : {title: ''};
    setCurrentBond(thisBond);
  }, [bondType, bondTypes]);
  
  return (
    <Fade in={true} mountOnEnter unmountOnExit>
      <Backdrop open={true}>
        <Paper className={`${style['flexCenterCol']} ${style['paperContainer']}`}>
          <Box sx={{display: 'flex', justifyContent:'flex-end'}}>
            <Button variant="outlined" onClick={goBack}>
              <Icon component={CloseIcon} />
            </Button>
          </Box>
          <Box sx={{display: 'flex', flexDirection: 'column', alignItems:'center'}}>
            <h3>Fixed Deposit</h3>
            <h2>{currentBond.title}</h2>
          </Box>
          <Grid container maxWidth="lg">
            <Grid item xs={12} md={3}>
              Wallet Balance
            </Grid>
            <Grid item xs={12} md={5}>
              Amount <input type="number"/>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button>Deposit</Button>
            </Grid>
            <Grid item xs={6}>
                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                  <span>ROI</span>
                  <span>5%</span>
                </Box>
            </Grid>
            <Grid item xs={6}>
                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                  <span>Your deposit</span>
                  <span>4,000.00 DAI</span>
                </Box>
            </Grid>
          </Grid>
        </Paper>
      </Backdrop>
    </Fade>
  );
}

export default TradFiDeposit;
