import { Asset } from "@fantohm/shared-web3";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import style from "./asset-list.module.scss";

export interface AssetListProps {
  address?: string;
}

export const AssetList = (props: AssetListProps): JSX.Element => {
  const assets = useSelector((state: RootState) => state.wallet.assets);

  return (
    <div>
      {assets.map((asset: Asset, index: number) => (
        <div key={`asset-${index}`}>
          collection: {asset.collection.name}
          id: {asset.token_id}
          <img src={asset.image_url} alt={asset.name}/>
        </div>
      ))}
    </div>
  );
};

export default AssetList;
