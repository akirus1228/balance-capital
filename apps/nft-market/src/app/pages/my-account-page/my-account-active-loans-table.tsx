import {
  Avatar,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Loan } from "../../types/backend-types";
import style from "./my-account.module.scss";

export const currencyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

type MyAccountActiveLoansTableProps = {
  loans: Loan[] | undefined;
};

export const MyAccountActiveLoansTable = (
  props: MyAccountActiveLoansTableProps
): JSX.Element => {
  if (typeof props.loans === "undefined") {
    return <LinearProgress />;
  }
  return (
    <Paper elevation={0} sx={{ marginTop: "10px" }} className={style["rowCard"]}>
      <TableContainer>
        <Table aria-label="Active investments">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" className={style["subTitle"]}>
                  Asset
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" className={style["subTitle"]}>
                  Name
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" className={style["subTitle"]}>
                  Loan Value
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" className={style["subTitle"]}>
                  Repayment
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" className={style["subTitle"]}>
                  APR
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" className={style["subTitle"]}>
                  Duration
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" className={style["subTitle"]}>
                  Due
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" className={style["subTitle"]}>
                  Borrower
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" className={style["subTitle"]}>
                  Lender
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" className={style["subTitle"]}>
                  Status
                </Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.loans.map((loan: Loan, index: number) => (
              <TableRow key={`ma-invests-table-${index}`} id={`invests-${index}`}>
                <TableCell>
                  <Avatar />
                </TableCell>
                <TableCell>
                  <Typography variant="h6">{loan.assetListing.asset.name}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">{loan.term.amount}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">{loan.term.amount}%</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">{loan.term.apr}</Typography>
                </TableCell>
                <TableCell>{loan.term.duration}</TableCell>
                <TableCell>{loan.term.duration}</TableCell>
                <TableCell>{loan.assetListing.asset.wallet}</TableCell>
                <TableCell>{loan.assetListing.asset.wallet}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default MyAccountActiveLoansTable;
