import { Box, Chip, IconButton, Paper } from "@mui/material";
import { useWalletAsset } from "../../../hooks/useWalletAsset";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import PreviewImage from "../preview-image/preview-image";
import style from "./lender-asset.module.scss";
import { Link } from "react-router-dom";

export interface LenderAssetProps {
  contractAddress: string;
  tokenId: string;
}

export function LenderAsset(props: LenderAssetProps) {
  const asset = useWalletAsset(props.contractAddress, props.tokenId);

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
          label={asset.status || "Unlisted"}
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
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <span style={{ fontWeight: "700", fontSize: "20px", margin: "2em 0" }}>
          {asset.name}
        </span>
      </Box>
    </Paper>
  );
}

export default LenderAsset;
