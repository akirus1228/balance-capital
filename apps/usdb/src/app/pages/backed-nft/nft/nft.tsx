import { useState } from "react";
import {
  Box,
  Grid,
} from "@mui/material";
import style from "../mint-nft.module.scss";
import { USDBToken } from "@fantohm/shared/images";

export const NftItem = (): JSX.Element => {
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
          <span>30 days</span>
        </Box>
        <Box className={style["vestingDescription"]}>
          <span style={{ flex: 1 }}>Invested</span>
          <span>$10,000.00 DAI</span>
        </Box>
        <Box className={style["vestingDescription"]}>
          <span style={{ flex: 1 }}>Current value</span>
          <span>
            9,99858 USDB<br />
            3548 sFHM
          </span>
        </Box>
        <Box className={style["vestingDescription"]}>
          <span style={{ flex: 1 }}>Time remaining</span>
          <span>24h 29h 53m</span>
        </Box>
      </Grid>
    </Grid>
  );
};
