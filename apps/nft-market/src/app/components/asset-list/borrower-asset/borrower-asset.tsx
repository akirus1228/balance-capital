import { Asset, createListing, Terms } from "@fantohm/shared-web3";
import { Box, Chip, IconButton, Paper } from "@mui/material";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";

import style from "./borrower-asset.module.scss";
import { Link } from "react-router-dom";

export interface PreviewImageProps {
  url: string;
  name: string;
  assetId: string;
}

export const PreviewImg = (props: PreviewImageProps): JSX.Element => {
  return (
    <Box
      sx={{ height: "300px", width: "300px", borderRadius: "28px", overflow: "hidden" }}
    >
      <Link to={`/borrow/${props.assetId}`}>
        <img
          className={style["assetImg"]}
          src={props.url}
          alt={props.name}
          style={{ height: "100%", width: "auto" }}
        />
      </Link>
    </Box>
  );
};

enum BorrowerAssetStatus {
  IDLE,
  LOADING,
  PENDING_USER,
  PENDING_TXN,
  TXN_SUCCESS,
  TXN_REJECTED,
}

type BorrowerAssetState = {
  amount: number;
  apr: number;
  duration: number;
  status: BorrowerAssetStatus;
};

export interface BorrowerAssetProps {
  asset: Asset;
}

export const BorrowerAsset = (props: BorrowerAssetProps): JSX.Element => {
  return (
    <Paper
      style={{
        borderRadius: "28px",
        display: "flex",
        flexDirection: "column",
        width: "fit-content",
      }}
    >
      <Box sx={{ position: "absolute" }}>
        <Chip
          sx={{
            position: "relative",
            top: "15px",
            left: "20px",
            zIndex: 10,
          }}
          label={props.asset.status || "Unlisted"}
        />
      </Box>
      <Box sx={{ position: "absolute" }}>
        <IconButton
          sx={{
            position: "relative",
            top: "10px",
            left: "250px",
            backgroundColor: "#FFFFFF40",
            color: "#000",
            zIndex: 10,
          }}
        >
          <MoreHorizOutlinedIcon />
        </IconButton>
      </Box>
      {props.asset.imageUrl && props.asset.id && (
        <PreviewImg
          url={props.asset.imageUrl}
          name={props.asset.name || "placeholder name"}
          assetId={props.asset.id}
        />
      )}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <span style={{ fontWeight: "700", fontSize: "20px", margin: "2em 0" }}>
          {props.asset.name}
        </span>
      </Box>
    </Paper>
  );
};

export default BorrowerAsset;
