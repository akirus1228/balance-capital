import { Box, Chip, IconButton, Paper } from "@mui/material";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";

// import style from "./borrower-asset.module.scss";
import { Link } from "react-router-dom";
import { useWalletAsset } from "../../../hooks/use-wallet-asset";
import PreviewImage from "../preview-image/preview-image";
import { AssetStatus } from "../../../types/backend-types";
import { useMemo } from "react";
import { capitalizeFirstLetter } from "@fantohm/shared-helpers";

export interface BorrowerAssetProps {
  contractAddress: string;
  tokenId: string;
}

export const BorrowerAsset = (props: BorrowerAssetProps): JSX.Element => {
  const asset = useWalletAsset(props.contractAddress, props.tokenId);

  const chipColor = useMemo(() => {
    if (!asset) return;
    switch (asset.status) {
      case AssetStatus.New:
      case AssetStatus.Ready:
        return "grey";
      case AssetStatus.Listed:
        return "blue";
      case AssetStatus.Locked:
        return "dark";
      default:
        return;
    }
  }, [asset]);

  const statusText = useMemo(() => {
    if (!asset) return;
    switch (asset.status) {
      case AssetStatus.New:
      case AssetStatus.Ready:
        return "Unlisted";
      case AssetStatus.Listed:
        return "Listed";
      case AssetStatus.Locked:
        return "Escrow";
      default:
        return;
    }
  }, [asset]);

  if (asset === null) {
    return <h3>Loading...</h3>;
  }

  return (
    <Paper
      style={{
        borderRadius: "28px",
        display: "flex",
        flexDirection: "column",
        width: "fit-content",
        margin: "1em",
        padding: "0",
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
          label={statusText || "Unlisted"}
          className={chipColor}
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
      {asset.imageUrl && asset.openseaId && (
        <Link to={`/asset/${props.contractAddress}/${props.tokenId}`}>
          <PreviewImage
            url={asset.imageUrl}
            name={asset.name || "placeholder name"}
            contractAddress={asset.assetContractAddress}
            tokenId={asset.tokenId}
          />
        </Link>
      )}
      <Box className="flex fc fj-c ai-c">
        {asset.collection && asset.collection.name && (
          <Box sx={{ position: "absolute" }}>
            <span
              style={{
                fontWeight: "400",
                fontSize: "15px",
                position: "relative",
                top: "-54px",
                background: "#FFF",
                borderRadius: "2em",
                padding: "1em",
                width: "80%",
                alignSelf: "center",
                textAlign: "center",
                opacity: "0.90",
              }}
            >
              {asset.collection.name}
            </span>
          </Box>
        )}
        <span style={{ fontWeight: "700", fontSize: "20px", margin: "2em 0" }}>
          {asset.name}
        </span>
      </Box>
    </Paper>
  );
};

export default BorrowerAsset;
