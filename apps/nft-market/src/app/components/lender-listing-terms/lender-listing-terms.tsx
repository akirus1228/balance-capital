import {
  addresses,
  checkErc20Allowance,
  isDev,
  NetworkIds,
  requestErc20Allowance,
  selectErc20AllowanceByAddress,
  useWeb3Context,
} from "@fantohm/shared-web3";
import { Box, Button, Container, Paper, SxProps, Theme, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCreateLoanMutation, useGetAssetQuery } from "../../api/backend-api";
import { contractCreateLoan } from "../../store/reducers/loan-slice";
import {
  AssetStatus,
  BackendLoadingStatus,
  Listing,
  ListingStatus,
  Loan,
  LoanStatus,
  Terms,
} from "../../types/backend-types";
import style from "./lender-listing-terms.module.scss";
import store, { RootState } from "../../store";
import { useTermDetails } from "../../hooks/use-term-details";
import { MakeOffer } from "../make-offer/make-offer";

export interface LenderListingTermsProps {
  listing: Listing;
  sx?: SxProps<Theme>;
}

type AppDispatch = typeof store.dispatch;

export function LenderListingTerms(props: LenderListingTermsProps) {
  const dispatch: AppDispatch = useDispatch();
  const { provider, chainId, address } = useWeb3Context();
  // local store of term to pass between methods
  const [cachedTerms, setCachedTerms] = useState<Terms>({} as Terms);
  // logged in user
  const { user, authSignature } = useSelector((state: RootState) => state.backend);
  // status of contract calls for allowance and platform fee
  const { checkErc20AllowanceStatus, requestErc20AllowanceStatus, platformFee } =
    useSelector((state: RootState) => state.wallet);
  // status that tracks the status of a createLoan contract call
  const { loanCreationStatus } = useSelector((state: RootState) => state.loans);
  // select the USDB allowance provided to lending contract for this address
  const allowance = useSelector((state: RootState) =>
    selectErc20AllowanceByAddress(state, {
      walletAddress: address,
      erc20TokenAddress: addresses[chainId || NetworkIds.Ethereum]["USDB_ADDRESS"],
    })
  );

  // helper to calculate term details like repayment amount
  const { repaymentAmount } = useTermDetails(props.listing.term);
  // createloan backend api call
  const [
    createLoan,
    { isLoading: isCreating, error: createLoanError, data: createLoanData },
  ] = useCreateLoanMutation();

  // query assets from the backend API
  const { data: asset, isLoading: isAssetLoading } = useGetAssetQuery(
    props.listing.asset.id,
    { skip: !props.listing.asset || !authSignature }
  );

  // click accept term button
  const handleAcceptTerms = useCallback(async () => {
    if (!allowance || allowance < props.listing.term.amount * (1 + platformFee)) {
      console.warn("Insufficiant allownace. Trigger request");
      return;
    }
    if (!provider || !chainId || !address || !asset || !asset.owner) {
      console.warn("missing critical data");
      return;
    }
    const createLoanRequest: Loan = {
      lender: user,
      borrower: asset.owner,
      assetListing: {
        ...props.listing,
        status: ListingStatus.Completed,
        asset: { ...props.listing.asset, status: AssetStatus.Locked },
      },
      term: props.listing.term,
      status: LoanStatus.Active,
    };

    const createLoanParams = {
      loan: createLoanRequest,
      provider,
      networkId: chainId,
    };
    const createLoanResult = await dispatch(
      contractCreateLoan(createLoanParams)
    ).unwrap();
    if (createLoanResult) {
      createLoanRequest.contractLoanId = createLoanResult;
      createLoan(createLoanRequest);
    }
  }, [props.listing, provider, chainId, asset, allowance, user.address]);

  // contract call creation status update
  useEffect(() => {
    // contract call successfully completed
    if (loanCreationStatus === BackendLoadingStatus.succeeded) {
      // todo: display success notification growl
    } else if (loanCreationStatus === BackendLoadingStatus.failed) {
      // todo: display error notification growl
    }
  }, [loanCreationStatus]);

  // request allowance necessary to complete txn
  const handleRequestAllowance = useCallback(() => {
    if (provider && address)
      dispatch(
        requestErc20Allowance({
          networkId: chainId || (isDev() ? NetworkIds.Rinkeby : NetworkIds.Ethereum),
          provider,
          walletAddress: address,
          assetAddress: addresses[chainId || NetworkIds.Ethereum]["USDB_ADDRESS"],
          amount: props.listing.term.amount * (1 + platformFee),
        })
      );
  }, [chainId, address, props.listing.term.amount, provider]);

  // check to see if we have an approval for the amount required for this txn
  useEffect(() => {
    if (chainId && address && provider) {
      dispatch(
        checkErc20Allowance({
          networkId: chainId || (isDev() ? NetworkIds.Rinkeby : NetworkIds.Ethereum),
          provider,
          walletAddress: address,
          assetAddress: addresses[chainId || NetworkIds.Ethereum]["USDB_ADDRESS"],
        })
      );
    }
  }, [chainId, address, provider]);

  // make offer code
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleMakeOffer = () => {
    setDialogOpen(true);
  };

  const onListDialogClose = (accepted: boolean) => {
    setDialogOpen(false);
  };

  return (
    <Container sx={props.sx}>
      <MakeOffer onClose={onListDialogClose} open={dialogOpen} listing={props.listing} />
      <Paper>
        <Box className="flex fr fj-sa fw">
          <Box className="flex fc">
            <Typography className={style["label"]}>Principal</Typography>
            <Typography className={`${style["data"]} ${style["primary"]}`}>
              {props.listing.term.amount.toLocaleString("en-US", {
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
              {props.listing.term.duration} days
            </Typography>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>APY</Typography>
            <Typography className={`${style["data"]}`}>
              {props.listing.term.apr}%
            </Typography>
          </Box>
          <Box className="flex fc">
            <Button variant="contained" onClick={handleMakeOffer}>
              Make Offer
            </Button>
          </Box>
          <Box className="flex fc">
            {(!allowance || allowance < props.listing.term.amount * (1 + platformFee)) &&
              checkErc20AllowanceStatus === "idle" &&
              requestErc20AllowanceStatus === "idle" && (
                <Button variant="outlined" onClick={handleRequestAllowance}>
                  Provide Allowance to Your USDB
                </Button>
              )}
            {!!allowance &&
              allowance >= props.listing.term.amount * (1 + platformFee) &&
              !isCreating &&
              loanCreationStatus !== "loading" && (
                <Button
                  variant="outlined"
                  onClick={handleAcceptTerms}
                  disabled={isCreating}
                >
                  Accept Terms
                </Button>
              )}
            {(checkErc20AllowanceStatus === "loading" ||
              requestErc20AllowanceStatus === "loading" ||
              isCreating ||
              loanCreationStatus === "loading") && (
              <Button variant="outlined" disabled={true}>
                Pending...
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default LenderListingTerms;
