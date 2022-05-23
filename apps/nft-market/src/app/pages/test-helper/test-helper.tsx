import { Button, Box } from "@mui/material";
import {
  useDeleteAssetMutation,
  useDeleteListingMutation,
  useGetAssetsQuery,
  useGetListingsQuery,
  useGetLoansQuery,
  useDeleteLoanMutation,
  useGetOffersQuery,
  useDeleteOfferMutation,
  useGetTermsQuery,
  useDeleteTermsMutation,
} from "../../api/backend-api";
import { Asset, Listing, Loan, Offer, Terms } from "../../types/backend-types";
import "./test-helper.module.scss";

/* eslint-disable-next-line */
export interface TestHelperProps {}

export const TestHelper = (props: TestHelperProps): JSX.Element => {
  const { data: assets, isLoading: isAssetsLoading } = useGetAssetsQuery({
    skip: 0,
    take: 50,
  });
  const [deleteAsset] = useDeleteAssetMutation();

  const { data: listings, isLoading: isListingsLoading } = useGetListingsQuery({
    skip: 0,
    take: 50,
  });
  const [deleteListing] = useDeleteListingMutation();

  const { data: loans, isLoading: isLoansLoading } = useGetLoansQuery({
    skip: 0,
    take: 50,
  });
  const [deleteLoan] = useDeleteLoanMutation();

  const { data: offers, isLoading: isOffersLoading } = useGetOffersQuery({
    skip: 0,
    take: 50,
  });
  const [deleteOffer] = useDeleteOfferMutation();

  const { data: terms, isLoading: isTermsLoading } = useGetTermsQuery({
    skip: 0,
    take: 50,
  });
  const [deleteTerms] = useDeleteTermsMutation();

  const handleDeleteAll = () => {
    if (assets && assets.length > 0) {
      assets?.forEach((asset: Asset) => deleteAsset(asset));
    }

    if (listings && listings.length > 0) {
      listings?.forEach((listing: Listing) => deleteListing(listing));
    }

    if (loans && loans.length > 0) {
      loans?.forEach((loan: Partial<Loan>) => deleteLoan(loan));
    }

    if (offers && offers.length > 0) {
      offers?.forEach((offer: Partial<Offer>) => deleteOffer(offer));
    }

    if (terms && terms.length > 0) {
      terms?.forEach((term: Partial<Terms>) => deleteTerms(term));
    }
  };

  const handleDeleteAssets = () => {
    if (assets && assets.length > 0) {
      assets?.forEach((asset: Asset) => deleteAsset(asset));
    }
  };

  const handleDeleteOffers = () => {
    if (offers && offers.length > 0) {
      offers?.forEach((offer: Partial<Offer>) => deleteOffer(offer));
    }
  };

  const handleDeleteTerms = () => {
    if (terms && terms.length > 0) {
      terms?.forEach((term: Partial<Terms>) => deleteTerms(term));
    }
  };

  return (
    <div>
      <Box>
        Assets: {assets && assets.length}{" "}
        <Button onClick={handleDeleteAssets}>Delete</Button>
      </Box>
      <Box>Listings: {listings && listings.length}</Box>
      <Box>Loans: {loans && loans.length}</Box>
      <Box>
        Offers: {offers && offers.length}{" "}
        <Button onClick={handleDeleteOffers}>Delete</Button>
      </Box>
      <Box>
        Terms: {terms && terms.length} <Button onClick={handleDeleteTerms}>Delete</Button>
      </Box>
      <Button onClick={handleDeleteAll}>Delete All</Button>
    </div>
  );
};

export default TestHelper;
