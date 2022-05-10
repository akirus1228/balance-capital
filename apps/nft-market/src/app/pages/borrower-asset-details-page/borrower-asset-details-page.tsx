import { Asset, AssetStatus, loadAsset } from "@fantohm/shared-web3";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../../store";

import AssetDetails from "../../components/asset-details/asset-details";
import BorrowerLoanDetails from "../../components/borrower-loan-details/borrower-loan-details";

export const BorrowerAssetDetailsPage = (): JSX.Element => {
  const params = useParams();
  const dispatch = useDispatch();

  const wallet = useSelector((state: RootState) => state.wallet);
  const backend = useSelector((state: RootState) => state.nftMarketplace);

  const currentAsset: Asset = useMemo(() => {
    if (params["assetId"]) {
      return wallet.assets.filter((asset) => asset.id === params["assetId"])[0];
    } else {
      return {} as Asset;
    }
  }, [wallet.assets]);

  useEffect(() => {
    console.log("load asset details from api");
    console.log(
      `backend.authSignature: ${backend.authSignature}, currentAsset: ${currentAsset}`
    );
    if (backend.authSignature !== null && currentAsset) {
      console.log("load asset details from api 2");
      dispatch(loadAsset(currentAsset.id));
    }
  }, [currentAsset]);

  return (
    <>
      <AssetDetails asset={currentAsset} />
      {currentAsset.status === AssetStatus.READY && (
        <BorrowerLoanDetails asset={currentAsset} sx={{ mt: "3em" }} />
      )}
      {currentAsset.status === AssetStatus.READY && (
        <BorrowerLoanDetails asset={currentAsset} sx={{ mt: "3em" }} />
      )}
    </>
  );
};

export default BorrowerAssetDetailsPage;
