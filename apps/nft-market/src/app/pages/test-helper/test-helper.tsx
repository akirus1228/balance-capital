import { isDev, NetworkIds, useWeb3Context } from "@fantohm/shared-web3";
import { Button, Box, CircularProgress } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
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
import store from "../../store";
import { getLoanDetailsFromContract, LoanDetails } from "../../store/reducers/loan-slice";
import { Asset, Listing, Loan, Offer, Terms } from "../../types/backend-types";
import "./test-helper.module.scss";

const LoanStatusTl = ["Created", "Repaid", "Liquidated"];

/* eslint-disable-next-line */
export interface TestHelperProps {}
type AppDispatch = typeof store.dispatch;

const SimpleLoanDetail = ({ loanDetails }: { loanDetails: LoanDetails }): JSX.Element => {
  return (
    <Box sx={{ mb: "1em", border: "1px solid lightgray" }}>
      <Box>LoanId: {loanDetails.loanId}</Box>
      <Box>Lender: {loanDetails.lender}</Box>
      <Box>Borrower: {loanDetails.borrower}</Box>
      <Box>Amount Due: {loanDetails.amountDue}</Box>
      <Box>
        End Time: {loanDetails.endDateTime.toLocaleTimeString()}{" "}
        {loanDetails.endDateTime.toLocaleDateString()}
      </Box>
      <Box>Status: {LoanStatusTl[loanDetails.status]}</Box>
    </Box>
  );
};

export const TestHelper = (props: TestHelperProps): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const [contractLoans, setContractLoans] = useState<LoanDetails[]>();
  const [isPending, setIsPending] = useState(false);
  const { provider } = useWeb3Context();

  const { data: assets } = useGetAssetsQuery({
    skip: 0,
    take: 50,
  });
  const [deleteAsset] = useDeleteAssetMutation();

  const { data: listings } = useGetListingsQuery({
    skip: 0,
    take: 50,
  });
  const [deleteListing] = useDeleteListingMutation();

  const { data: loans } = useGetLoansQuery({
    skip: 0,
    take: 50,
  });
  const [deleteLoan] = useDeleteLoanMutation();

  const { data: offers } = useGetOffersQuery({
    skip: 0,
    take: 50,
  });
  const [deleteOffer] = useDeleteOfferMutation();

  const { data: terms } = useGetTermsQuery({
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

  const handleGetAllLoansFromContract = async () => {
    if (!provider) return;
    setIsPending(true);
    const tempContractLoans: LoanDetails[] = [];
    let tempLoan;
    for (let i = 1; i < 100; i++) {
      tempLoan = await dispatch(
        getLoanDetailsFromContract({
          loanId: i,
          networkId: isDev() ? NetworkIds.Rinkeby : NetworkIds.Ethereum,
          provider,
        })
      )
        .unwrap()
        .then((loanDetails: LoanDetails) => loanDetails);
      if (tempLoan.endTime === 0) break;
      tempContractLoans.push(tempLoan);
    }
    setContractLoans(tempContractLoans);
    setIsPending(false);
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
      <Button onClick={handleGetAllLoansFromContract}>Get All Loans</Button>
      {isPending && <CircularProgress />}
      {contractLoans?.map((loanDetails: LoanDetails, index: number) => (
        <SimpleLoanDetail key={`ld-${index}`} loanDetails={loanDetails} />
      ))}
    </div>
  );
};

export default TestHelper;
