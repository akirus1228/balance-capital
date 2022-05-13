import { useWeb3Context } from "@fantohm/shared-web3";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import AssetDetails from "../../components/asset-details/asset-details";
import BorrowerCreateListing from "../../components/borrower-create-listing/borrower-create-listing";
import BorrowerListingDetails from "../../components/borrower-listing-details/borrower-listing-details";
import BorrowerLoanDetails from "../../components/borrower-loan-details/borrower-loan-details";
import LenderListingTerms from "../../components/lender-listing-terms/lender-listing-terms";
import { RootState } from "../../store";
import { loadAssetsFromOpensea } from "../../store/reducers/asset-slice";
import { loadListings } from "../../store/reducers/listing-slice";
import { selectAssetByAddress } from "../../store/selectors/asset-selectors";
import { selectListingByAddress } from "../../store/selectors/listing-selectors";
import { AssetStatus } from "../../types/backend-types";
import style from "./lender-asset-details-page.module.scss";

export const AssetDetailsPage = (): JSX.Element => {
  console.log("LenderAssetDetailsPage Render");
  const dispatch = useDispatch();
  const params = useParams();
  const { address } = useWeb3Context();
  const listing = useSelector((state: RootState) =>
    selectListingByAddress(state, {
      contractAddress: params["contractAddress"] || "123",
      tokenId: params["tokenId"] || "123",
    })
  );

  const asset = useSelector((state: RootState) =>
    selectAssetByAddress(state, {
      contractAddress: params["contractAddress"] || "123",
      tokenId: params["tokenId"] || "123",
    })
  );

  useEffect(() => {
    console.log("listing");
    console.log(listing);
    console.log("asset");
    console.log(asset);
    if (!listing && !asset) {
      dispatch(
        loadAssetsFromOpensea({
          queryParams: {
            token_ids: [params["tokenId"] || ""],
            asset_contract_address: params["contractAddress"],
          },
        })
      );
    } else if (asset && !listing) {
      dispatch(
        loadListings({
          queryParams: { skip: 0, take: 1, openseaIds: [asset.openseaId || ""] },
        })
      );
    }
  }, [listing, asset]);

  const isOwner = useMemo(() => {
    return address.toLowerCase() === asset?.owner?.address.toLowerCase();
  }, [asset, address]);

  if (
    typeof asset === "undefined" ||
    typeof listing === "undefined" ||
    listing === null
  ) {
    return <h1>Loading...</h1>;
  }
  return (
    <>
      <AssetDetails
        contractAddress={listing.asset.assetContractAddress}
        tokenId={listing.asset.tokenId}
      />
      {!listing && !asset && <h1>Loading...</h1>}
      {asset && !isOwner && listing && listing.asset?.status === AssetStatus.Listed && (
        <LenderListingTerms listing={listing} sx={{ mt: "3em" }} />
      )}
      {isOwner && [AssetStatus.Ready, AssetStatus.New].includes(asset?.status) && (
        <BorrowerCreateListing asset={asset} sx={{ mt: "3em" }} />
      )}
      {isOwner && asset?.status === AssetStatus.Listed && (
        <BorrowerListingDetails asset={asset} sx={{ mt: "3em" }} />
      )}
      {isOwner && asset?.status === AssetStatus.Locked && (
        <BorrowerLoanDetails asset={asset} sx={{ mt: "3em" }} />
      )}
    </>
  );
};

export default AssetDetailsPage;
