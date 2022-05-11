import { useParams } from "react-router-dom";

import AssetDetails from "../../components/asset-details/asset-details";
import BorrowerLoanDetails from "../../components/borrower-loan-details/borrower-loan-details";
import BorrowerCreateListing from "../../components/borrower-create-listing/borrower-create-listing";
import { useWalletAsset } from "../../hooks/useWalletAsset";
import BorrowerListingDetails from "../../components/borrower-listing-details/borrower-listing-details";
import { useListing } from "../../hooks/useListing";
import { Asset, AssetStatus, Listing, ListingStatus } from "../../types/backend-types";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

export const BorrowerAssetDetailsPage = (): JSX.Element => {
  console.log("BorrowerAssetDetailsPage Render");

  const params = useParams();
  const asset: Asset | null = useWalletAsset(
    params["contractAddress"],
    params["tokenId"]
  );
  const listing: Listing = useSelector((state: RootState) => {
    const key = Object.keys(state.listings.listings).find(
      (key: string) =>
        state.listings.listings[key].asset.assetContractAddress ===
        params["contractAddress"]
    );
    if (key) {
      return state.listings.listings[key];
    } else {
      return {} as Listing;
    }
  });

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
        <BorrowerListingDetails listing={listing} sx={{ mt: "3em" }} />
      )}
      {asset?.status === AssetStatus.Locked && (
        <BorrowerLoanDetails asset={asset} sx={{ mt: "3em" }} />
      )}
    </>
  );
};

export default BorrowerAssetDetailsPage;
