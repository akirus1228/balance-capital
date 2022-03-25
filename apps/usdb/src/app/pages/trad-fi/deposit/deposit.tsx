import {Backdrop, Button, Fade, Grid, Icon, Paper, Typography} from '@mui/material';
import { Box } from '@mui/system';
import {useCallback, useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import style from './deposit.module.scss';
import CloseIcon from '@mui/icons-material/Close';
import {
  allBonds,
  Available, Bond,
  BondType, IAllBondData,
  isPendingTxn,
  StableBond,
  trim,
  txnButtonText,
  useBonds,
  useWeb3Context
} from "@fantohm/shared-web3";
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
import {ethers} from "ethers";

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
  const [bond, setBond] = useState<StableBond>();
  const [isDeposit, setIsDeposit] = useState(true);
  const accountSlice = useSelector(getAccountState);
  const tradfiBondData = bonds.filter(bond => bond.type === BondType.TRADFI)[0] as IAllBondData
  const tradfiBond = allBonds.filter(bond => bond.type === BondType.TRADFI)[0] as Bond

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
  const [claimableBalance, setClaimableBalance] = useState("0");
  const [payout, setPayout] = useState("0");
  const pendingTransactions = useSelector((state: RootState) => {
    return state?.pendingTransactions;
  });

  const daiBalance = useSelector((state: RootState) => {
    return trim(Number(state.account.balances.dai), 2);
  });

  useEffect(() => {
    if (tradfiBondData?.userBonds[0]) {
      setPayout(tradfiBondData?.userBonds.reduce((total, userBond) => total + userBond?.interestDue * userBond?.pricePaid, 0).toFixed(2));
      setClaimableBalance(tradfiBondData?.userBonds[0]?.pendingFHM);
    }
  }, [tradfiBondData?.userBonds])

  useEffect(() => {
    setBond(allBonds[0]);
  }, [bondType, allBonds]);

  const hasAllowance = useCallback(() => {
    return tradfiBondData && tradfiBondData.allowance && tradfiBondData.allowance > 0;
  }, [tradfiBondData]);

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
    } else {
      const slippage = 0;
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

  const setMax = () => {
    setQuantity(Number(daiBalance));
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
            <h1 className={style['title']}>{tradfiBond.displayName}</h1>
            <h2 className={style['subtitle']}>90 days</h2>
          </Box>
          <Grid container maxWidth="lg" columnSpacing={3}>
            <Grid item xs={12} md={4}>
              <WalletBallance sx={{ml: 'auto'}} balance={daiBalance}/>
            </Grid>
            <Grid item xs={12} md={4}>
              <InputWrapper>
                <span>Amount</span>
                <input type="number" placeholder="0.00" min="0" value={quantity} onChange={e => setQuantity(Number(e.target.value))}/>
                <span onClick={setMax}>Max</span>
              </InputWrapper>
            </Grid>
            <Grid item xs={12} md={4} sx={{pb: "3em", display:'flex', justifyContent:'flex-start', alignItems:'flex-start'}}>
              {!tradfiBond.isAvailable[chainId ?? 250] ? (
                <Button variant="contained" color="primary" id="bond-btn" className="transaction-button inputButton" disabled={true}>
                  Sold Out
                </Button>
              ) : hasAllowance() ? (
                <Button
                  variant="contained"
                  color="primary"
                  id="bond-btn"
                  className="transaction-button inputButton"
                  disabled={isPendingTxn(pendingTransactions, "bond_" + tradfiBond.name)}
                  onClick={useBond}
                >
                  {txnButtonText(pendingTransactions, "bond_" + tradfiBond.name, tradfiBond.bondAction)}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  id="bond-approve-btn"
                  className="transaction-button inputButton"
                  disabled={isPendingTxn(pendingTransactions, "approve_" + tradfiBond.name)}
                  onClick={onSeekApproval}
                >
                  {txnButtonText(pendingTransactions, "approve_" + tradfiBond.name, "Approve")}
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
            <Grid item xs={0} sm={1}>
              <Box style={{borderLeft: '2px solid #696C804F', height: '120%', width: '1px', marginLeft: 'auto', marginRight: 'auto', position: 'relative', top:'-0.5em'}}/>
            </Grid>
            <Grid item xs={12} sm>
                <Box sx={{display: 'flex', justifyContent: 'space-between', maxWidth: '361px'}}>
                  <span>Your deposit</span>
                  <span>{payout} DAI</span>
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
