import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import style from "./asset-list.module.scss";
import BorrowerAsset from "./borrower-asset/borrower-asset";
import { Asset } from "@fantohm/shared-web3";

export interface AssetListProps {
  address?: string;
}

export const AssetList = (props: AssetListProps): JSX.Element => {
  const assets = useSelector((state: RootState) => state.wallet.assets);

  return (
    <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
      {assets &&
        assets.map((asset: Asset, index: number) => (
          <BorrowerAsset key={`asset-${index}`} asset={asset} />
        ))}
    </Box>
  );
};

export default AssetList;
