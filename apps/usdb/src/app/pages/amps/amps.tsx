import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { noBorderOutlinedInputStyles } from "@fantohm/shared-ui-themes";
import { Box, Grid, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

import style from "./amps.module.scss";
import { RootState } from "../../store";
import StakingCard from "./staking/card";
import RedeemCard from "./redeem/card";
import StakeModal from "./staking/stake-modal";

import imgBondDiscount from "../../../assets/images/amps/bond-discount.png";
import imgFhmStaking from "../../../assets/images/amps/fhm-staking.png";
import imgGetJail from "../../../assets/images/amps/get-jail.png";
import imgLending from "../../../assets/images/amps/lending.png";
import imgBackedNft from "../../../assets/images/amps/backed-nft.png";
import imgNftFees from "../../../assets/images/amps/nft-fees.png";
import imgMonopoly from "../../../assets/images/amps/monopoly.png";
import imgNftFeature from "../../../assets/images/amps/nft-feature.png";

export default function Amps() {
  const outlinedInputClasses = noBorderOutlinedInputStyles();
  const navigate = useNavigate();
  const themeType = useSelector((state: RootState) => state.app.theme);

  const [tabIndex, setTabIndex] = useState(0);
  const [isShowStakingModal, setShowStakingModal] = useState<boolean>(false);

  const onStake = () => {
    setShowStakingModal(true);
  };

  const redeems = [
    {
      use: 1,
      title: "Bond Discount",
      image: imgBondDiscount,
      cost: 100,
      description: "1% discount (capped at 10%)",
    },
    {
      use: 1,
      title: "FHM Staking APY Boost",
      image: imgFhmStaking,
      cost: 500,
      description: "Get a 50% APY boost <br />when staking FHM",
    },
    {
      use: 0,
      title: "Get Out of Jail NFT",
      image: imgGetJail,
      cost: 500,
      description: "Get a 50% APY boost <br />when staking FHM",
    },
    {
      use: 0,
      title: "Lending & Borrowing",
      image: imgLending,
      cost: 750,
      description: "50% rate delta",
    },
    {
      use: 0,
      title: "Backed NFT Rewards",
      image: imgBackedNft,
      cost: 750,
      description: "50% discount on NFTs",
    },
    {
      use: 0,
      title: "NFT Marketplace Fees",
      image: imgNftFees,
      cost: 750,
      description: "Get a 50% discount at <br />the USDB NFT marketplace",
    },
    {
      use: 0,
      title: "Monopoly Man NFT",
      image: imgMonopoly,
      cost: 1000,
      description: "10% USDB boost in staked NFT",
    },
    {
      use: 0,
      title: "NFT Marketplace Feature Page",
      image: imgNftFeature,
      cost: -1,
      description: "Landing page placement",
    },
  ];

  return (
    <Box className={style["hero"]}>
      <div className={style["tabContent"]}>
        <Button
          className={style["tapButton"]}
          variant="text"
          onClick={() => setTabIndex(0)}
          style={{
            borderBottom: `${
              tabIndex === 0
                ? `solid 4px ${themeType === "light" ? "black" : "white"}`
                : "none"
            }`,
          }}
        >
          Staking
        </Button>
        <Button
          variant="text"
          className={style["tapButton"]}
          onClick={() => setTabIndex(1)}
          style={{
            borderBottom: `${
              tabIndex === 0
                ? "none"
                : `solid 4px ${themeType === "light" ? "black" : "white"}`
            }`,
          }}
        >
          Redeem
        </Button>
      </div>
      {tabIndex === 0 && (
        <Grid container spacing={8} className={style["cardGrid"]}>
          <StakingCard title="No lock up" index={1} onStake={onStake} />
          <StakingCard title="365 day lock up" index={2} onStake={onStake} />
          <StakingCard title="720 day lock up" index={3} onStake={onStake} />
        </Grid>
      )}

      {tabIndex === 1 && (
        <Grid container spacing={8} className={style["cardGrid"]}>
          {redeems.map((item) => (
            <RedeemCard {...item} />
          ))}
        </Grid>
      )}

      <StakeModal
        open={isShowStakingModal}
        closeModal={() => setShowStakingModal(false)}
        onCancel={() => {}}
      />
    </Box>
  );
}
