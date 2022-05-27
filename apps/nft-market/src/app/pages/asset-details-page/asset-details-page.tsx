import { useWeb3Context } from "@fantohm/shared-web3";
import { Box, CircularProgress, Container, Grid } from "@mui/material";
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
import LenderLoanDetails from "../../components/lender-loan-details/lender-loan-details";
import OffersList from "../../components/offers-list/offers-list";
import OwnerInfo from "../../components/owner-info/owner-info";
import PreviousLoans from "../../components/previous-loans/previous-loans";
import { RootState } from "../../store";
import { selectAssetByAddress } from "../../store/selectors/asset-selectors";
import { selectListingsByAddress } from "../../store/selectors/listing-selectors";
import { AssetStatus, Listing, ListingStatus, Loan } from "../../types/backend-types";
// import style from "./lender-asset-details-page.module.scss";

export const AssetDetailsPage = (): JSX.Element => {
  const params = useParams();
  const { address } = useWeb3Context();
  const { authSignature } = useSelector((state: RootState) => state.backend);
  // find listing from store
  const listings = useSelector((state: RootState) =>
    selectListingsByAddress(state, {
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
    { skip: !assets || !authSignature }
  );

  // load loans for this contract
  const { data: loans, isLoading: isLoansLoading } = useGetLoansQuery(
    {
      skip: 0,
      take: 1,
      assetId: asset?.id || "",
    },
    { skip: !authSignature }
  );

  // is the user the owner of the asset?
  const isOwner = useMemo(() => {
    return address.toLowerCase() === asset?.owner?.address.toLowerCase();
  }, [asset, address]);

  const activeListing = useMemo(() => {
    return listings.find((listing: Listing) => listing.status === ListingStatus.Listed);
  }, [listings]);

  if (isListingLoading || isAssetLoading || !asset || isLoansLoading) {
    return (
      <Box className="flex fr fj-c">
        <CircularProgress />
      </Box>
    );
  }
  return (
    <>
      <AssetDetails
        contractAddress={asset.assetContractAddress}
        tokenId={asset.tokenId}
        listing={activeListing}
      />
      {!activeListing && !asset && <h1>Loading...</h1>}
      {!authSignature &&
        activeListing &&
        activeListing.asset?.status === AssetStatus.Listed && (
          <Box className="flex fr fj-c">
            <h2>Connect your wallet to fund the loan or make an offer.</h2>
          </Box>
        )}
      {asset &&
        authSignature &&
        !isOwner &&
        activeListing &&
        activeListing.asset?.status === AssetStatus.Listed && (
          <LenderListingTerms listing={activeListing} sx={{ mt: "3em" }} />
        )}
      {asset &&
        !isOwner &&
        activeListing &&
        activeListing.asset?.status === AssetStatus.Locked &&
        authSignature && (
          <LenderLoanDetails
            asset={asset}
            loan={loans ? loans[0] : ({} as Loan)}
            sx={{ mt: "3em" }}
          />
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
      {asset.id && <OffersList queryParams={{ assetId: asset.id || "" }} />}
      <Container>
        <Grid container>
          <Grid item xs={12} md={4}>
            <OwnerInfo owner={asset.owner} />
          </Grid>
          <Grid item xs={12} md={8}>
            <PreviousLoans asset={asset} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default AssetDetailsPage;
