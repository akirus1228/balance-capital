import { Box, Grid, Typography } from "@mui/material";
import style from "./partners-grid.module.scss";
import {
  BeetsIcon,
  CIcon,
  CoinTelegramIcon,
  DebridgeIcon,
  DefiantIcon,
  DIAIcon,
  HuobiIcon,
  IncognitoIcon,
  LiquidDriverIcon,
  RangoIcon,
  SpookySwapIcon,
  SynapseIcon,
  UnknownIcon,
  WanchainIcon,
  WarpIcon,
  HackenIcon,
  SpadetechIcon,
  TechrateIcon,
} from "@fantohm/shared/images";
import lightBG from "../../../../../../../libs/shared/ui-themes/src/lib/images/USDB_gradient_light.png";

export const PartnersGrid = (): JSX.Element => {
  return (
    <Box
      style={{ alignContent: "center", justifyContent: "center", marginTop: "150px" }}
      className={style["productGrid"]}
    >
      <Grid
        container
        rowSpacing={6}
        style={{
          width: "60%",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: "20%",
        }}
        className={style["productGrid"]}
      >
        <Grid
          item
          md={12}
          xs={6}
          style={{
            justifyContent: "center",
            alignContent: "center",
            marginBottom: "30px",
          }}
        >
          <Typography
            className={style["partnerTitle"]}
            style={{ textAlign: "center", fontSize: "40px", fontWeight: "400" }}
          >
            Our partners
          </Typography>
        </Grid>
        <Grid
          container
          rowSpacing={6}
          className={style["productGrid"]}
          style={{
            height: "100%",
            justifyContent: "center",
            alignContent: "center",
          }}
          justifyContent="center"
        >
          <Grid item md={3} xs={6}>
            <img src={SpookySwapIcon} alt="USDB logo" className={style["partnerIcon"]} />
          </Grid>
          <Grid item md={3} xs={6}>
            <img
              title="FHM"
              src={DebridgeIcon}
              alt="USDB logo"
              className={style["partnerIcon"]}
            />
          </Grid>
          <Grid item md={3} xs={6}>
            <img
              title="Liquidity Solutions"
              src={LiquidDriverIcon}
              alt="USDB logo"
              className={style["partnerIcon"]}
            />
          </Grid>
          <Grid item md={3} xs={6}>
            <img
              title="NFT Lending"
              src={RangoIcon}
              alt="USDB logo"
              className={style["partnerIcon"]}
            />
          </Grid>
          <Grid item md={3} xs={6}>
            <img
              title="Financial NFTs"
              src={BeetsIcon}
              alt="USDB logo"
              className={style["partnerIcon"]}
            />
          </Grid>
          <Grid item md={3} xs={6}>
            <img
              title="USDB Bank"
              src={SynapseIcon}
              alt="USDB logo"
              className={style["partnerIcon"]}
            />
          </Grid>
          <Grid item md={3} xs={6}>
            <img src={IncognitoIcon} alt="USDB logo" className={style["partnerIcon"]} />
          </Grid>
          <Grid item md={3} xs={6}>
            <img src={HuobiIcon} alt="USDB logo" className={style["partnerIcon"]} />
          </Grid>
          <Grid item md={3} xs={6}>
            <img
              src={CoinTelegramIcon}
              alt="USDB logo"
              className={style["partnerIcon"]}
            />
          </Grid>
          <Grid item md={3} xs={6}>
            <img src={DefiantIcon} alt="USDB logo" className={style["partnerIcon"]} />
          </Grid>
          <Grid item md={3} xs={6}>
            <img src={CIcon} alt="USDB logo" className={style["partnerIcon"]} />
          </Grid>
          <Grid item md={3} xs={6}>
            <img src={UnknownIcon} alt="USDB logo" className={style["partnerIcon"]} />
          </Grid>
          <Grid item md={3} xs={6}>
            <img src={DIAIcon} alt="USDB logo" className={style["partnerIcon"]} />
          </Grid>
          <Grid item md={3} xs={6}>
            <img src={WanchainIcon} alt="USDB logo" className={style["partnerIcon"]} />
          </Grid>
          <Grid item md={3} xs={6}>
            <img src={WarpIcon} alt="USDB logo" className={style["partnerIcon"]} />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PartnersGrid;
