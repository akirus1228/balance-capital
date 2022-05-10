import {
  Avatar,
  Button,
  Icon,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import style from "./my-account.module.scss";
import { useWeb3Context, Listing } from "@fantohm/shared-web3";
import { useEffect, useState } from "react";

export const currencyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

export const MyAccountActiveLoansTable = ({
  listings,
}: {
  listings: Listing[];
}): JSX.Element => {
  const { chainId } = useWeb3Context();
  const [currentBlock, setCurrentBlock] = useState<number>();

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
            {listings.map((listing: Listing, index) => (
              <TableRow key={`ma-invests-table-${index}`} id={`invests-${index}`}>
                <TableCell>
                  <Avatar />
                </TableCell>
                <TableCell>
                  <Typography variant="h6">{listing.asset.name}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">{listing.terms.amount}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">{listing.terms.amount}%</Typography>
                </TableCell>
                <TableCell>
                  {currentBlock ? (
                    <Typography variant="h6">{listing.terms.apr}</Typography>
                  ) : (
                    <></>
                  )}
                </TableCell>
                <TableCell>{listing.terms.duration}</TableCell>
                <TableCell>{listing.terms.duration}</TableCell>
                <TableCell>{listing.asset.wallet}</TableCell>
                <TableCell>{listing.asset.wallet}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default MyAccountActiveLoansTable;
