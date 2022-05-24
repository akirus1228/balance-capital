import {
  addresses,
  checkErc20Allowance,
  isDev,
  NetworkIds,
  requestErc20Allowance,
  selectErc20AllowanceByAddress,
  useWeb3Context,
} from "@fantohm/shared-web3";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  LinearProgress,
  Paper,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import store, { RootState } from "../../store";
import { useUpdateLoanMutation } from "../../api/backend-api";
import {
  getLoanDetailsFromContract,
  LoanDetails,
  repayLoan,
} from "../../store/reducers/loan-slice";
import { Asset, AssetStatus, Loan, LoanStatus } from "../../types/backend-types";
import style from "./borrower-loan-details.module.scss";

export interface BorrowerLoanDetailsProps {
  asset: Asset;
  loan: Loan;
  sx?: SxProps<Theme>;
}

type AppDispatch = typeof store.dispatch;

export const BorrowerLoanDetails = ({
  asset,
  loan,
  sx,
}: BorrowerLoanDetailsProps): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const { provider, chainId } = useWeb3Context();
  const [isPending, setIsPending] = useState(false);
  const [loanDetails, setLoanDetails] = useState<LoanDetails>({} as LoanDetails);
  // select logged in user
  const { user } = useSelector((state: RootState) => state.backend);
  const { repayLoanStatus } = useSelector((state: RootState) => state.loans);

  // status of allowance check or approval
  const { checkErc20AllowanceStatus, requestErc20AllowanceStatus, platformFee } =
    useSelector((state: RootState) => state.wallet);

  // select the USDB allowance provided to lending contract for this address
  const usdbAllowance = useSelector((state: RootState) =>
    selectErc20AllowanceByAddress(state, {
      walletAddress: user.address,
      erc20TokenAddress:
        addresses[isDev() ? NetworkIds.Rinkeby : NetworkIds.Ethereum]["USDB_ADDRESS"],
    })
  );

  const [updateLoan, { isLoading: isLoanUpdating }] = useUpdateLoanMutation();

  // check to see if we have an approval for the amount required for this txn
  useEffect(() => {
    if (chainId && user.address && provider) {
      dispatch(
        checkErc20Allowance({
          networkId: chainId || (isDev() ? NetworkIds.Rinkeby : NetworkIds.Ethereum),
          provider,
          walletAddress: user.address,
          assetAddress: addresses[chainId || NetworkIds.Ethereum]["USDB_ADDRESS"],
        })
      );
    }
  }, [chainId, user.address, provider]);

  useEffect(() => {
    if (!loan || !loan.contractLoanId || !provider) return;
    dispatch(
      getLoanDetailsFromContract({
        loanId: loan.contractLoanId,
        networkId: isDev() ? NetworkIds.Rinkeby : NetworkIds.Ethereum,
        provider,
      })
    )
      .unwrap()
      .then((loanDetails: LoanDetails) => setLoanDetails(loanDetails));
  }, [loan]);

  const handleRepayLoan = useCallback(async () => {
    if (!loan.contractLoanId || !provider) return;
    if (usdbAllowance && usdbAllowance >= loanDetails.amountDue) {
      const repayLoanParams = {
        loanId: loan.contractLoanId,
        amountDue: loanDetails.amountDueGwei,
        provider,
        networkId: isDev() ? NetworkIds.Rinkeby : NetworkIds.Ethereum,
      };
      const repayLoanResult = await dispatch(repayLoan(repayLoanParams)).unwrap();
      if (repayLoanResult === false) return; //todo: throw nice error
      const updateLoanRequest: Loan = {
        ...loan,
        assetListing: {
          ...loan.assetListing,
          asset: { ...loan.assetListing.asset, status: AssetStatus.Ready },
        },
        status: LoanStatus.Complete,
      };
      updateLoan(updateLoanRequest);
    } else {
      console.warn(`insufficiant allowance: ${usdbAllowance}`);
    }
  }, [checkErc20AllowanceStatus, requestErc20AllowanceStatus, usdbAllowance]);

  const handleRequestAllowance = useCallback(async () => {
    if (!provider) return;
    dispatch(
      requestErc20Allowance({
        networkId: chainId || (isDev() ? NetworkIds.Rinkeby : NetworkIds.Ethereum),
        provider,
        walletAddress: user.address,
        assetAddress: addresses[chainId || NetworkIds.Ethereum]["USDB_ADDRESS"],
        amount: loanDetails.amountDue,
      })
    );
  }, [checkErc20AllowanceStatus, requestErc20AllowanceStatus, usdbAllowance]);

  useEffect(() => {
    // if nothing is loading and pending is true, stop pending
    if (
      isLoanUpdating === false &&
      requestErc20AllowanceStatus !== "loading" &&
      checkErc20AllowanceStatus !== "loading" &&
      repayLoanStatus !== "loading" &&
      isPending === true
    ) {
      setIsPending(false);
    }

    // if pending is false, but something is loading, start pending
    if (
      isPending === false &&
      (isLoanUpdating === true ||
        requestErc20AllowanceStatus === "loading" ||
        checkErc20AllowanceStatus === "loading" ||
        repayLoanStatus === "loading")
    ) {
      setIsPending(true);
    }
  }, [
    isPending,
    isLoanUpdating,
    requestErc20AllowanceStatus,
    checkErc20AllowanceStatus,
    repayLoanStatus,
  ]);

  if (!loan || !loan.term || !loanDetails.amountDue) {
    return <CircularProgress />;
  }
  return (
    <Container sx={sx}>
      <Paper>
        <Box className="flex fr fj-sa fw">
          <Box className="flex fc">
            <Typography className={style["label"]}>Total repayment</Typography>
            <Typography className={`${style["data"]} ${style["primary"]}`}>
              {loanDetails.amountDue.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </Typography>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>Principal</Typography>
            <Typography className={`${style["data"]}`}>
              {loan.term.amount.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </Typography>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>APY</Typography>
            <Typography className={`${style["data"]}`}>{loan.term.apr}%</Typography>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>Time until loan expires</Typography>
            <Box className="flex fr w100">
              <Typography className={`${style["data"]}`}>55/60 days</Typography>
              <LinearProgress variant="determinate" value={10} />
            </Box>
          </Box>
          <Box className="flex fc">
            {usdbAllowance >= loanDetails.amountDue && (
              <Button variant="contained" onClick={handleRepayLoan}>
                Repay loan
              </Button>
            )}
            {usdbAllowance < loanDetails.amountDue && (
              <Button variant="contained" onClick={handleRequestAllowance}>
                Repay loan.
              </Button>
            )}
            {isPending && <Button variant="contained">Pending...</Button>}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default BorrowerLoanDetails;
