import {useCallback, useState} from "react";
import {Box, Button, Grid, Icon} from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import style from "./staking-card.module.scss";
import DaiCard from "../../../components/dai-card/dai-card";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {DaiToken} from "@fantohm/shared/images";
import {useDispatch, useSelector} from "react-redux";
import {
  bondAsset,
  BondType, changeApproval,
  error, IAllBondData,
  IBondAssetAsyncThunk, isPendingTxn, redeemBond,
  trim, txnButtonText,
  useBonds,
  useWeb3Context
} from "@fantohm/shared-web3";
import { RootState } from '../../../store';


interface IStakingCardParams {
  bondType: string;
  term: number;
  roi: number;
  apy: number;
}

export const StakingCard = (params: IStakingCardParams): JSX.Element => {
  const [cardState, setCardState] = useState("deposit");
  const [quantity, setQuantity] = useState("");
  const dispatch = useDispatch();
  const {provider, address, chainId} = useWeb3Context();
  const {bonds} = useBonds(chainId || 250);
  const singleSidedBond = bonds.filter(bond => bond.type === BondType.SINGLE_SIDED)[0] as IAllBondData

  const toggleStakingDirection = useCallback(() => {
    setCardState(cardState === "deposit" ? "redeem" : "deposit");
  }, [cardState])

  const daiBalance = useSelector((state: RootState) => {
    return trim(Number(state.account.balances.dai), 2);
  });

  const setMax = () => {
    if (cardState === "deposit") {
      setQuantity(daiBalance);
    } else {
      setQuantity("");
    }
  };

  const pendingTransactions = useSelector((state: RootState) => {
    return state?.pendingTransactions;
  });

  const hasAllowance = useCallback(() => {
    return singleSidedBond && singleSidedBond.allowance > 0;
  }, [JSON.stringify(singleSidedBond)]);


  async function useBond() {
    const slippage = 0;

    if (Number(quantity) === 0) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch(error("Please enter a value!"));
    } else if (isNaN(Number(quantity))) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch(error("Please enter a valid value!"));
    } else if (singleSidedBond.userBonds.length > 0 && (singleSidedBond.userBonds[0].interestDue > 0 || Number(singleSidedBond.userBonds[0].pendingPayout) > 0)) {
      if (cardState === "redeem") {
        // dispatch(
        //   redeemBond({
        //     value: String(quantity),
        //     slippage,
        //     bond: singleSidedBond,
        //     networkId: chainId || 250,
        //     provider,
        //     address: address,
        //   } as IBondAssetAsyncThunk)
        // );
      }
      const shouldProceed = window.confirm(
        "You have an existing bond. Bonding will reset your vesting period and forfeit rewards. We recommend claiming rewards first or using a fresh wallet. Do you still want to proceed?",
      );
      if (shouldProceed) {
        dispatch(
          bondAsset({
            value: String(quantity),
            slippage,
            bond: singleSidedBond,
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
          bond: singleSidedBond,
          networkId: chainId || 250,
          provider,
          address: address,
        } as IBondAssetAsyncThunk)
      );
      clearInput();
    }
  }

  const clearInput = () => {
    setQuantity("0");
  };

  const onSeekApproval = async () => {
    if (provider) {
      dispatch(changeApproval({address, bond: singleSidedBond, provider, networkId: chainId ?? 250}));
    }
  };

  return (
    <DaiCard>
      <h3 className={style['titleWrapper']}>Single</h3>
      <h1>DAI Liquidity Pool</h1>
      <Box sx={{width: '100%'}}>
        <hr style={{border: 'none', borderTop: '2px solid rgba(105,108,128,0.07)'}}/>
      </Box>
      <Box className={`flexCenterRow`}>
        <Box className={`${style['smokeyToggle']} ${cardState === "deposit" ? style['active'] : ""}`} sx={{mr: '1em'}}
             onClick={toggleStakingDirection}>
          <div className={style['dot']}/>
          <span>Deposit</span>
        </Box>
        <Box className={`${style['smokeyToggle']} ${cardState === "redeem" ? style['active'] : ""}`}
             onClick={toggleStakingDirection}>
          <div className={style['dot']}/>
          <span>Redeem</span>
        </Box>
      </Box>
      <Box className={`flexCenterRow`}>
        <h1>{params.apy}% APR</h1>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box className={`flexCenterRow ${style['currencySelector']}`}>
            <img src={DaiToken} style={{height: '31px', marginRight: "1em"}} alt="DAI Token Symbol"/>
            <Box sx={{display: "flex", flexDirection: "column", justifyContent: "left"}}>
              <span className={style['name']}>DAI balance</span>
              <span className={style['amount']}>{daiBalance} DAI</span>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box className={`${style['currencySelector']}`} flexGrow={1}>
            <input type="number" placeholder="0.00" min="0" value={quantity} onChange={e => setQuantity(e.target.value)}/>
            <span className={style['amount']} onClick={setMax}>Max</span>
          </Box>
        </Grid>
      </Grid>
      <Box className={`flexSBRow w100`} sx={{mt: '1em'}}>
        <span>Your deposit <Icon component={InfoOutlinedIcon}/></span>
        <span>100.00 DAI</span>
      </Box>
      <Box className={`flexSBRow w100`} sx={{mb: '1em'}}>
        <span>Reward amount <Icon component={InfoOutlinedIcon}/></span>
        <span>20.00 FHM</span>
      </Box>
      <Box className={`${style["infoBox"]}`} sx={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
        <Icon component={InfoOutlinedIcon} sx={{mr: "0.5em"}}/>
        <span>Deposit DAI into this pool for FHM rewards with no impermanent loss or deposit fees</span>
      </Box>
      {!singleSidedBond || !singleSidedBond.isAvailable[chainId ?? 250] ? (
        <Button variant="contained" color="primary" id="bond-btn" className="transaction-button" disabled={true}>
          Sold Out
        </Button>
      ) : hasAllowance() ? (
        <Button
          variant="contained"
          color="primary"
          className="cardActionButton"
          disabled={isPendingTxn(pendingTransactions, "bond_" + singleSidedBond.name)}
          onClick={useBond}>
          {txnButtonText(pendingTransactions, "bond_" + singleSidedBond.name, cardState)}
        </Button>
      ) : (
        <Button
          variant="contained"
          color="primary"
          className="cardActionButton"
          disabled={isPendingTxn(pendingTransactions, "approve_" + singleSidedBond.name)}
          onClick={onSeekApproval}>
          {txnButtonText(pendingTransactions, "approve_" + singleSidedBond.name, "Approve")}
        </Button>
      )}
    </DaiCard>

  );
}

export default StakingCard;
