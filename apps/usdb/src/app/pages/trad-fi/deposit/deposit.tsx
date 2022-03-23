import { Backdrop, Button, Fade, Grid, Icon, Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';
import {useCallback, useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import style from './deposit.module.scss';
import CloseIcon from '@mui/icons-material/Close';
import {Available, isPendingTxn, StableBond, txnButtonText, useBonds, useWeb3Context} from "@fantohm/shared-web3";
import { error } from "@fantohm/shared-web3";
import {useDispatch, useSelector} from "react-redux";
import {getAccountState, RootState} from "../../../store";
import {bondAsset, changeApproval} from "@fantohm/shared-web3";
import {
  IApproveBondAsyncThunk,
  IBondAssetAsyncThunk
} from "@fantohm/shared-web3";
import WalletBallance from '../../../components/wallet-ballance/wallet-ballance';
import InputWrapper from '../../../components/input-wrapper/input-wrapper';

export interface IBond {
  title: string;
}
export interface IBondType {
  [key: string]: IBond
}

// route: /trad-fi/deposit/:bondType
export const TradFiDeposit = (): JSX.Element => {
  const { provider, address, chainId } = useWeb3Context();
  const { bonds, allBonds } = useBonds(chainId || 250);
  const { bondType } = useParams();
  const [bond, setBond] = useState<StableBond>({
    displayName: '',
    allowance: 0,
    isAvailable: {'250': false} as Available
  } as StableBond);
  const [isDeposit, setIsDeposit] = useState(true);
  const accountSlice = useSelector(getAccountState);

  const bondTypes: IBondType = {
    '3month': {
      title: '3 Month'
    },
    '6month': {
      title: '6 Month'
    }
  };
  
  const SECONDS_TO_REFRESH = 60;
  const dispatch = useDispatch();
  
  const [quantity, setQuantity] = useState(0);
  const [secondsToRefresh, setSecondsToRefresh] = useState(SECONDS_TO_REFRESH);

  const pendingTransactions = useSelector((state: RootState) => {
    return state?.pendingTransactions;
  });

  useEffect(() => {
    setBond(allBonds[0]);
  }, [bondType, allBonds]);

  const hasAllowance = useCallback(() => {
    return bond && bond.allowance && bond.allowance > 0;
  }, [bond]);

  const isBondLoading = useSelector((state: RootState) => state?.bonding["loading"] ?? true);

  async function useBond() {

    if (quantity === 0) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch(error("Please enter a value!"));
    } else if (isNaN(Number(quantity))) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch(error("Please enter a valid value!"));
    } else if (accountSlice && accountSlice.bonds && accountSlice.bonds['tradfi3month']) {
      const shouldProceed = window.confirm(
        "You have an existing bond. Bonding will reset your vesting period and forfeit rewards. We recommend claiming rewards first or using a fresh wallet. Do you still want to proceed?",
      );
      const slippage = 0;
      if (shouldProceed) {
        dispatch(
          bondAsset({
            value: String(quantity),
            slippage,
            bond: bond,
            networkId: chainId || 250,
            provider,
            address: address,
          } as IBondAssetAsyncThunk)
        );
      }
    } else {
      const slippage = 0.005;
      dispatch(
        bondAsset({
          value: String(quantity),
          slippage,
          bond: bond,
          networkId: chainId || 250,
          provider,
          address: address,
        } as IBondAssetAsyncThunk)
      );
      clearInput();
    }
  }

  const onSeekApproval = async () => {
    dispatch(changeApproval({address, provider, bond: bond, networkId: chainId} as IApproveBondAsyncThunk));
  };

  const clearInput = () => {
    setQuantity(0);
  };

  const navigate = useNavigate();
  const goBack = () => {
    navigate('/trad-fi#get-started');
  }

  return (
    <Fade in={true} mountOnEnter unmountOnExit>
      <Backdrop open={true}>
        <Paper className={` ${style['paperContainer']}`}>
          <Box sx={{display: 'flex', justifyContent:'flex-end'}}>
            <Button variant="contained" className="closeButton" onClick={goBack} disableElevation>
              <Icon component={CloseIcon} />
            </Button>
          </Box>
          <Box className={`flexCenterCol ${style['titleBlock']}`}>
            <Box sx={{backgroundColor: "primary.main"}} className={style['typeContainer']}>
              <Typography className={style['type']} color="primary.contrastText">Fixed Deposit</Typography>
            </Box>
            <h1 className={style['title']}>{bond.displayName}</h1>
            <h2 className={style['subtitle']}>90 days</h2>
          </Box>
          <Grid container maxWidth="lg" columnSpacing={3}>
            <Grid item xs={12} md={4}>
              <WalletBallance sx={{ml: 'auto'}} balance="4000.00"/>
            </Grid>
            <Grid item xs={12} md={4}>
              <InputWrapper>
                <span>Amount</span>
                <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))}/>
                <span>Max</span>
              </InputWrapper>
            </Grid>
            <Grid item xs={12} md={4} sx={{pb: "3em"}}>
              {!bond.isAvailable[chainId ?? 250] ? (
                <Button variant="contained" color="primary" id="bond-btn" className="transaction-button inputButton" disabled={true}>
                  Sold Out
                </Button>
              ) : hasAllowance() ? (
                <Button
                  variant="contained"
                  color="primary"
                  id="bond-btn"
                  className="transaction-button inputButton"
                  disabled={isPendingTxn(pendingTransactions, "bond_" + bond.name)}
                  onClick={useBond}
                >
                  {txnButtonText(pendingTransactions, "bond_" + bond.name, bond.bondAction)}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  id="bond-approve-btn"
                  className="transaction-button inputButton"
                  disabled={isPendingTxn(pendingTransactions, "approve_" + bond.name)}
                  onClick={onSeekApproval}
                >
                  {txnButtonText(pendingTransactions, "approve_" + bond.name, "Approve")}
                </Button>
              )}
            </Grid>
            <Grid item xs={12} sm>
                <Box sx={{display: 'flex', justifyContent: 'space-between', maxWidth: '361px', ml: 'auto'}}>
                  <span>ROI</span>
                  <span>5%</span>
                </Box>
                <Box sx={{display: 'flex', justifyContent: 'space-between', maxWidth: '361px', ml: 'auto'}}>
                  <span>APY</span>
                  <span>21.55%</span>
                </Box>
            </Grid>
            <Grid xs={0} sm={1}>
              <Box style={{borderLeft: '2px solid #696C804F', height: '120%', width: '1px', marginLeft: 'auto', marginRight: 'auto', position: 'relative', top:'-0.5em'}}/>
            </Grid>
            <Grid item xs={12} sm>
                <Box sx={{display: 'flex', justifyContent: 'space-between', maxWidth: '361px'}}>
                  <span>Your deposit</span>
                  <span>4,000.00 DAI</span>
                </Box>
                <Box sx={{display: 'flex', justifyContent: 'space-between', maxWidth: '361px'}}>
                  <span>Reward amount</span>
                  <span>200.52 USDB</span>
                </Box>
            </Grid>
          </Grid>
        </Paper>
      </Backdrop>
    </Fade>
  );
}

export default TradFiDeposit;
