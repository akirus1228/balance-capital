import { Backdrop, Button, Fade, Grid, Icon, Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';
import {useCallback, useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import style from './deposit.module.scss';
import CloseIcon from '@mui/icons-material/Close';
import {isPendingTxn, txnButtonText} from "@fantohm/shared-web3";
import { error } from "@fantohm/shared-web3";
import {useDispatch, useSelector} from "react-redux";
import {useWeb3Context} from "@fantohm/shared-web3";
import {RootState} from "../../../store";
import {bondAsset, changeApproval} from "@fantohm/shared-web3";
import {
  IApproveBondAsyncThunk,
  IBondAssetAsyncThunk
} from "@fantohm/shared-web3";
import WalletBallance from '../../../components/wallet-ballance/wallet-ballance';
import InputWrapper from '../../../components/input-wrapper/input-wrapper';

export interface DepositProps {
  bond: any;
}
export interface IBond {
  title: string;
}
export interface IBondType {
  [key: string]: IBond
}

// route: /trad-fi/deposit/:bondType
export const TradFiDeposit = (params: DepositProps): JSX.Element => {
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
  const SECONDS_TO_REFRESH = 60;
  const dispatch = useDispatch();
  const { provider, address, chainId } = useWeb3Context();

  const [quantity, setQuantity] = useState(0);
  const [secondsToRefresh, setSecondsToRefresh] = useState(SECONDS_TO_REFRESH);

  const pendingTransactions = useSelector((state: RootState) => {
    return state?.pendingTransactions;
  });

  const hasAllowance = useCallback(() => {
    return params.bond.allowance > 0;
  }, [params.bond.allowance]);

  // const currentBlock = useSelector((state: RootState) => {
  //   console.log(state)
  //   return state.app.currentBlock;
  // });
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
    } else if (params.bond.userBonds[0].interestDue > 0 || params.bond.userBonds[0].pendingPayout > 0) {
      const shouldProceed = window.confirm(
        "You have an existing bond. Bonding will reset your vesting period and forfeit rewards. We recommend claiming rewards first or using a fresh wallet. Do you still want to proceed?",
      );
      const slippage = 0;
      if (shouldProceed) {
        dispatch(
          bondAsset({
            value: String(quantity),
            slippage,
            bond: params.bond,
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
          bond: params.bond,
          networkId: chainId || 250,
          provider,
          address: address,
        } as IBondAssetAsyncThunk)
      );
      clearInput();
    }
  }

  const onSeekApproval = async () => {
    dispatch(changeApproval({address, provider, bond: params.bond, networkId: chainId} as IApproveBondAsyncThunk));
  };

  const clearInput = () => {
    setQuantity(0);
  };

  const navigate = useNavigate();
  const goBack = () => {
    navigate('/trad-fi#get-started');
  }

  // useEffect(() => {
  //   const thisBond: IBond = !!bondType && !!bondTypes[bondType] ? bondTypes[bondType] : {title: ''};
  //   setCurrentBond(thisBond);
  // }, [bondType, bondTypes]);

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
            <h1 className={style['title']}>{params.bond.displayName}</h1>
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
              {!params.bond.isAvailable[chainId ?? 250] ? (
                <Button variant="contained" color="primary" id="bond-btn" className="transaction-button inputButton" disabled={true}>
                  Sold Out
                </Button>
              ) : hasAllowance() ? (
                <Button
                  variant="contained"
                  color="primary"
                  id="bond-btn"
                  className="transaction-button inputButton"
                  disabled={isPendingTxn(pendingTransactions, "bond_" + params.bond.name)}
                  onClick={useBond}
                >
                  {txnButtonText(pendingTransactions, "bond_" + params.bond.name, params.bond.bondAction)}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  id="bond-approve-btn"
                  className="transaction-button inputButton"
                  disabled={isPendingTxn(pendingTransactions, "approve_" + params.bond.name)}
                  onClick={onSeekApproval}
                >
                  {txnButtonText(pendingTransactions, "approve_" + params.bond.name, "Approve")}
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
