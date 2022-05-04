import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { Box, Button, Grid, Skeleton } from "@mui/material";
import style from "../mint-nft.module.scss";
import { USDBToken } from "@fantohm/shared/images";
import {
  defaultNetworkId,
  getNftInfo,
  INftItemDetails,
  prettifySeconds,
  useWeb3Context,
  trim,
  getTokenPrice,
} from "@fantohm/shared-web3";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";

interface INftItemParams {
  nftId: number;
}

export const NftItem = (props: INftItemParams): JSX.Element => {
  const { provider, address, chainId, connect, disconnect, connected } = useWeb3Context();
  const { nftId } = props;
  const dispatch = useDispatch();
  const [fhmPrice, setFhmPrice] = useState(0);
  const [nftDetails, setNftDetails] = useState<INftItemDetails | null>(null);

  useEffect(() => {
    dispatch(
      getNftInfo({
        id: 0,
        networkId: chainId || defaultNetworkId,
        callback: async (nft: INftItemDetails) => {
          setNftDetails(nft);
          console.log(nft);
        },
      })
    );
  }, [connected, address, dispatch]);

  useEffect(() => {
    async function fetchPrice() {
      setFhmPrice(await getTokenPrice("fantohm"));
    }

    fetchPrice().then();
  }, []);

  if (nftDetails === null) return <Skeleton />;

  const getCurrentValue = () => {
    if (!nftDetails) return 0;
    return trim(
      nftDetails?.pricePaid * Number(ethers.utils.formatUnits(nftDetails?.fhmPayout, 9)),
      2
    );
  };

  return (
    <Grid container spacing={0} flex={1}>
      <Grid item xs={12} md={5} flex={1}>
        <Box className={style["nftImageBox"]}>
          <label>NFT Image here</label>
        </Box>
      </Grid>
      <Grid item xs={12} md={7} flex={1} sx={{ padding: "1em" }}>
        <Box className={style["vestingDescription"]}>
          <span style={{ flex: 1 }}>Vesting period</span>
          <span>{Math.floor(nftDetails.vestingSeconds / (3600 * 24))} days</span>
        </Box>
        <Box className={style["vestingDescription"]}>
          <span style={{ flex: 1 }}>Invested</span>
          <span>{trim(nftDetails.usdbAmount, 2)} USDB</span>
        </Box>
        <Box className={style["vestingDescription"]}>
          <span style={{ flex: 1 }}>Current value</span>
          <span>
            {getCurrentValue()} USDB
            <br />
            {trim(nftDetails.sFhmBalance, 2)} sFHM
            <br />
            ~$ {trim(fhmPrice * nftDetails.sFhmBalance + Number(getCurrentValue()), 2)}
          </span>
        </Box>
        <Box className={style["vestingDescription"]}>
          <span style={{ flex: 1 }}>Time remaining</span>
          <span>
            {nftDetails.secondsToVest > 0
              ? prettifySeconds(nftDetails.secondsToVest)
              : "Fully vested"}
          </span>
        </Box>
        {nftDetails.secondsToVest < 0 ? (
          <Box sx={{ display: "flex", mt: "1em" }}>
            <Button
              variant="contained"
              color="primary"
              className="border"
              sx={{ flex: 1, margin: "10px" }}
              onClick={() => {}}
            >
              Sell
            </Button>
            <Button
              variant="contained"
              color="primary"
              className="border"
              sx={{ flex: 1, margin: "10px" }}
              onClick={() => {}}
            >
              Trade
            </Button>
          </Box>
        ) : null}
      </Grid>
    </Grid>
  );
};
