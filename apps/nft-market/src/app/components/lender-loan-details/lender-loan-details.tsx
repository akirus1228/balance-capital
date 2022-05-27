import { isDev, NetworkIds, useWeb3Context } from "@fantohm/shared-web3";
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
import { useUpdateLoanMutation } from "../../api/backend-api";
import store, { RootState } from "../../store";
import {
  forecloseLoan,
  getLoanDetailsFromContract,
  LoanDetails,
} from "../../store/reducers/loan-slice";
import { Asset, AssetStatus, Loan, LoanStatus } from "../../types/backend-types";
import style from "./lender-loan-details.module.scss";

/* eslint-disable-next-line */
export interface LenderLoanDetailsProps {
  loan: Loan;
  asset: Asset;
  sx: SxProps<Theme>;
}

type AppDispatch = typeof store.dispatch;

export function LenderLoanDetails({ loan, asset, sx }: LenderLoanDetailsProps) {
  const dispatch: AppDispatch = useDispatch();
  const { provider, chainId } = useWeb3Context();
  const [isPending, setIsPending] = useState(false);
  const [loanDetails, setLoanDetails] = useState<LoanDetails>({} as LoanDetails);
  // select logged in user
  const { user } = useSelector((state: RootState) => state.backend);
  const { forecloseLoanStatus } = useSelector((state: RootState) => state.loans);

  const [updateLoan, { isLoading: isLoanUpdating }] = useUpdateLoanMutation();

  useEffect(() => {
    console.log("Getloandetails");
    if (!loan || !loan.contractLoanId || !provider) return;
    console.log("Getloandetails");
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

  const handleForecloseLoan = useCallback(async () => {
    console.log("Handle foreclose loan");
    if (!loan.contractLoanId || !provider) {
      console.warn("Missing prereqs");
      return;
    }
    console.log(`+loan.contractLoanId ${loan.contractLoanId}`);
    console.log(`provider ${provider}`);
    setIsPending(true);
    const result = await dispatch(
      forecloseLoan({
        loanId: +loan.contractLoanId,
        provider,
        networkId: isDev() ? NetworkIds.Rinkeby : NetworkIds.Ethereum,
      })
    ).unwrap();

    const updateLoanRequest: Loan = {
      ...loan,
      assetListing: {
        ...loan.assetListing,
        asset: {
          ...loan.assetListing.asset,
          status: AssetStatus.Ready,
          owner: user,
        },
      },
      status: LoanStatus.Default,
    };
    updateLoan(updateLoanRequest);
    setIsPending(false);
    console.log(result);
  }, [loan, provider]);

  if (!loan || !loan.term || !loanDetails.amountDue) {
    return (
      <Box className="flex fr fj-c">
        <CircularProgress />
      </Box>
    );
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
            {loanDetails.endTime < Date.now() && !isPending && (
              <Button variant="contained" onClick={handleForecloseLoan}>
                Foreclose Loan
              </Button>
            )}
            {isPending && <Button variant="contained">Pending...</Button>}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default LenderLoanDetails;
