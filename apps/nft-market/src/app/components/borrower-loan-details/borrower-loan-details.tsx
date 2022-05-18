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
import { useListingTermDetails } from "../../hooks/use-listing-terms";
import { useTermDetails } from "../../hooks/use-term-details";
import { Asset, Loan } from "../../types/backend-types";
import style from "./borrower-loan-details.module.scss";

export interface BorrowerLoanDetailsProps {
  asset: Asset;
  loan: Loan;
  sx?: SxProps<Theme>;
}

export const BorrowerLoanDetails = (props: BorrowerLoanDetailsProps): JSX.Element => {
  const { repaymentAmount, repaymentTotal, amount, apr, duration } = useTermDetails(
    props.loan.term
  );
  console.log(props.loan);

  if (!props.loan || !props.loan.term) {
    return <CircularProgress />;
  }
  return (
    <Container sx={props.sx}>
      <Paper>
        <Box className="flex fr fj-sa fw">
          <Box className="flex fc">
            <Typography className={style["label"]}>Total repayment</Typography>
            <Typography className={`${style["data"]} ${style["primary"]}`}>
              {repaymentTotal.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </Typography>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>Principal</Typography>
            <Typography className={`${style["data"]}`}>
              {props.loan.term.amount.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </Typography>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>APY</Typography>
            <Typography className={`${style["data"]}`}>{props.loan.term.apr}%</Typography>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>Time until loan expires</Typography>
            <Box className="flex fr w100">
              <Typography className={`${style["data"]}`}>55/60 days</Typography>
              <LinearProgress variant="determinate" value={10} />
            </Box>
          </Box>
          <Box className="flex fc">
            <Button variant="contained">Repay loan</Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default BorrowerLoanDetails;
