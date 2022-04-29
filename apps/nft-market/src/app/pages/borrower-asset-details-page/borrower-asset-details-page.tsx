import { Asset } from "@fantohm/shared-web3";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../../store";
import style from "./borrower-asset-details-page.module.scss";

export const BorrowerAssetDetailsPage = (): JSX.Element => {
  const params = useParams();

  const wallet = useSelector((state: RootState) => state.wallet);
  const backend = useSelector((state: RootState) => state.nftMarketplace);

  const currentAsset: Asset | undefined = useMemo(() => {
    if (params["assetId"]) {
      return wallet.assets.filter((asset) => asset.id === params["assetId"])[0];
    } else {
      return;
    }
  }, [wallet.assets]);

  return <div>{currentAsset && currentAsset.name}</div>;
};

export default BorrowerAssetDetailsPage;
