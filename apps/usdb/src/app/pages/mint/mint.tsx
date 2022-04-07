import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  bondAsset,
  BondType,
  changeApproval,
  error,
  IAllBondData,
  IBondAssetAsyncThunk,
  isPendingTxn,
  trim,
  txnButtonText,
  useBonds,
  useWeb3Context,
  getTokenPrice,
  allBonds,
  Bond
} from "@fantohm/shared-web3";
import { noBorderOutlinedInputStyles } from "@fantohm/shared-ui-themes";
import { DaiToken, FHMToken } from "@fantohm/shared/images";
import { Box, Grid, Button, Paper, OutlinedInput, InputAdornment, Typography, Icon } from "@mui/material";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import Carousel from "react-material-ui-carousel";

import style from "./mint.module.scss";
import LightMintDai0Img from "../../../assets/images/mint/light-mint-dai-0.png";
import LightMintDai1Img from "../../../assets/images/mint/light-mint-dai-1.png";
import LightMintDai2Img from "../../../assets/images/mint/light-mint-dai-2.png";
import LightMintFhm0Img from "../../../assets/images/mint/light-mint-fhm-0.png";
import LightMintFhm1Img from "../../../assets/images/mint/light-mint-fhm-1.png";
import LightMintFhm2Img from "../../../assets/images/mint/light-mint-fhm-2.png";
import DarkMintDai0Img from "../../../assets/images/mint/dark-mint-dai-0.png";
import DarkMintDai1Img from "../../../assets/images/mint/dark-mint-dai-1.png";
import DarkMintDai2Img from "../../../assets/images/mint/dark-mint-dai-2.png";
import DarkMintFhm0Img from "../../../assets/images/mint/dark-mint-fhm-0.png";
import DarkMintFhm1Img from "../../../assets/images/mint/dark-mint-fhm-1.png";
import DarkMintFhm2Img from "../../../assets/images/mint/dark-mint-fhm-2.png";
import { RootState } from "../../store";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function Mint() {

  const outlinedInputClasses = noBorderOutlinedInputStyles();

  const { provider, address, connected, connect, chainId } = useWeb3Context();
  const dispatch = useDispatch();
  const [tabState, setTabState] = React.useState(true);
  const [daiPrice, setDaiPrice] = React.useState(0);
  const [value, setValue] = React.useState("");
  const [fhmPrice, setFhmPrice] = React.useState(0);
  const { bonds } = useBonds(chainId || 250);
  const [bond, setBond] = useState(allBonds.filter(bond => bond.type === BondType.Bond_USDB)[0] as Bond);
  const [usdbBondData, setUsdbBondData] = useState(bonds.filter(bond => bond.type === BondType.Bond_USDB)[0] as IAllBondData);
  const [allowance, setAllowance] = React.useState(false);
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState(DaiToken);
  const themeType = useSelector((state: RootState) => state.app.theme);
  const tokenBalance = useSelector((state: any) => {
    // return trim(Number(state.account.balances.dai), 2);
    return state.account.balances;
  });

  const accountBonds = useSelector((state: RootState) => {
    return state.account.bonds;
  });

  const [usdbBond, setUsdbBond] = useState(accountBonds[usdbBondData?.name]);

  const isTabletScreen = useMediaQuery("(max-width: 970px)");

  const token = [
    {
      title: "Mint with DAI",
      name: "DAI",
      total: tokenBalance.dai,
      price: daiPrice,
      darkBanner: [
        {
          text: "Mint USDB to unlock the full potential of DeFi.",
          location: "center",
          img: DarkMintDai0Img
        },
        {
          text: "USDB is dependable for business solutions and stable for investor confidence.",
          img: DarkMintDai1Img
        },
        {
          text: "USDB is an algorithmic stablecoin catered to the needs DeFi of savvy investors, produced by a team obsessed with adoption.",
          img: DarkMintDai2Img
        }
      ],
      lightBanner: [
        {
          text: "Mint USDB to unlock the full potential of DeFi.",
          location: "center",
          img: LightMintDai0Img
        },
        {
          text: "USDB is dependable for business solutions and stable for investor confidence.",
          img: LightMintDai1Img
        },
        {
          text: "USDB is an algorithmic stablecoin catered to the needs DeFi of savvy investors, produced by a team obsessed with adoption.",
          img: LightMintDai2Img
        }
      ]
    },
    {
      title: "Mint with FHM",
      name: "FHM",
      total: tokenBalance.fhm,
      price: fhmPrice,
      darkBanner: [
        {
          text: "Minting USDB with FHM helps the protocol in sustaining long term growth potential and its a long term investment strategy",
          img: DarkMintFhm0Img
        },
        {
          text: "Using FHM to mint USDB helps utilize idle assets in the treasury for asset purchases without affecting market price",
          img: DarkMintFhm1Img
        },
        {
          text: "Minted by burning FHM, an asset built to capture value during all market conditions.",
          img: DarkMintFhm2Img
        }
      ],
      lightBanner: [
        {
          text: "Minting USDB with FHM helps the protocol in sustaining long term growth potential and its a long term investment strategy",
          img: LightMintFhm0Img
        },
        {
          text: "Using FHM to mint USDB helps utilize idle assets in the treasury for asset purchases without affecting market price",
          img: LightMintFhm1Img
        },
        {
          text: "Minted by burning FHM, an asset built to capture value during all market conditions.",
          img: LightMintFhm2Img
        }
      ]
    }
  ];

  useEffect(() => {
    async function fetchPrice() {
      setDaiPrice(await getTokenPrice("dai"));
      setFhmPrice(await getTokenPrice("fantohm"));
    }
    fetchPrice().then();
  }, []);

  const pendingTransactions = useSelector((state: RootState) => {
    return state?.pendingTransactions;
  });


  const onSeekApproval = async () => {
    if (provider) {
      dispatch(changeApproval({ address, bond: bond, provider, networkId: chainId ?? 250 }));
    }
  };

  useEffect(() => {
    setAllowance((bonds.filter(bond => bond.type === BondType.Bond_USDB)[0] as IAllBondData)?.allowance > 0);
  }, [bonds, usdbBondData, usdbBondData?.allowance]);

  const selectedToken = tabState ? token[0] : token[1];

  async function handleClick() {
    if (Number(quantity) === 0) {
      await dispatch(error("Please enter a value!"));
    } else if (isNaN(Number(quantity))) {
      await dispatch(error("Please enter a valid value!"));
    } else if (Number(quantity) > selectedToken.total) {
      await dispatch(error("Please enter a valid value!"));
    } else {
      dispatch(
        bondAsset({
          address,
          slippage: .005,
          value: quantity.toString(),
          provider,
          networkId: chainId,
          bond: bond
        } as IBondAssetAsyncThunk)
      );
    }
  };

  useEffect(() => {
    setUsdbBondData(bonds.filter(bond => bond.name === "usdbBuy")[0] as IAllBondData);
    setBond(allBonds.filter(bond => bond.name === "usdbBuy")[0] as Bond);
    setUsdbBond(accountBonds["usdbBuy"]);
  }, [usdbBondData?.userBonds]);

  function setBondState(bool: boolean) {
    if (bool) {
      setUsdbBondData(bonds.filter(bond => bond.name === "usdbBuy")[0] as IAllBondData);
      setBond(allBonds.filter(bond => bond.name === "usdbBuy")[0] as Bond);
      setUsdbBond(accountBonds["usdbBuy"]);
      setImage(DaiToken);
    } else {
      setUsdbBondData(bonds.filter(bond => bond.name === "usdbFhmBurn")[0] as IAllBondData);
      setBond(allBonds.filter(bond => bond.name === "usdbFhmBurn")[0] as Bond);
      setUsdbBond(accountBonds["usdbFhmBurn"]);
      setImage(FHMToken);
    }
    setTabState(bool);
  }

  const setMax = () => {
    if (selectedToken === token[0]) {
      setQuantity(tokenBalance.dai);
    } else {
      setQuantity(tokenBalance.fhm);
    }
  };


  return (
    <Box className={style["hero"]}>
      <div className={style["tabContent"]}>
        <Button
          className={style["tapButton"]}
          variant="text"
          onClick={() => setBondState(true)}
          style={{ borderBottom: `${tabState ? `solid 4px ${themeType === "light" ? "black" : "white"}` : "none"}` }}
        >
          Mint with DAI
        </Button>
        <Button
          variant="text"
          className={style["tapButton"]}
          onClick={() => setBondState(false)}
          style={{ borderBottom: `${tabState ? "none" : `solid 4px ${themeType === "light" ? "black" : "white"}`}` }}
        >
          Mint with FHM
        </Button>
      </div>
      <Grid container spacing={8} className={style["cardGrid"]}>
        <Grid item md={6} sx={{ width: "100%" }}>
          <Box className={style["subCardBorder"]}
               sx={{ borderRadius: "20px", background: `${themeType === "light" ? "white" : "black"}` }}>
            <Carousel
              sx={{ width: "100%", height: { xs: "330px", md: "550px" } }}
              indicatorContainerProps={{
                style: {
                  position: "absolute",
                  bottom: "15px",
                  zIndex: "1000"
                }
              }}
              indicatorIconButtonProps={{
                style: {
                  color: themeType === "light" ? "#877979" : "#808080"
                }
              }}
              activeIndicatorIconButtonProps={{
                style: {
                  color: themeType === "light" ? "black" : "white"
                }
              }}
            >
              {
                selectedToken[themeType === "light" ? "lightBanner" : "darkBanner"].map((item: any, index: number) =>
                  <Box
                    display="flex"
                    justifyContent="center"
                    key={`${themeType}_${selectedToken.title}_${index}`}
                    sx={{
                      backgroundImage: `url(${item.img})`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      width: "100%",
                      height: {
                        xs: "330px", md: "550px",
                        borderRadius: "20px"
                      }
                    }}>
                    <Box display="flex" justifyContent="center" sx={{alignItems: item?.location === 'center' ? "center": "end", px: `${isTabletScreen ? "10px" : "0"}`, width: {xs: "100%", md: "70%"}, paddingBottom: item?.location === 'center' ? "0": `${isTabletScreen ? "35px" : "100px"}`}}>
                      <Box display="flex">
                        <Icon component={InfoOutlinedIcon} fontSize={isTabletScreen ? "small" : "medium"} sx={{mt: `${isTabletScreen ? "1px" : "3px"}`, mr: `${isTabletScreen ? "5px" : "10px"}`}} />
                        <Typography variant={isTabletScreen ? "subtitle2" : "h6"} color="primary">
                          {item.text}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>)
              }
            </Carousel>
          </Box>
        </Grid>
        <Grid item md={6} sx={{ width: "100%" }}>
          <Paper className={`${style["subCard"]} ${style["subCardBorder"]}`}>
            <SettingsOutlinedIcon className={style["settingIcon"]} />
            <div className={style["subTitle"]}>{selectedToken.title}</div>
            <Grid container spacing={1}>
              <Grid item md={4} xs={12}>
                <div className={style["roundArea"]}>
                  <img src={image} className={style["daiIcon"]} style={{ marginRight: "10px" }} />
                  <div className={style["tokenInfo"]}>
                    <div className={style["tokenName"]}>
                      {selectedToken.name}
                    </div>
                    <div className={style["tokenValue"]}>
                      {trim(selectedToken.total, 9)}
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item md={8} xs={12}>
                <Box
                  className={style["roundArea"]}
                >
                  <OutlinedInput
                    id="amount-input-lqdr"
                    type="number"
                    placeholder="Enter an amount"
                    className="w100"
                    classes={outlinedInputClasses}
                    value={quantity}
                    onChange={(e) => {
                      if (Number(e.target.value) < 0 || e.target.value === "-") return;
                      setQuantity(e.target.value);
                    }}
                    inputProps={{
                      classes: {
                        notchedOutline: {
                          border: "none"
                        }
                      }
                    }}
                    startAdornment={
                      <InputAdornment position="end">
                        <Button className={style["no-padding"]} variant="text"
                                onClick={setMax}
                                color="primary">
                          Max
                        </Button>
                      </InputAdornment>
                    }
                  />
                </Box>
              </Grid>
            </Grid>
            <div className={style["reward"]}>
              <div>You will Get</div>
              <div>{(selectedToken.price * Number(quantity)).toFixed(3)} USDB</div>
            </div>
            <div style={{ marginTop: "30px" }}>
              {!connected ? (
                <Button variant="contained" color="primary" id="bond-btn" onClick={connect}>
                  Connect Wallet
                </Button>
              ) : (
                !bond?.isAvailable[chainId ?? 250] ? (
                  <Button variant="contained" color="primary" id="bond-btn" disabled={true}>
                    Sold Out
                  </Button>
                ) : allowance ? (
                  <Button
                    color="primary" variant="contained"
                    disableElevation
                    onClick={handleClick}
                    className={style["mintButton"]}
                  >
                    Mint USDB
                  </Button>
                ) : (
                  <Button
                    color="primary" variant="contained"
                    className={style["mintButton"]}
                    disabled={isPendingTxn(pendingTransactions, "approve_" + bond?.name)}
                    onClick={onSeekApproval}>
                    {txnButtonText(pendingTransactions, "approve_" + bond?.name, "Approve")}
                  </Button>))}
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
