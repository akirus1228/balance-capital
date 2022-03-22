import {
  Box, Button,
  Grid, Skeleton,
  Typography
} from "@mui/material";
import { formatAmount, truncateDecimals } from "@fantohm/shared-helpers";
import {
  addLiquidity,
  allAssetTokens,
  AssetToken,
  calcAssetAmount,
  error,
  isPendingTxn, lqdrApproval,
  NetworkIds, payoutForUsdb,
  txnButtonText,
  useWeb3Context, xfhmApproval
} from "@fantohm/shared-web3";
import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ethers } from "ethers";

import { AssetTokenModal } from "./asset-token-modal";
import { AssetSection } from "./asset-section";
import { RootState } from "../../store";
import useDebounce from "../../hooks/debounce";
import "./xfhm-lqdr.module.scss";

export const LqdrPage = (): JSX.Element => {

  const { chainId, address, provider } = useWeb3Context();
  const dispatch = useDispatch();

  const pendingTransactions = useSelector((state: RootState) => {
    return state?.pendingTransactions;
  });
  const details = useSelector((state: RootState) => {
    return state?.xfhm.details;
  });
  const assetTokens = useSelector((state: RootState) => {
    return state?.xfhm.assetTokens;
  });

  const [aToken, setAToken] = useState<AssetToken>(allAssetTokens[0]);
  const [bToken, setBToken] = useState<AssetToken>(allAssetTokens[1]);
  const [assetTokenModalOpen, setAssetTokenModalOpen] = useState(false);
  const [aTokenAmount, setATokenAmount] = useState<string>("");
  const [bTokenAmount, setBTokenAmount] = useState<string>("");
  const [bTokenLoading, setBTokenLoading] = useState<boolean>(false);
  const [usdbLoading, setUsdbLoading] = useState<boolean>(false);
  const [usdbAmount, setUsdbAmount] = useState<string>("");

  const bTokenAmountDebounce = useDebounce(bTokenAmount, 1000);

  const setMax = async (title: string) => {
    try {
      setBTokenLoading(true);
      if (title === "Asset A") {
        // @ts-ignore
        setATokenAmount(formatAmount(aToken?.balance || 0, aToken.decimals, 9));
        const maxAmount = await calcBTokenAmount(aToken?.balance || 0);
        // @ts-ignore
        setBTokenAmount(formatAmount(maxAmount, bToken.decimals, 9));
      } else {
        // @ts-ignore
        setBTokenAmount(formatAmount(bToken?.balance || 0, bToken.decimals, 9));
        const maxAmount = await calcATokenAmount(bToken?.balance || 0);
        // @ts-ignore
        setATokenAmount(formatAmount(maxAmount, aToken.decimals, 9));
      }
    } catch (e: any) {
      console.log(e);
    } finally {
      setBTokenLoading(false);
    }
  };

  const openAssetTokenModal = () => {
    setAssetTokenModalOpen(true);
  };

  const closeAssetTokenModal = (token: AssetToken) => {
    setAssetTokenModalOpen(false);
    if (!token) {
      return;
    }
    setBToken(token);
  };

  const calcBTokenAmount = async (aTokenAmount: number): Promise<any> => {
    if (!assetTokens || !assetTokens?.length || !provider || !chainId) {
      return 0;
    }
    const maxAmount = await dispatch(calcAssetAmount({
      address,
      action: "calculate-lqdr",
      value: (aTokenAmount || 0).toString(),
      provider,
      networkId: chainId
    }));
    // @ts-ignore
    return maxAmount?.payload;
  };

  const calcATokenAmount = async (bTokenAmount: number): Promise<any> => {
    if (!assetTokens || !assetTokens?.length || !provider || !chainId) {
      return 0;
    }
    const maxAmount = await dispatch(calcAssetAmount({
      address,
      action: "calculate-xfhm",
      value: (bTokenAmount || 0).toString(),
      provider,
      networkId: chainId
    }));
    // @ts-ignore
    return maxAmount?.payload;
  };

  const onAddLiquidity = async () => {
    if (!provider || !chainId) {
      return;
    }
    if (Number(bTokenAmount) > formatAmount(bToken.balance, bToken.decimals)) {
      dispatch(error(`You cannot deposit more than your ${bToken?.name} balance.`));
      return;
    }
    await dispatch(addLiquidity({
      address,
      value: ethers.utils.parseUnits(bTokenAmount, bToken.decimals).toString(),
      provider,
      token: bToken,
      networkId: chainId
    }));
  };

  const onSeekApproval = async (token: string) => {
    if (!provider || !chainId || !address) {
      return;
    }
    if (token === 'lqdr') {
      await dispatch(lqdrApproval({ address, provider, networkId: chainId || NetworkIds.FantomOpera }));
    }
    if (token === 'xfhm') {
      await dispatch(xfhmApproval({ address, provider, networkId: chainId || NetworkIds.FantomOpera }));
    }
  };

  const calcUsdbAmount = async () => {
    if (!provider || !chainId) {
      return;
    }
    try {
      setUsdbLoading(true);
      const usdbAmount = await dispatch(payoutForUsdb({
        address,
        value: ethers.utils.parseUnits(bTokenAmount, bToken.decimals).toString(),
        provider,
        networkId: chainId
      }));
      // @ts-ignore
      setUsdbAmount(usdbAmount?.payload.toString());
    } catch (e: any) {
      console.log(e);
    } finally {
      setUsdbLoading(false);
    }
  };

  useEffect(() => {
    if (!assetTokens || !assetTokens?.length) {
      return;
    }
    setAToken(assetTokens[0]);
    setBToken(assetTokens[1]);
  }, [assetTokens]);

  useEffect(() => {
    if (!bTokenAmount) {
      setUsdbAmount("0");
      return;
    }
    calcUsdbAmount().then();
  }, [bTokenAmountDebounce]);

  return (
    <Box className="flexCenterCol w-full">
      <AssetTokenModal open={assetTokenModalOpen} assetTokens={assetTokens} onClose={closeAssetTokenModal} />
      <Box>
        <Typography variant="h4" color="textPrimary" className="font-weight-bold">Add Liquidity</Typography>
      </Box>
      <AssetSection token={aToken} pairToken={bToken} title="Asset A" isMulti={false} amount={aTokenAmount}
                    setATokenAmount={setATokenAmount} setBTokenAmount={setBTokenAmount}
                    calcATokenAmount={calcATokenAmount} calcBTokenAmount={calcBTokenAmount}
                    setMax={setMax}
      />
      <AssetSection token={bToken} pairToken={aToken} title="Asset B" isMulti={true} amount={bTokenAmount}
                    setATokenAmount={setATokenAmount} setBTokenAmount={setBTokenAmount}
                    calcATokenAmount={calcATokenAmount} calcBTokenAmount={calcBTokenAmount}
                    openAssetTokenModal={openAssetTokenModal}
                    setMax={setMax}
      />
      <Box mt="30px" mb="20px">
        <Typography variant="h6" color="textPrimary" className="font-weight-bold">You get</Typography>
      </Box>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Box className="w-full" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <Box maxWidth="100%" display="flex" justifyContent="center">
              {!usdbLoading ? <Typography noWrap variant="h5" color="textPrimary"
                                          className="font-weight-bolder"
                                          textAlign="center">{formatAmount(usdbAmount, 18, 4, true)}</Typography> :
                <Skeleton width="100px" />}
              <Typography variant="h5" color="textPrimary"
                          className="font-weight-bolder" textAlign="center">USDB</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box className="w-full" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <Box maxWidth="100%" display="flex">
              {!bTokenLoading ? <Typography noWrap variant="h5" color="textPrimary"
                                            className="font-weight-bolder"
                                            textAlign="center">{truncateDecimals(bTokenAmount, 4)}</Typography> :
                <Skeleton width="100px" />}
              <Typography variant="h5" color="textPrimary"
                          className="font-weight-bolder" textAlign="center">LQDR</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Box className="w-full" height="1px" bgcolor="#a6a9be" my="20px" />
      <Box className="w-full" display="flex" justifyContent="space-between" mb="20px">
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          <Typography variant="h5" color="textPrimary" className="font-weight-bolder">My Pool Balance</Typography>
          <Typography variant="body2" color="textPrimary">USDB-LQDR LP</Typography>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          {details ? <Typography noWrap variant="h5" color="textPrimary" className="font-weight-bolder">{
              formatAmount(details.lqdrUsdbLpBalance, 18, 9, true)
            } LP</Typography> :
            <Skeleton width="100px" />}
        </Box>
      </Box>
      {
        details && !(details.lqdrAllowance > 0) &&
        <Box className="w-full" my="20px">
          <Button className="w-full thin" color="primary" variant="contained"
                  disabled={isPendingTxn(pendingTransactions, "approve-lqdr")}
                  onClick={() => onSeekApproval('lqdr')}>
            {txnButtonText(pendingTransactions, "approve-lqdr", "Approve LQDR")}
          </Button>
        </Box>
      }
      {
        details && !(details.xfhmForLqdrUsdbPolAllowance > 0) &&
        <Box className="w-full" my="20px">
          <Button className="w-full thin" color="primary" variant="contained"
                  disabled={isPendingTxn(pendingTransactions, "approve-xfhm")}
                  onClick={() => onSeekApproval('xfhm')}>
            {txnButtonText(pendingTransactions, "approve-xfhm", "Approve xFHM")}
          </Button>
        </Box>
      }
      {
        details && details.xfhmForLqdrUsdbPolAllowance > 0 && details.lqdrAllowance > 0 &&
        <Box className="w-full" my="20px">
          <Button className="w-full thin" color="primary" variant="contained"
                  disabled={isPendingTxn(pendingTransactions, "add-liquidity") || Number(bTokenAmount) <= 0}
                  onClick={() => onAddLiquidity().then()}>
            {txnButtonText(pendingTransactions, "add-liquidity", "Add Liquidity")}
          </Button>
        </Box>
      }
    </Box>
  );
};

export default memo(LqdrPage);
