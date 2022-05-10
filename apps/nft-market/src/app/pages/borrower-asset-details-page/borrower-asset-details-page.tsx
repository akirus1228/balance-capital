import {
  Asset,
  AssetStatus,
  defaultNetworkId,
  Listing,
  ListingStatus,
  loadAsset,
  loadWalletAssets,
  useWeb3Context,
} from "@fantohm/shared-web3";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../../store";

import AssetDetails from "../../components/asset-details/asset-details";
import BorrowerLoanDetails from "../../components/borrower-loan-details/borrower-loan-details";
import BorrowerCreateListing from "../../components/borrower-create-listing/borrower-create-listing";
import { useAsset } from "../../hooks/useAsset";
import BorrowerListingDetails from "../../components/borrower-listing-details/borrower-listing-details";
import { useListing } from "../../hooks/useListing";

export const BorrowerAssetDetailsPage = (): JSX.Element => {
  console.log("BorrowerAssetDetailsPage Render");

  const params = useParams();
  const asset: Asset | null = useAsset(params["contractAddress"], params["tokenId"]);
  const listing: Listing | null = useListing(
    params["contractAddress"],
    params["tokenId"]
  );

  if (typeof asset === "undefined" || asset === null) {
    return <h1>Loading...</h1>;
  }
  return (
    <>
      <AssetDetails
        contractAddress={asset.assetContractAddress}
        tokenId={asset.tokenId}
      />
      {!asset && <h1>Loading...</h1>}
      {[AssetStatus.Ready, AssetStatus.New].includes(asset?.status) && (
        <BorrowerCreateListing asset={asset} sx={{ mt: "3em" }} />
      )}
      {listing?.status === ListingStatus.Listed && (
        <BorrowerListingDetails asset={asset} sx={{ mt: "3em" }} />
      )}
      {asset?.status === AssetStatus.Locked && (
        <BorrowerLoanDetails asset={asset} sx={{ mt: "3em" }} />
      )}
    </>
  );
};

export default BorrowerAssetDetailsPage;
