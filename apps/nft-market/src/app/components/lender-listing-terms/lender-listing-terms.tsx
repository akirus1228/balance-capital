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
import { useListingTermDetails } from "../../hooks/use-listing-terms";
import {
  AssetStatus,
  BackendLoadingStatus,
  Listing,
  ListingStatus,
  Loan,
  Terms,
} from "../../types/backend-types";
import style from "./lender-listing-terms.module.scss";
import { RootState } from "../../store";
import { useTermDetails } from "../../hooks/use-term-details";

export interface LenderListingTermsProps {
  listing: Listing;
  sx?: SxProps<Theme>;
}

export function LenderListingTerms(props: LenderListingTermsProps) {
  const dispatch = useDispatch();
  const { provider, chainId, address } = useWeb3Context();
  const [cachedTerms, setCachedTerms] = useState<Terms>({} as Terms);
  const { user } = useSelector((state: RootState) => state.backend);
  const { checkErc20AllowanceStatus, requestErc20AllowanceStatus, platformFee } =
    useSelector((state: RootState) => state.wallet);
  const { loanCreationStatus } = useSelector((state: RootState) => state.loans);
  const allowance = useSelector((state: RootState) =>
    selectErc20AllowanceByAddress(state, {
      walletAddress: address,
      erc20TokenAddress: addresses[chainId || NetworkIds.Ethereum]["USDB_ADDRESS"],
    })
  );
  const { repaymentAmount } = useTermDetails(props.listing.terms);
  const [
    createLoan,
    { isLoading: isCreating, error: createLoanError, data: createLoanData },
  ] = useCreateLoanMutation();
  const { data: asset, isLoading: isAssetLoading } = useGetAssetQuery(
    props.listing.asset.id,
    { skip: !props.listing.asset }
  );

  // click accept terms button
  const handleAcceptTerms = useCallback(() => {
    if (!allowance || allowance < props.listing.terms.amount * (1 + platformFee)) {
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
      term: props.listing.terms,
    };
    setCachedTerms(props.listing.terms);

    createLoan(createLoanRequest);
  }, [props.listing, provider, chainId, asset, allowance, user.address]);

  // after api call to create loan is complete, execute contract call to create loan
  useEffect(() => {
    if (
      provider &&
      chainId &&
      typeof createLoanError === "undefined" &&
      isCreating === false &&
      createLoanData
    ) {
      const createLoanParams = {
        loan: {
          ...createLoanData,
          term: cachedTerms,
        },
        provider,
        networkId: chainId,
      };
      dispatch(contractCreateLoan(createLoanParams));
    }
  }, [isCreating]);

  // contract call creation status update
  useEffect(() => {
    // contract call successfully completed
    if (loanCreationStatus === BackendLoadingStatus.succeeded) {
      alert("WOOT!");
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
          amount: props.listing.terms.amount * (1 + platformFee),
        })
      );
  }, [chainId, address, props.listing.terms.amount, provider]);

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
            {(!allowance || allowance < props.listing.terms.amount * (1 + platformFee)) &&
              checkErc20AllowanceStatus === "idle" &&
              requestErc20AllowanceStatus === "idle" && (
                <Button variant="outlined" onClick={handleRequestAllowance}>
                  Provide Allowance to Your USDB
                </Button>
              )}
            {!!allowance &&
              allowance >= props.listing.terms.amount * (1 + platformFee) &&
              !isCreating && (
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
              isCreating) && (
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
