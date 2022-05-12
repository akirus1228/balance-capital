import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import AssetDetails from "../../components/asset-details/asset-details";
import LenderListingTerms from "../../components/lender-listing-terms/lender-listing-terms";
import { RootState } from "../../store";
import {
  selectListingByAddress,
  selectListingById,
} from "../../store/selectors/listing-selectors";
import { AssetStatus } from "../../types/backend-types";
import style from "./lender-asset-details-page.module.scss";

/* eslint-disable-next-line */
export interface LenderAssetDetailsPageProps {}

export const LenderAssetDetailsPage = (
  props: LenderAssetDetailsPageProps
): JSX.Element => {
  console.log("LenderAssetDetailsPage Render");
  const params = useParams();
  const listing = useSelector((state: RootState) =>
    selectListingByAddress(state, {
      contractAddress: params["contractAddress"] || "",
      tokenId: params["tokenId"] || "",
    })
  );

  if (typeof listing === "undefined" || listing === null) {
    return <h1>Loading...</h1>;
  }
  return (
    <>
      <AssetDetails
        contractAddress={listing.asset.assetContractAddress}
        tokenId={listing.asset.tokenId}
      />
      {!listing.asset && <h1>Loading...</h1>}
      {listing.asset?.status === AssetStatus.Listed && (
        <LenderListingTerms listing={listing} sx={{ mt: "3em" }} />
      )}
    </>
  );
};

export default LenderAssetDetailsPage;
