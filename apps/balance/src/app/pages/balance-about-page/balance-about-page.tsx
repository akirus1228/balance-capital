import { Box, Button, Grid, Icon, Input, Paper, Typography } from "@mui/material";
import { useEffect } from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import Headline from "../../components/headline/headline";
import Logo from "../../components/logo/logo";
import style from "./balance-about-page.module.scss";
import {
  TeammateProfile,
  Teammate,
} from "../../components/teammate-profile/teammate-profile";
import {
  AboutBridge,
  AboutDivider,
  AboutFHM,
  AboutFinancialNFT,
  AboutLiquidity,
  AboutUSDB,
  AboutUSDBBank,
  AboutBalanceEcosystem,
  AboutNFTMarketplace,
} from "@fantohm/shared/images";
import BalanceAboutTile from "./balance-about-tile";
import Head from "../../components/template/head";

export const BalanceAboutPage = (): JSX.Element => {
  // mailchimp integration
  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.src =
  //     "https://chimpstatic.com/mcjs-connected/js/users/30ce909d3542b1d245b54e5b8/8e00ffff339710be3d1981967.js%22";
  //   script.async = true;
  //   document.body.appendChild(script);
  // }, []);

  return (
    <>
      {Head("about", "")}
      <Box style={{ textAlign: "center", paddingTop: "50px" }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "60px", md: "60px" },
            fontWeight: "500",
            color: "#ffffff",
          }}
        >
          About Us
        </Typography>
      </Box>
      <Grid
        container
        rowSpacing={6}
        className={style["productGrid"]}
        style={{ marginTop: "50px" }}
      >
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: { sm: "0%", md: "5%" },
            paddingRight: { sm: "0%", md: "5%" },
            width: { sm: "300px", md: "100%" },
          }}
        >
          <img
            src={AboutBalanceEcosystem as string}
            style={{ width: "100%" }}
            className={style["image"]}
            alt="BalanceEcosystem"
          />
        </Grid>
        <Grid
          item
          sm={12}
          md={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "center",
            paddingTop: "30px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
            className={style["iconLinkContainer"]}
          >
            <Grid item xs={10} md={12}>
              <h2 className={style["title"]}>The Balance Ecosystem</h2>
            </Grid>

            <Grid item xs={10} md={12}>
              <h3 className={style["text"]}>
                The Balance Ecosystem is an open-source economy of conjoined banking and
                commerce initiatives formed in March of 2022 with the unveiling of
                investment opportunities derived solely from the technical application,
                maintenance, and consumer use of USDB.
              </h3>
            </Grid>
            <Grid item xs={10} md={12}>
              <h3 className={style["text"]}>
                The Balance Ecosystem depends on the administration of the Balance
                Organisation to produce and refine the collected systems of FHM & USDB’s
                use cases until such a time as they might be further decentralised.
                Through a continuing dialogue between the Balance Organisation and the FHM
                Stakeholders’ DAO via governance throughout the development and
                implementation of these systems, the Balance Ecosystem aims to produce the
                first, ever, decentralised reserve currency.
              </h3>
            </Grid>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "30px",
          }}
        >
          <img src={AboutDivider as string} alt="divider" style={{ width: "100%" }} />
        </Grid>
      </Grid>
      <BalanceAboutTile
        icon={AboutUSDB}
        itemid="usdb"
        title="USDB Stablecoin"
        text="USDB is the Swiss Army Knife of stable coins, combining the benefits of algorithmic supply backing, protocol owned liquidity, traditional banking, and decentralized finance. There are 5 strategies to be employed in maintaining its peg. Over this next epoch of adoption, as USDB gains more use cases, each of these strategies will be deployed or refined as necessary."
        link="https://www.usdbalance.com/"
        docsLink="https://fantohm.gitbook.io/documentation/usdb/introduction"
      />
      <BalanceAboutTile
        icon={AboutFHM}
        itemid="fhm"
        title="FHM Protocol"
        text="FHM is a Reserve & Rewards Protocol inspired by the Protocol Owned Liquidity software developments of OHM. FHM features compounding, single disbursement bonds as the safest possible bonding mechanism to ensure the longevity of exchange liquidity in relation to neighbouring protocols with similar principles."
        link="https://fantohm.com/"
        docsLink="https://fantohm.gitbook.io/documentation/"
        learnMore="/fhm"
      />
      <BalanceAboutTile
        icon={AboutBridge}
        itemid="bridge"
        title="DEX & Bridge"
        text="Bridge & swap thousands of assets across multiple chains with the lowest fees. Through a partnership with Rango Exchange, transactions are intuitively routed through several aggregators to ensure you always get the cheapest fees."
        link="https://app.fantohm.com/#/dex"
      />
      <BalanceAboutTile
        icon={AboutLiquidity}
        itemid="liquidity"
        title="Liquidity Solution"
        text="We understand that managing token liquidity is tough. We’ve built the perfect solution to help projects maximise the liquidity they can unlock. Making sure deep liquidity is available for your ecosystem. Helping you achieve your long-term mission and short-term needs."
        link="https://beets.fi/#/pool/0xd5e946b5619fff054c40d38c976f1d06c1e2fa820002000000000000000003ac"
        learnMore="./../../../assets/USDB_Liquiduty_Solution.pdf"
      />
      <BalanceAboutTile
        icon={AboutUSDBBank}
        itemid="usdbbank"
        title="USDB Bank"
        text="We are building a lending and borrowing structure that will fall under our USDBank which you may have already seen teased in the usdbalance.com site ui."
      />
      <BalanceAboutTile
        icon={AboutNFTMarketplace}
        itemid="marketplace"
        title="NFT Marketplace"
        text="Liqd is an non-fungible token (NFT) marketplace built to enable the lending and borrowing of blue chip NFTs. The platform enables individuals who hold blue chip NFT assets to unlock liquidity by borrowing against the value of their asset(s).
        In turn, Liqd unlocks a peer-to-peer lending opportunity for crypto holding individuals to lend capital for a set interest rate, backed by the value of the underlying NFT asset."
      />
      <BalanceAboutTile
        icon={AboutFinancialNFT}
        itemid="financialnft"
        title="Financial NFTs"
        text="We are building a financial NFTs that will act as a receipt for a new game-changing financial product."
      />
    </>
  );
};

export default BalanceAboutPage;
