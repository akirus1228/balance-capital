import { Box, SxProps, Theme } from "@mui/material";
// import style from "./asset-list.module.scss";
import BorrowerAsset from "./borrower-asset/borrower-asset";
import { Asset } from "../../types/backend-types";
import LenderAsset from "./lender-asset/lender-asset";

export interface AssetListProps {
  assets: Asset[];
  type: "lend" | "borrow";
  address?: string;
  sx?: SxProps<Theme>;
}

export const AssetList = (props: AssetListProps): JSX.Element => {
  const AssetThumb = props.type === "lend" ? LenderAsset : BorrowerAsset;

  return (
    <Box className="flex fr fw">
      {props.assets &&
        props.assets.map((asset: Asset, index: number) => (
          <AssetThumb
            key={`asset-${index}`}
            contractAddress={asset.assetContractAddress}
            tokenId={asset.tokenId}
          />
        ))}
    </Box>
  );
};

export default AssetList;
