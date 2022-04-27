import { Asset } from "@fantohm/shared-web3";
import { Box, Button, Container, Input } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import style from "./asset-list.module.scss";
import BorrowerAsset from "./borrower-asset/borrower-asset";

export interface AssetListProps {
  address?: string;
}

export const AssetList = (props: AssetListProps): JSX.Element => {
  const assets = useSelector((state: RootState) => state.wallet.assets);

  return (
    <Container>
      {assets.map((asset: Asset, index: number) => (
        <BorrowerAsset key={`asset-${index}`} asset={asset} />
      ))}
    </Container>
  );
};

export default AssetList;
