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
            marginLeft: "20%",
            alignContent: "center",
          }}
          justifyContent="center"
        >
          <Grid item md={3} xs={6}>
            <a href="https://spookyswap.finance/">
              <img
                src={SpookySwapIcon}
                alt="USDB logo"
                className={style["partnerIcon"]}
              />
            </a>
          </Grid>
          <Grid item md={3} xs={6}>
            <a href="https://debridge.finance/">
              <img
                title="FHM"
                src={DebridgeIcon}
                alt="USDB logo"
                className={style["partnerIcon"]}
              />
            </a>
          </Grid>
          <Grid item md={3} xs={6}>
            <a href="https://www.liquiddriver.finance/">
              <img
                title="Liquidity Solutions"
                src={LiquidDriverIcon}
                alt="USDB logo"
                className={style["partnerIcon"]}
              />
            </a>
          </Grid>
          <Grid item md={3} xs={6}>
            <a href="https://rango.exchange/">
              <img
                title="NFT Lending"
                src={RangoIcon}
                alt="USDB logo"
                className={style["partnerIcon"]}
              />
            </a>
          </Grid>
          <Grid item md={3} xs={6}>
            <a href="https://beets.fi/#/">
              <img
                title="Financial NFTs"
                src={BeetsIcon}
                alt="USDB logo"
                className={style["partnerIcon"]}
              />
            </a>
          </Grid>
          <Grid item md={3} xs={6}>
            <a href="https://synapseprotocol.com/landing">
              <img
                title="USDB Bank"
                src={SynapseIcon}
                alt="USDB logo"
                className={style["partnerIcon"]}
              />
            </a>
          </Grid>
          <Grid item md={3} xs={6}>
            <a href="https://incognito.org/">
              <img src={IncognitoIcon} alt="USDB logo" className={style["partnerIcon"]} />
            </a>
          </Grid>
          <Grid item md={3} xs={6}>
            <a href="https://www.huobiwallet.com/en">
              <img src={HuobiIcon} alt="USDB logo" className={style["partnerIcon"]} />
            </a>
          </Grid>
          <Grid item md={3} xs={6}>
            <a href="https://cointelegraph.com/">
              <img
                src={CoinTelegramIcon}
                alt="USDB logo"
                className={style["partnerIcon"]}
              />
            </a>
          </Grid>
          <Grid item md={3} xs={6}>
            <a href="https://thedefiant.io/">
              <img src={DefiantIcon} alt="USDB logo" className={style["partnerIcon"]} />
            </a>
          </Grid>
          <Grid item md={3} xs={6}>
            <a href="https://thedefiant.io/">
              <img src={CIcon} alt="USDB logo" className={style["partnerIcon"]} />
            </a>
          </Grid>
          <Grid item md={3} xs={6}>
            <a href="https://www.xdefi.io/">
              <img src={UnknownIcon} alt="USDB logo" className={style["partnerIcon"]} />
            </a>
          </Grid>
          <Grid item md={3} xs={6}>
            <a href="https://www.diadata.org/">
              <img src={DIAIcon} alt="USDB logo" className={style["partnerIcon"]} />
            </a>
          </Grid>
          <Grid item md={3} xs={6}>
            <a href="https://www.wanchain.org/">
              <img src={WanchainIcon} alt="USDB logo" className={style["partnerIcon"]} />
            </a>
          </Grid>
          <Grid item md={3} xs={6}>
            <a href="https://www.warp.finance/">
              <img src={WarpIcon} alt="USDB logo" className={style["partnerIcon"]} />
            </a>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PartnersGrid;
