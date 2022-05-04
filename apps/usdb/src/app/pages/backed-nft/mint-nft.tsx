import { useState } from "react";
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

export const MintNftPage = (): JSX.Element => {
  const [vestingPeriod, setVestingPeriod] = useState(30);
  const [valueRoi, setValueRoi] = useState(3);
  const [valueApy, setValueApy] = useState(42.58);

  const updateVestingPeriod = (period: number) => {
    const values = {
      30: [3, 42.58],
      60: [3, 42.58],
      90: [3, 42.58],
    };
    setVestingPeriod(period);

    const value = values[period as keyof typeof values];
    setValueRoi(value[0]);
    setValueApy(value[1]);
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
                    <label>NFT Image here</label>
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
                  alt="DAI Token Symbol"
                />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "left",
                  }}
                >
                  <span className={style["name"]}>USDB balance</span>
                  {/* <span className={style["amount"]}>
                    {tokenBalance === "null" ? (
                      <Skeleton />
                    ) : (
                      <>
                        {tokenBalance} {token}{" "}
                      </>
                    )}
                  </span> */}
                </Box>
              </Box>
            </Box>
            <Box className={style["amountField"]}>
              <OutlinedInput
                id="amount-input-lqdr"
                type="number"
                placeholder="Enter an amount"
                className={`stake-input ${style["styledInput"]}`}
                // value={quantity}
                onChange={(e) => {
                  // if (Number(e.target.value) < 0 || e.target.value === "-") return;
                  // setQuantity(e.target.value);
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
                      // onClick={setMax}
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
            <Button
              variant="contained"
              color="primary"
              id="bond-btn"
              className="paperButton transaction-button"
            >
              Invest
            </Button>
          </DaiCard>
        </Box>
      </Box>
      <Box className="w100" flex={1}>
        <Grid container spacing={0} flex={1}>
          <Grid item xs={12} md={6} flex={1}>
            <NftItem />
          </Grid>
          <Grid item xs={12} md={6} flex={1}>
            <NftItem />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
