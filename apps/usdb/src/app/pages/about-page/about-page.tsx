import { Box, Button, Grid, Icon, Input, Paper } from "@mui/material";
import { useEffect } from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import Headline from "../../components/headline/headline";
import Logo from "../../components/logo/logo";
import style from "./about-page.module.scss";
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
  BalanceDefine1,
  BalanceDefine2,
} from "@fantohm/shared/images";
import AboutTile from "./about-tile";

export const AboutPage = (): JSX.Element => {
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
      <AboutTile
        icon={AboutUSDB}
        title="USDB Stablecoin"
        text="The Balance ecosystem / organization is formed to carry out the purpose of its name– to balance FHM & USDB against one another in a way that feeds value into the continued use case of both assets. FHM, as a value capturing mechanism, feeds the minting of USDB through a proof of burn mechanism similar to UST on Luna."
        link="https://www.usdbalance.com/"
        docsLink="https://fantohm.gitbook.io/documentation/usdb/introduction"
      />
      <AboutTile
        icon={AboutFHM}
        title="FHM Protocol"
        text="FHM is a Reserve & Rewards Protocol inspired by the Protocol Owned Liquidity software developments of OHM. FHM features compounding, single disbursement bonds as the safest possible bonding mechanism to ensure the longevity of exchange liquidity in relation to neighbouring protocols with similar principles."
        link="https://fantohm.com/"
        docsLink="https://fantohm.gitbook.io/documentation/"
      />
      <AboutTile
        icon={AboutBridge}
        title="DEX & Bridge"
        text="USDB and FHM are expanding beyond the EVM realm with the first bridge to Terra being completed in the near future. We have successfully bridged both ways and are now awaiting the completion of audits to confirm our capability in this regard."
        link="https://synapseprotocol.com/?inputCurrency=USDB&outputCurrency=USDB&outputChain=1"
      />
      <AboutTile
        icon={AboutLiquidity}
        title="Liquidity Solution"
        text="Will allow sFHM to be used as a tool for funding and seeding USDB lp pools as a business development tool and consumer investment option. This means every FHM stakeholder has access to everything necessary to new startups on the blockchain."
        link="https://beets.fi/#/pool/0x20dc8f03ece2bca3e262314f6ede7b32939331d70002000000000000000001f0"
      />
      <AboutTile
        icon={AboutUSDBBank}
        title="USDB Bank"
        text="We are building a lending and borrowing structure that will fall under our USDBank which you may have already seen teased in the usdbalance.com site ui."
      />
      <AboutTile icon={AboutUSDBBank} title="NFT Marketplace" text="Coming soon" />
      <AboutTile
        icon={AboutFinancialNFT}
        title="Financial NFTs"
        text="We are building a financial NFTs that will act as a receipt for a new game-changing financial product."
      />
    </>
  );
};

export default AboutPage;
