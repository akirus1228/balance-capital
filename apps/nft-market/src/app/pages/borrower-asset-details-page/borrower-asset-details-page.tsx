import { Asset } from "@fantohm/shared-web3";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../../store";

import AssetDetails from "../../components/asset-details/asset-details";
import BorrowerLoanDetails from "../../components/borrower-loan-details/borrower-loan-details";

export const BorrowerAssetDetailsPage = (): JSX.Element => {
  const params = useParams();

  const wallet = useSelector((state: RootState) => state.wallet);
  const backend = useSelector((state: RootState) => state.nftMarketplace);

  const currentAsset: Asset = useMemo(() => {
    if (params["assetId"]) {
      return wallet.assets.filter((asset) => asset.id === params["assetId"])[0];
    } else {
      return {} as Asset;
    }
  }, [wallet.assets]);

  return (
    <>
      <AssetDetails asset={currentAsset} />
      <BorrowerLoanDetails asset={currentAsset} sx={{ mt: "3em" }} />
    </>
  );
};

export default BorrowerAssetDetailsPage;
