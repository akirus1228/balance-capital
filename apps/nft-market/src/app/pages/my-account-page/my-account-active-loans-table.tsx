import { addressEllipsis, formatCurrency } from "@fantohm/shared-helpers";
import {
  PaperTable,
  PaperTableCell,
  PaperTableHead,
  PaperTableRow,
} from "@fantohm/shared-ui-themes";
import {
  Avatar,
  Chip,
  LinearProgress,
  TableBody,
  TableContainer,
  TableRow,
} from "@mui/material";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../store";
import { Loan, LoanStatus } from "../../types/backend-types";
// import style from "./my-account.module.scss";

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
  const { user } = useSelector((state: RootState) => state.backend);
  if (typeof props.loans === "undefined") {
    return <LinearProgress />;
  }
  if (props.loans.length < 1) {
    return <></>;
  }
  return (
    <TableContainer>
      <PaperTable aria-label="Active investments">
        <PaperTableHead>
          <TableRow>
            <PaperTableCell>Asset</PaperTableCell>
            <PaperTableCell>Name</PaperTableCell>
            <PaperTableCell>Loan Value</PaperTableCell>
            <PaperTableCell>Repayment</PaperTableCell>
            <PaperTableCell>APR</PaperTableCell>
            <PaperTableCell>Duration</PaperTableCell>
            <PaperTableCell>Due</PaperTableCell>
            <PaperTableCell>Borrower</PaperTableCell>
            <PaperTableCell>Lender</PaperTableCell>
            <PaperTableCell>Status</PaperTableCell>
            <PaperTableCell></PaperTableCell>
          </TableRow>
        </PaperTableHead>
        <TableBody>
          {props.loans.map((loan: Loan, index: number) => (
            <PaperTableRow key={`ma-invests-table-${index}`} id={`invests-${index}`}>
              <PaperTableCell>
                <Avatar
                  className="squared"
                  alt={loan.assetListing.asset.name || ""}
                  src={loan.assetListing.asset.frameUrl || ""}
                />
              </PaperTableCell>
              <PaperTableCell>
                <Link
                  to={`/asset/${loan.assetListing.asset.assetContractAddress}/${loan.assetListing.asset.tokenId}`}
                >
                  {loan.assetListing.asset.name}
                </Link>
              </PaperTableCell>
              <PaperTableCell>{formatCurrency(loan.term.amount, 2)}</PaperTableCell>
              <PaperTableCell>{loan.term.amount}%</PaperTableCell>
              <PaperTableCell>{loan.term.apr}</PaperTableCell>
              <PaperTableCell>{loan.term.duration}</PaperTableCell>
              <PaperTableCell>{loan.term.duration}</PaperTableCell>
              <PaperTableCell>
                {loan.borrower.address === user.address
                  ? "You"
                  : addressEllipsis(loan.borrower.address)}
              </PaperTableCell>
              <PaperTableCell>
                {loan.lender.address === user.address
                  ? "You"
                  : addressEllipsis(loan.lender.address)}
              </PaperTableCell>
              <PaperTableCell>
                {loan.status === LoanStatus.Active && <Chip label="Escrow" />}
                {loan.status === LoanStatus.Default && <Chip label="Foreclose" />}
                {loan.status === LoanStatus.Complete && <Chip label="Completed" />}
              </PaperTableCell>
            </PaperTableRow>
          ))}
        </TableBody>
      </PaperTable>
    </TableContainer>
  );
};

export default MyAccountActiveLoansTable;
