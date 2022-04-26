import { Asset } from "@fantohm/shared-web3";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import style from "./asset-list.module.scss";

export interface AssetListProps {
  address?: string;
}

export const NoImg = (): JSX.Element => {
  return (
    <Box
      sx={{
        height: "200px",
        width: "200px",
        border: "1px solid #000",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <span>No Preview Available</span>
    </Box>
  );
};

export interface PreviewImageProps {
  url: string;
  name: string;
}

export const PreviewImg = (props: PreviewImageProps): JSX.Element => {
  return (
    <Box sx={{ height: "200px", width: "200px" }}>
      <img src={props.url} alt={props.name} style={{ height: "100%", width: "auto" }} />
    </Box>
  );
};

export const AssetList = (props: AssetListProps): JSX.Element => {
  const assets = useSelector((state: RootState) => state.wallet.assets);

  return (
    <div>
      {assets.map((asset: Asset, index: number) => (
        <div key={`asset-${index}`} style={{ borderBottom: "1px solid #000" }}>
          <span>Collection</span>: <span>{asset.collection.name}</span>
          <br />
          <span>Token id</span>: <span>{asset.token_id}</span>
          {asset.image_url && <PreviewImg url={asset.image_url} name={asset.name} />}
          {!asset.image_url && <NoImg />}
        </div>
      ))}
    </div>
  );
};

export default AssetList;
