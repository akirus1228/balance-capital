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
        <div key={`asset-${index}`} style={{ borderBottom: "1px solid #000" }}>
          <span>collection</span>: <span>{asset.collection.name}</span>
          <br />
          <span>id</span>: <span>{asset.token_id}</span>
          {asset.image_url && <img src={asset.image_url} alt={asset.name} />}
        </div>
      ))}
    </div>
  );
};

export default AssetList;
