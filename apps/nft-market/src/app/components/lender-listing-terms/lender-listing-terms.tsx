import { useWeb3Context } from "@fantohm/shared-web3";
import { Box, Button, Container, Paper, SxProps, Theme, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCreateLoanMutation, useGetAssetQuery } from "../../api/backend-api";
import { contractCreateLoan } from "../../store/reducers/loan-slice";
import { signTerms } from "../../helpers/signatures";
import { useListingTermDetails } from "../../hooks/use-listing-terms";
import {
  BackendLoadingStatus,
  Listing,
  ListingStatus,
  Loan,
  Terms,
} from "../../types/backend-types";
import style from "./lender-listing-terms.module.scss";
import { RootState } from "../../store";

export interface LenderListingTermsProps {
  listing: Listing;
  sx?: SxProps<Theme>;
}

export function LenderListingTerms(props: LenderListingTermsProps) {
  const { provider, chainId, address } = useWeb3Context();
  const [cachedTerms, setCachedTerms] = useState<Terms>({} as Terms);
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.backend);
  const { loanCreationStatus } = useSelector((state: RootState) => state.loans);
  const { repaymentTotal, repaymentAmount } = useListingTermDetails(props.listing);
  const [
    createLoan,
    { isLoading: isCreating, error: createLoanError, data: createLoanData },
  ] = useCreateLoanMutation();
  const { data: asset, isLoading: isAssetLoading } = useGetAssetQuery(
    props.listing.asset.id,
    { skip: !props.listing.asset }
  );

  const handleAcceptTerms = useCallback(async () => {
    console.log("Accept Terms");
    if (!provider || !chainId || !address || !asset || !asset.owner) {
      console.log("missing data");
      console.log(asset);
      console.log(asset?.owner);
      console.log(props.listing.asset);
      return;
    }
    console.log(props.listing);

    const { id, ...term } = props.listing.terms;

    const createLoanRequest: Loan = {
      lender: user,
      borrower: asset.owner,
      assetListing: { ...props.listing, status: ListingStatus.Pending },
      term,
    };
    setCachedTerms(term);

    createLoan(createLoanRequest);
  }, [props.listing, provider, chainId, asset]);

  useEffect(() => {
    console.log(isCreating);
    console.log(createLoanError);
    console.log(createLoanData);
    if (
      provider &&
      chainId &&
      typeof createLoanError === "undefined" &&
      isCreating === false &&
      createLoanData
    ) {
      dispatch(
        contractCreateLoan({
          loan: {
            ...createLoanData,
            term: cachedTerms,
          },
          provider,
          networkId: chainId,
        })
      );
    }
  }, [isCreating]);

  useEffect(() => {
    if (loanCreationStatus === BackendLoadingStatus.succeeded) {
      alert("WOOT!");
    }
  }, [loanCreationStatus]);

  useEffect(() => {
    console.log("asset watch");
    console.log(asset);
  }, [asset]);

  return (
    <Container sx={props.sx}>
      <Paper>
        <Box className="flex fr fj-sa fw">
          <Box className="flex fc">
            <Typography className={style["label"]}>Principal</Typography>
            <Typography className={`${style["data"]} ${style["primary"]}`}>
              {props.listing.terms.amount.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </Typography>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>Repayment</Typography>
            <Typography className={`${style["data"]}`}>
              {repaymentAmount.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </Typography>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>Duration</Typography>
            <Typography className={`${style["data"]}`}>
              {props.listing.terms.duration} days
            </Typography>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>APY</Typography>
            <Typography className={`${style["data"]}`}>
              {props.listing.terms.apr}%
            </Typography>
          </Box>
          <Box className="flex fc">
            <Button variant="contained">Make Offer</Button>
          </Box>
          <Box className="flex fc">
            <Button
              variant="outlined"
              onClick={handleAcceptTerms}
              disabled={isAssetLoading}
            >
              Accept Terms
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default LenderListingTerms;
