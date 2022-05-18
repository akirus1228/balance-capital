import { useWeb3Context } from "@fantohm/shared-web3";
import { CircularProgress } from "@mui/material";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useGetListingsQuery, useGetLoansQuery } from "../../api/backend-api";
import { OpenseaAsset, useGetOpenseaAssetsQuery } from "../../api/opensea";
import { AssetDetails } from "../../components/asset-details/asset-details";
import { BorrowerCreateListing } from "../../components/borrower-create-listing/borrower-create-listing";
import { BorrowerListingDetails } from "../../components/borrower-listing-details/borrower-listing-details";
import { BorrowerLoanDetails } from "../../components/borrower-loan-details/borrower-loan-details";
import { LenderListingTerms } from "../../components/lender-listing-terms/lender-listing-terms";
import { RootState } from "../../store";
import { selectAssetByAddress } from "../../store/selectors/asset-selectors";
import { selectListingByAddress } from "../../store/selectors/listing-selectors";
import { AssetStatus, Loan } from "../../types/backend-types";
// import style from "./lender-asset-details-page.module.scss";

export const AssetDetailsPage = (): JSX.Element => {
  console.log("AssetDetailsPage Render");
  const params = useParams();
  const { address } = useWeb3Context();
  // find listing from store
  const listing = useSelector((state: RootState) =>
    selectListingByAddress(state, {
      contractAddress: params["contractAddress"] || "123",
      tokenId: params["tokenId"] || "123",
    })
  );

  // find asset from store
  const asset = useSelector((state: RootState) =>
    selectAssetByAddress(state, {
      contractAddress: params["contractAddress"] || "123",
      tokenId: params["tokenId"] || "123",
    })
  );

  // load asset data from opensea
  const { data: assets, isLoading: isAssetLoading } = useGetOpenseaAssetsQuery({
    asset_contract_address: params["contractAddress"],
    token_ids: [params["tokenId"] || ""],
    limit: 1,
  });

  // load listing data from backend
  const { isLoading: isListingLoading } = useGetListingsQuery(
    {
      skip: 0,
      take: 50,
      openseaIds: assets?.map((asset: OpenseaAsset) => asset.id.toString()),
    },
    { skip: !assets }
  );

  // load loans for this contract
  const { data: loans, isLoading: isLoansLoading } = useGetLoansQuery({
    skip: 0,
    take: 50,
  });

  // is the user the owner of the asset?
  const isOwner = useMemo(() => {
    return address.toLowerCase() === asset?.owner?.address.toLowerCase();
  }, [asset, address]);

  if (isListingLoading || isAssetLoading || !asset || isLoansLoading) {
    return <CircularProgress />;
  }
  return (
    <>
      <AssetDetails
        contractAddress={asset.assetContractAddress}
        tokenId={asset.tokenId}
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
        <BorrowerLoanDetails
          asset={asset}
          loan={loans ? loans[0] : ({} as Loan)}
          sx={{ mt: "3em" }}
        />
      )}
    </>
  );
};

export default AssetDetailsPage;
