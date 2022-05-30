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
import {
  AssetStatus,
  Listing,
  ListingStatus,
  Loan,
  LoanStatus,
} from "../../types/backend-types";
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
      take: 40,
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

  const activeLoan = useMemo(() => {
    if (!loans) return {} as Loan;
    return loans.find((loan: Loan) => loan.status === LoanStatus.Active);
  }, [loans]);

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
        sx={{ mt: "5em", mb: "3em" }}
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
        activeListing.asset &&
        activeListing.asset?.status === AssetStatus.Listed && (
          <LenderListingTerms listing={activeListing} sx={{ mt: "3em" }} />
        )}
      {asset &&
        !isOwner &&
        activeLoan &&
        activeLoan.assetListing &&
        activeLoan.assetListing.asset?.status === AssetStatus.Locked &&
        authSignature && (
          <LenderLoanDetails asset={asset} loan={activeLoan} sx={{ mt: "3em" }} />
        )}
      {isOwner && [AssetStatus.Ready, AssetStatus.New].includes(asset?.status) && (
        <BorrowerCreateListing asset={asset} sx={{ mt: "3em" }} />
      )}
      {isOwner && asset?.status === AssetStatus.Listed && (
        <BorrowerListingDetails asset={asset} sx={{ mt: "3em" }} />
      )}
      {isOwner && asset?.status === AssetStatus.Locked && activeLoan && (
        <BorrowerLoanDetails asset={asset} loan={activeLoan} sx={{ mt: "3em" }} />
      )}
      {asset.id && <OffersList queryParams={{ assetId: asset.id || "" }} />}
      <Container maxWidth="xl" sx={{ mt: "5em" }}>
        <Grid container columnSpacing={3}>
          <Grid item xs={12} md={5}>
            <OwnerInfo owner={asset.owner} />
          </Grid>
          <Grid item xs={12} md={7}>
            <PreviousLoans asset={asset} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default AssetDetailsPage;
