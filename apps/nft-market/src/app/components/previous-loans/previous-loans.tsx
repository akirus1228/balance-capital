import { formatCurrency } from "@fantohm/shared-helpers";
import {
  PaperTable,
  PaperTableCell,
  PaperTableHead,
  PaperTableRow,
} from "@fantohm/shared-ui-themes";
import {
  Box,
  CircularProgress,
  TableBody,
  TableContainer,
  TableRow,
} from "@mui/material";
import { useGetLoansQuery } from "../../api/backend-api";
import { useTermDetails } from "../../hooks/use-term-details";
import { Asset, Loan, LoanStatus } from "../../types/backend-types";
import "./previous-loans.module.scss";

export interface PreviousLoansProps {
  asset: Asset;
}

export const PreviousLoans = ({ asset }: PreviousLoansProps): JSX.Element => {
  const { data: loans } = useGetLoansQuery(
    {
      take: 50,
      skip: 0,
      assetId: asset.id,
      status: LoanStatus.Complete,
    },
    { skip: !asset }
  );

  if (!asset || !loans || typeof loans === "undefined") {
    return (
      <Box className="flex fr fj-c">
        <CircularProgress />
      </Box>
    );
  }
  return (
    <TableContainer>
      <PaperTable aria-label="Active investments">
        <PaperTableHead>
          <TableRow>
            <PaperTableCell>Lender</PaperTableCell>
            <PaperTableCell>Borrower</PaperTableCell>
            <PaperTableCell>Value</PaperTableCell>
            <PaperTableCell>Repayment</PaperTableCell>
            <PaperTableCell>APR</PaperTableCell>
            <PaperTableCell>Start Date</PaperTableCell>
            <PaperTableCell>Duration</PaperTableCell>
            <PaperTableCell>Status</PaperTableCell>
          </TableRow>
        </PaperTableHead>
        <TableBody>
          {loans.map((loan: Loan, index: number) => (
            <PaperTableRow key={`ma-invests-table-${index}`} id={`invests-${index}`}>
              <PaperTableCell>{loan.lender.id}</PaperTableCell>
              <PaperTableCell>{loan.borrower.id}</PaperTableCell>
              <PaperTableCell>{formatCurrency(loan.term.amount, 2)}</PaperTableCell>
              <PaperTableCell>repayment amount</PaperTableCell>
              <PaperTableCell>{loan.term.apr}%</PaperTableCell>
              <PaperTableCell>{loan.createdAt}</PaperTableCell>
              <PaperTableCell>{loan.term.duration}</PaperTableCell>
              <PaperTableCell>{loan.status}</PaperTableCell>
            </PaperTableRow>
          ))}
        </TableBody>
      </PaperTable>
    </TableContainer>
  );
};

export default PreviousLoans;
