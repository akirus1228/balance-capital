import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Icon,
  InputAdornment,
  OutlinedInput,
  Skeleton,
} from "@mui/material";
import DaiCard from "../../components/dai-card/dai-card";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import style from "./mint-nft.module.scss";
import { USDBToken } from "@fantohm/shared/images";
import { NftItem } from "./nft/nft";
import {
  allBonds,
  Bond,
  BondType,
  changeApproval,
  defaultNetworkId,
  IAllBondData,
  IInvestUsdbNftBondAsyncThunk,
  investUsdbNftBond,
  isPendingTxn,
  trim,
  txnButtonText,
  useBonds,
  useWeb3Context,
  getNftInfo,
} from "@fantohm/shared-web3";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";

export const MintNftPage = (): JSX.Element => {
  const { provider, address, chainId, connect, disconnect, connected } = useWeb3Context();
  const { bonds } = useBonds(chainId || defaultNetworkId);

  const usdbBalance = useSelector((state: RootState) => {
    return trim(Number(state.account.balances.usdb), 2);
  });
  const [stdButtonColor, setStdButtonColor] = useState<"primary" | "error">("primary");
  const [tokenBalance, setTokenBalance] = useState(usdbBalance);
  const [amount, setAmount] = useState("");

  const [vestingPeriod, setVestingPeriod] = useState(30);
  const [valueRoi, setValueRoi] = useState("3.0");
  const [valueApy, setValueApy] = useState(42.58);
  const dispatch = useDispatch();
  const nftMetadataUri =
    "https://vids.invidme.com/nft-metadata/6faab9b2-96df-44f6-bd1e-fe7a9838632a";
  const [nftImageUri, setNftImageUri] = useState("");

  useEffect(() => {
    setTokenBalance(usdbBalance);
  }, [usdbBalance]);
  const accountBonds = useSelector((state: RootState) => {
    return state.account.bonds;
  });

  const fetchNftImageUri = async () => {
    const resp = await axios.get(nftMetadataUri);
    setNftImageUri(resp.data["image"]);
  };

  useEffect(() => {
    fetchNftImageUri();
  }, [nftMetadataUri]);

  const usdbNft = allBonds.filter((bond) => bond.type === BondType.USDB_NFT)[0] as Bond;

  const usdbNftBondData = bonds.filter(
    (bond) => bond.type === BondType.USDB_NFT
  )[0] as IAllBondData;
  const usdbNftBond = accountBonds[usdbNftBondData?.name];

  const pendingTransactions = useSelector((state: RootState) => {
    return state?.pendingTransactions;
  });

  const hasAllowance = useCallback(() => {
    return usdbNftBondData?.allowance > 0;
  }, [usdbNftBondData, connected, usdbNftBond]);

  const isOverBalance: boolean = useMemo(() => {
    if (Number(tokenBalance) < Number(amount)) return true;

    return false;
  }, [tokenBalance, amount]);

  const updateVestingPeriod = (period: number) => {
    const values = {
      30: ["3.0", 42.58],
      60: ["6.5", 45.91],
      90: ["10.0", 46.41],
    };
    setVestingPeriod(period);

    const value = values[period as keyof typeof values];
    setValueRoi(value[0] as string);
    setValueApy(value[1] as number);
  };

  const setMax = () => {
    setAmount(tokenBalance);
  };

  const onSeekApproval = () => {
    if (provider) {
      dispatch(
        changeApproval({
          address,
          bond: usdbNft,
          provider,
          networkId: chainId ?? defaultNetworkId,
        })
      );
    }
  };

  const onInvest = async () => {
    const slippage = 0;
    await dispatch(
      investUsdbNftBond({
        value: String(amount),
        bond: usdbNft,
        networkId: chainId || defaultNetworkId,
        provider,
        address,
        nftImageUri: nftMetadataUri,
      } as IInvestUsdbNftBondAsyncThunk)
    );
  };

  return (
    <>
      <Box className={style["__section"]}>
        <Box className="flexCenterCol" sx={{ marginTop: "3em", mb: "10em" }} id="deposit">
          <DaiCard
            tokenImage={USDBToken}
            setTheme="light"
            sx={{ minWidth: { xs: "300px", sm: "587px" } }}
            className={style["cardElement"]}
          >
            <h1>Mint NFT</h1>
            <Box className="w100">
              <hr
                style={{
                  border: "none",
                  borderTop: "2px solid rgba(105,108,128,0.07)",
                }}
              />
            </Box>

            <Box className="w100" flex={1}>
              <Grid container spacing={0} flex={1}>
                <Grid item xs={12} md={5} flex={1}>
                  <Box className={style["nftImageBox"]}>
                    {/* <label>NFT Image here</label> */}
                    {nftImageUri ? <img src={nftImageUri} /> : <Skeleton />}
                  </Box>
                </Grid>
                <Grid item xs={12} md={7} flex={1} sx={{ padding: "1em" }}>
                  Vesting Period
                  <Box className={`flexCenterRow w100`} sx={{ mb: "2em", mt: "1em" }}>
                    <Box
                      className={`${style["smokeyToggle"]} ${
                        vestingPeriod === 30 ? style["active"] : ""
                      }`}
                      onClick={() => updateVestingPeriod(30)}
                      flex={1}
                    >
                      <span>30 days</span>
                    </Box>
                    <Box
                      className={`${style["smokeyToggle"]} ${
                        vestingPeriod === 60 ? style["active"] : ""
                      }`}
                      onClick={() => updateVestingPeriod(60)}
                      flex={1}
                    >
                      <span>60 days</span>
                    </Box>
                    <Box
                      className={`${style["smokeyToggle"]} ${
                        vestingPeriod === 90 ? style["active"] : ""
                      }`}
                      onClick={() => updateVestingPeriod(90)}
                      flex={1}
                    >
                      <span>90 days</span>
                    </Box>
                  </Box>
                  <Box className={style["vestingDescription"]}>
                    <span style={{ flex: 1 }}>ROI</span>
                    <span>{valueRoi} %</span>
                  </Box>
                  <Box className={style["vestingDescription"]}>
                    <span style={{ flex: 1 }}>APY</span>
                    <span>{valueApy} %</span>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            <Box className="flexCenterRow w100" mt="20px">
              <Box
                className={`flexCenterRow ${style["currencySelector"]}`}
                sx={{ width: "245px" }}
              >
                <img
                  src={USDBToken}
                  style={{ height: "31px", marginRight: "1em" }}
                  alt="USDB Token Symbol"
                />
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                  }}
                >
                  <span className={style["name"]}>
                    Asset
                    <br />
                    <b>USDB balance</b>
                  </span>
                  <span className={style["amount"]}>
                    Balance
                    <br />
                    {tokenBalance === "null" ? <Skeleton /> : <b>{usdbBalance}</b>}
                  </span>
                </Box>
              </Box>
            </Box>
            <Box className={style["amountField"]}>
              <OutlinedInput
                id="amount-input-lqdr"
                type="number"
                placeholder="Enter an amount"
                className={`stake-input ${style["styledInput"]}`}
                value={amount}
                onChange={(e) => {
                  if (Number(e.target.value) < 0 || e.target.value === "-") return;
                  setAmount(e.target.value);
                }}
                inputProps={{
                  classes: {
                    notchedOutline: {
                      border: "none",
                    },
                  },
                }}
                startAdornment={
                  <InputAdornment position="end" className={style["maxButton"]}>
                    <Button
                      className={style["no-padding"]}
                      variant="text"
                      onClick={setMax}
                      color="inherit"
                    >
                      Max
                    </Button>
                  </InputAdornment>
                }
              />
            </Box>
            <Box
              className={`${style["infoBox"]}`}
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                mt: "1.5em",
                mb: "1.5em",
              }}
            >
              <Icon component={InfoOutlinedIcon} sx={{ mr: "0.5em" }} />
              <span>If needed</span>
            </Box>
            {hasAllowance() ? (
              <Button
                variant="contained"
                color={stdButtonColor}
                className="paperButton cardActionButton"
                disabled={
                  isPendingTxn(pendingTransactions, "invest_" + usdbNft.name) ||
                  isOverBalance ||
                  amount === "" ||
                  amount === "0" ||
                  Number(tokenBalance) === 0
                }
                onClick={onInvest}
              >
                {isOverBalance
                  ? "Insufficient Balance"
                  : txnButtonText(
                      pendingTransactions,
                      "invest_" + usdbNft.name,
                      "Invest"
                    )}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                className="paperButton cardActionButton"
                disabled={isPendingTxn(pendingTransactions, "approve_" + usdbNft.name)}
                onClick={onSeekApproval}
              >
                {txnButtonText(pendingTransactions, "approve_" + usdbNft.name, "Approve")}
              </Button>
            )}
          </DaiCard>
        </Box>
      </Box>
      <Box className="w100" flex={1}>
        <Grid container spacing={0} flex={1}>
          <Grid item xs={12} md={6} flex={1}>
            <NftItem nftId={0} />
          </Grid>
          {/* <Grid item xs={12} md={6} flex={1}>
            <NftItem nftId={0} />
          </Grid> */}
        </Grid>
      </Box>
    </>
  );
};
