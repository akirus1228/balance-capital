import { Container } from "@mui/material";
import { useSelector } from "react-redux";
import { Collectible } from "@audius/fetch-nft";
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
      {assets &&
        assets.map((asset: Collectible, index: number) => (
          <BorrowerAsset key={`asset-${index}`} asset={asset} />
        ))}
    </Container>
  );
};

export default AssetList;
