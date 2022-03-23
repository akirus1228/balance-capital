import {useCallback, useEffect, useState} from "react";
import {Box, Button, Grid, Icon} from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import style from "./staking-card.module.scss";
import DaiCard from "../../../components/dai-card/dai-card";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {DaiToken} from "@fantohm/shared/images";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {USDCToken} from "@fantohm/shared/images";

import {useDispatch, useSelector} from "react-redux";
import {
  Bond,
  bondAsset,
  BondType, changeApproval, claimSingleSidedBond,
  error, getBalances, IAllBondData,
  IBondAssetAsyncThunk, IRedeemBondAsyncThunk, isPendingTxn, redeemSingleSidedBond, redeemSingleSidedILProtection,
  RootState, setWalletConnected,
  trim, txnButtonText,
  useBonds,
  useWeb3Context
} from "@fantohm/shared-web3";
import {allBonds} from "@fantohm/shared-web3";
import {ethers} from "ethers";


interface IStakingCardParams {
  bondType: string;
  term: number;
  roi: number;
  apy: number;
}

export const StakingCard = (params: IStakingCardParams): JSX.Element => {
  const [cardState, setCardState] = useState("deposit");
  const [quantity, setQuantity] = useState("");
  const [token, setToken] = useState("DAI");
  const dispatch = useDispatch();
  const {provider, address, chainId, connect, disconnect, connected} = useWeb3Context();
  const {bonds} = useBonds(chainId || 250);
  const singleSidedBondData = bonds.filter(bond => bond.type === BondType.SINGLE_SIDED)[0] as IAllBondData
  const singleSided = allBonds.filter(bond => bond.type === BondType.SINGLE_SIDED)[0] as Bond

  const accountBonds = useSelector((state: RootState) => {
    return state.account.bonds;
  });

  const singleSidedBond = accountBonds[singleSidedBondData?.name]

  const daiBalance = useSelector((state: RootState) => {
    return trim(Number(state.account.balances.dai), 2);
  });
  const [tokenBalance, setTokenBalance] = useState(daiBalance);

  const setMax = () => {
    if (cardState === "deposit") {
      setQuantity(daiBalance);
    } else if(cardState === "redeem") {
      setQuantity(String(singleSidedBond?.userBonds[0].lpTokenAmount));
    } else if(cardState === "ilredeem") {
      setQuantity(String(singleSidedBond?.userBonds[0].iLBalance));
    }
  };

  const pendingTransactions = useSelector((state: RootState) => {
    return state?.pendingTransactions;
  });

  const hasAllowance = useCallback(() => {
    return singleSidedBondData?.allowance > 0;
  }, [singleSidedBondData, connected, singleSidedBond]);

  useEffect(() => {
    if(cardState === "deposit"){
      setToken("DAI");
      setTokenBalance(daiBalance)
    } else if(cardState === "redeem"){
      setToken("LP");
      setTokenBalance(String(singleSidedBond?.userBonds[0]?.lpTokenAmount))
    } else if(cardState === "ilredeem"){
      setToken("USD");
      setTokenBalance(String(singleSidedBond?.userBonds[0]?.iLBalance))
    }
  }, [cardState, daiBalance]);

  async function useBond() {
    const slippage = 0;

    if (Number(quantity) === 0) {
      dispatch(error("Please enter a value!"));
    } else if (isNaN(Number(quantity))) {
      dispatch(error("Please enter a valid value!"));
    } else if (cardState === "redeem") {
      dispatch(
        redeemSingleSidedBond({
          value: String(quantity),
          bond: singleSided,
          networkId: chainId || 250,
          provider,
          address: address,
        } as IBondAssetAsyncThunk)
      );
    } else if (cardState === "deposit") {
      dispatch(
        bondAsset({
          value: String(quantity),
          slippage,
          bond: singleSided,
          networkId: chainId || 250,
          provider,
          address: address,
        } as IBondAssetAsyncThunk)
      );
    } else if (cardState === "claim") {
      dispatch(
        claimSingleSidedBond({
          value: String(quantity),
          slippage,
          bond: singleSided,
          networkId: chainId || 250,
          provider,
          address: address,
        } as IBondAssetAsyncThunk)
      );
    } else if (cardState === "ilredeem") {
      dispatch(
        redeemSingleSidedILProtection({
          bond: singleSided,
          networkId: chainId || 250,
          provider,
          address: address,
        } as IRedeemBondAsyncThunk)
      );
    }
    clearInput();
  }

  const clearInput = () => {
    setQuantity("0");
  };

  const onSeekApproval = async () => {
    if (provider) {
      dispatch(changeApproval({address, bond: singleSided, provider, networkId: chainId ?? 250}));
    }
  };

  return (
    <DaiCard tokenImage={DaiToken}>
      <h3 className={style['titleWrapper']}>Single</h3>
      <h1>DAI Liquidity Pool</h1>
      <Box sx={{width: '100%'}}>
        <hr style={{border: 'none', borderTop: '2px solid rgba(105,108,128,0.07)'}}/>
      </Box>
      <Box className={`flexCenterRow`}>
        <Box className={`${style['smokeyToggle']} ${cardState === "deposit" ? style['active'] : ""}`} sx={{mr: '1em'}}
             onClick={() => setCardState("deposit")}>
          <div className={style['dot']}/>
          <span>Deposit</span>
        </Box>
        <Box className={`${style['smokeyToggle']} ${cardState === "redeem" ? style['active'] : ""}`}
             onClick={() => setCardState("redeem")}>
          <div className={style['dot']}/>
          <span>Redeem</span>
        </Box>
        <Box className={`${style['smokeyToggle']} ${cardState === "claim" ? style['active'] : ""}`}
             onClick={() => setCardState("claim")}>
          <div className={style['dot']}/>
          <span>Claim</span>
        </Box>
        <Box className={`${style['smokeyToggle']} ${cardState === "ilredeem" ? style['active'] : ""}`}
             onClick={() => setCardState("ilredeem")}>
          <div className={style['dot']}/>
          <span>ILRedeem</span>
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
              <span className={style['name']}>{token} balance</span>
              <span className={style['amount']}>{tokenBalance} {token}</span>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box className={`${style['currencySelector']}`} flexGrow={1}>
            <input type="number" placeholder="0.00" value={quantity} onChange={e => setQuantity(e.target.value)}/>
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
      {!connected ? (
        <Button variant="contained" color="primary" id="bond-btn" className="transaction-button" onClick={connect}>
          Connect Wallet
        </Button>
      ) : (<>
        {!singleSided.isAvailable[chainId ?? 250] ? (
          <Button variant="contained" color="primary" id="bond-btn" className="transaction-button" disabled={true}>
            Sold Out
          </Button>
        ) : hasAllowance() ? (
          <Button
            variant="contained"
            color="primary"
            className="cardActionButton"
            disabled={isPendingTxn(pendingTransactions, "bond_" + singleSided.name)}
            onClick={useBond}>
            {txnButtonText(pendingTransactions, "bond_" + singleSided.name, cardState)}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            className="cardActionButton"
            disabled={isPendingTxn(pendingTransactions, "approve_" + singleSided.name)}
            onClick={onSeekApproval}>
            {txnButtonText(pendingTransactions, "approve_" + singleSided.name, "Approve")}
          </Button>
        )}
      </>)}
    </DaiCard>
  );
}

export default StakingCard;
