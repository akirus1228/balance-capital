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
  BondType,
  changeApproval,
  claimSingleSidedBond,
  error,
  getBalances,
  IAllBondData,
  IBondAssetAsyncThunk,
  IRedeemBondAsyncThunk,
  isPendingTxn,
  redeemSingleSidedBond,
  redeemSingleSidedILProtection,
  setWalletConnected,
  trim,
  txnButtonText,
  useBonds,
  useWeb3Context
} from "@fantohm/shared-web3";

import {RootState} from '../../../store';
import {allBonds} from "@fantohm/shared-web3";
import {ethers} from "ethers";
import InputWrapper from "../../../components/input-wrapper/input-wrapper";


interface IStakingCardParams {
  bondType: string;
  term: number;
  roi: number;
  apy: number;
}

export const StakingCard = (params: IStakingCardParams): JSX.Element => {
  const [cardState, setCardState] = useState("Deposit");
  const [quantity, setQuantity] = useState("");
  const [token, setToken] = useState("DAI");
  const [claimableBalance, setClaimableBalance] = useState("0");
  const [payout, setPayout] = useState("0");
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
    if (cardState === "Deposit") {
      setQuantity(daiBalance);
    } else if (cardState === "Redeem") {
      setQuantity(String(singleSidedBond?.userBonds[0].lpTokenAmount));
    } else if (cardState === "ILredeem") {
      setQuantity(String(singleSidedBond?.userBonds[0].iLBalance));
    } else if (cardState === "Claim") {
      setQuantity(String(singleSidedBond?.userBonds[0].pendingFHM));
    }
  };
  useEffect(() => {
    if (singleSidedBond?.userBonds[0]) {
      setPayout(String(singleSidedBond?.userBonds[0]?.interestDue))
      setClaimableBalance(singleSidedBond?.userBonds[0]?.pendingFHM)
    }
  }, [singleSidedBond?.userBonds])

  const pendingTransactions = useSelector((state: RootState) => {
    return state?.pendingTransactions;
  });

  const hasAllowance = useCallback(() => {
    return singleSidedBondData?.allowance > 0;
  }, [singleSidedBondData, connected, singleSidedBond]);

  useEffect(() => {
    if (!address) setTokenBalance("0")
    else if (cardState === "Deposit") {
      setToken("DAI");
      setTokenBalance(daiBalance)
    } else if (cardState === "Redeem") {
      setToken("LP");
      const lpAmount = singleSidedBond?.userBonds[0]?.lpTokenAmount;
      setTokenBalance((typeof lpAmount === 'undefined') ? "0" : String(lpAmount))
    } else if (cardState === "ILredeem") {
      setToken("USD");
      const ilbal = singleSidedBond?.userBonds[0]?.iLBalance;
      setTokenBalance((typeof ilbal === 'undefined') ? "0" : String(ilbal))
    } else if (cardState === "Claim") {
      setToken("FHM");
      const pendingClaim = singleSidedBond?.userBonds[0]?.pendingFHM;
      setTokenBalance((typeof pendingClaim === 'undefined') ? "0" : String(pendingClaim))
    }
  }, [cardState, daiBalance, address]);

  async function useBond() {
    const slippage = 0;

    if (Number(quantity) === 0 && cardState !== "Claim") {
      dispatch(error("Please enter a value!"));
    } else if (isNaN(Number(quantity)) && cardState !== "Claim") {
      dispatch(error("Please enter a valid value!"));
    } else if (cardState === "Redeem") {
      dispatch(
        redeemSingleSidedBond({
          value: String(quantity),
          slippage,
          bond: singleSided,
          networkId: chainId || 250,
          provider,
          address: address,
        } as IBondAssetAsyncThunk)
      );
    } else if (cardState === "Deposit") {
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
    } else if (cardState === "Claim") {
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
    } else if (cardState === "ILredeem") {
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
    <DaiCard tokenImage={DaiToken} setTheme="light">
      <h3 className={style['titleWrapper']}>Single</h3>
      <h1>DAI Liquidity Pool</h1>
      <Box className="w100">
        <hr style={{border: 'none', borderTop: '2px solid rgba(105,108,128,0.07)'}}/>
      </Box>
      <Box className={`flexCenterRow`}>
        <Box className={`${style['smokeyToggle']} ${cardState === "Deposit" ? style['active'] : ""}`} sx={{mr: '1em'}}
             onClick={() => setCardState("Deposit")}>
          <div className={style['dot']}/>
          <span>Deposit</span>
        </Box>
        <Box className={`${style['smokeyToggle']} ${cardState === "Redeem" ? style['active'] : ""}`}
             onClick={() => setCardState("Redeem")}>
          <div className={style['dot']}/>
          <span>Redeem</span>
        </Box>
        <Box className={`${style['smokeyToggle']} ${cardState === "Claim" ? style['active'] : ""}`}
             onClick={() => setCardState("Claim")}>
          <div className={style['dot']}/>
          <span>Claim</span>
        </Box>
        <Box className={`${style['smokeyToggle']} ${cardState === "ILredeem" ? style['active'] : ""}`}
             onClick={() => setCardState("ILredeem")}>
          <div className={style['dot']}/>
          <span>ILRedeem</span>
        </Box>
      </Box>
      <Box className={`flexCenterRow`}>
        <h1>{params.apy}% APR</h1>
      </Box>
      <Box className="flexCenterRow">
          <Box className={`flexCenterRow ${style['currencySelector']}`} sx={{width: '245px'}}>
            <img src={DaiToken} style={{height: '31px', marginRight: "1em"}} alt="DAI Token Symbol"/>
            <Box sx={{display: "flex", flexDirection: "column", justifyContent: "left"}}>
              <span className={style['name']}>{token} balance</span>
              <span className={style['amount']}>{tokenBalance} {token}</span>
            </Box>
          </Box>

        {(cardState !== "Claim" && cardState !== "ILredeem") ? (
            <InputWrapper sx={{maxWidth: '245px', ml: '1em'}}>
              <input type="number" placeholder="0.00" min="0" value={quantity} onChange={e => setQuantity(e.target.value)} />
              <span className={style['amount']} onClick={setMax}>Max</span>
            </InputWrapper>
        ) : <></>}
      </Box>
      <Box className={`flexSBRow w100`} sx={{mt: '1em'}}>
        <span>Your deposit <Icon component={InfoOutlinedIcon}/></span>
        <span>{trim(Number(payout), 2)} DAI</span>
      </Box>
      <Box className={`flexSBRow w100`} sx={{mb: '1em'}}>
        <span>Estimated Rewards <Icon component={InfoOutlinedIcon}/></span>
        <span>{claimableBalance} FHM</span>
      </Box>
      <Box className={`${style["infoBox"]}`}
           sx={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', mb: '1.5em'}}>
        <Icon component={InfoOutlinedIcon} sx={{mr: "0.5em"}}/>
        <span>Deposit DAI into this pool for FHM rewards with no impermanent loss or deposit fees</span>
      </Box>
      {!connected ? (
        <Button variant="contained" color="primary" id="bond-btn" className="paperButton transaction-button"
                onClick={connect}>
          Connect Wallet
        </Button>
      ) : (
        !singleSided.isAvailable[chainId ?? 250] ? (
          <Button variant="contained" color="primary" id="bond-btn" className="paperButton transaction-button"
            disabled={true}>
            Sold Out
          </Button>
        ) : hasAllowance() ? (
          <Button
            variant="contained"
            color="primary"
            className="paperButton cardActionButton"
            disabled={isPendingTxn(pendingTransactions, "bond_" + singleSided.name)}
            onClick={useBond}>
            {txnButtonText(pendingTransactions, "bond_" + singleSided.name, cardState)}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            className="paperButton cardActionButton"
            disabled={isPendingTxn(pendingTransactions, "approve_" + singleSided.name)}
            onClick={onSeekApproval}>
            {txnButtonText(pendingTransactions, "approve_" + singleSided.name, "Approve")}
          </Button>
        )
      )}
    </DaiCard>
  );
}

export default StakingCard;
