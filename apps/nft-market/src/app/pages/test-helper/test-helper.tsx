import { Button, Box } from "@mui/material";
import {
  useDeleteAssetMutation,
  useDeleteListingMutation,
  useGetAssetsQuery,
  useGetListingsQuery,
  useGetLoansQuery,
  useDeleteLoanMutation,
} from "../../api/backend-api";
import { Asset, Listing, Loan } from "../../types/backend-types";
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
  };

  return (
    <div>
      <Box>Assets: {assets && assets.length}</Box>
      <Box>Listings: {listings && listings.length}</Box>
      <Box>Loans: {loans && loans.length}</Box>
      <Button onClick={handleDeleteAll}>Delete All</Button>
    </div>
  );
};

export default TestHelper;
