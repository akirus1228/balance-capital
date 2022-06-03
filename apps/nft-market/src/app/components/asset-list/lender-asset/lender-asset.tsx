import { Box, Chip, IconButton, Paper } from "@mui/material";
import { useWalletAsset } from "../../../hooks/use-wallet-asset";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import PreviewImage from "../preview-image/preview-image";
// import style from "./lender-asset.module.scss";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { capitalizeFirstLetter } from "@fantohm/shared-helpers";
import { AssetStatus } from "../../../types/backend-types";
import { RootState } from "../../../store";
import { selectListingFromAsset } from "../../../store/selectors/listing-selectors";
import { useSelector } from "react-redux";
import { useTermDetails } from "../../../hooks/use-term-details";
import { formatCurrency } from "@fantohm/shared-web3";

export interface LenderAssetProps {
  contractAddress: string;
  tokenId: string;
}

export function LenderAsset(props: LenderAssetProps) {
  const asset = useWalletAsset(props.contractAddress, props.tokenId);
  const listing = useSelector((state: RootState) => selectListingFromAsset(state, asset));
  const { repaymentAmount } = useTermDetails(listing.term);
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

  if (asset === null || !asset) {
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
          label={capitalizeFirstLetter(asset.status.toLowerCase()) || "Unlisted"}
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
      <Box className="flex fc fj-fs ai-c">
        {asset.collection && asset.collection.name && (
          <Box sx={{ position: "absolute" }}>
            <span
              style={{
                fontWeight: "400",
                fontSize: "15px",
                position: "relative",
                top: "-12px",
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
        <Box className="flex fc fj-c ai-c w100" sx={{ p: "2em" }}>
          <Box className="flex fr fj-sb ai-c w100">
            <span style={{ fontWeight: "700", fontSize: "24px" }}>
              {formatCurrency(listing.term.amount, 2)}
            </span>
            <span
              style={{
                borderRadius: "1em",
                color: "#1b9385",
                backgroundColor: "#1b938517",
                padding: "0.25em 1em",
                fontSize: "12px",
                fontWeight: "600",
              }}
            >
              {formatCurrency(repaymentAmount, 2)}
            </span>
          </Box>
          <Box className="flex fr fj-sb ai-c w100">
            <span style={{ color: "#8991A2", fontSize: "15px" }}>Duration</span>
            <span style={{ color: "#8991A2", fontSize: "15px" }}>APY</span>
          </Box>
          <Box className="flex fr fj-sb ai-c w100">
            <span>{listing.term.duration} days</span>
            <span>{listing.term.apr}%</span>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

export default LenderAsset;
