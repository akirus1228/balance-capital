import { addressEllipsis, formatCurrency } from "@fantohm/shared-helpers";
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
import { useMemo } from "react";
import { useGetLoansQuery } from "../../api/backend-api";
import { useTermDetails } from "../../hooks/use-term-details";
import { Asset, Loan, LoanStatus } from "../../types/backend-types";
import "./previous-loans.module.scss";

export interface PreviousLoansProps {
  asset: Asset;
}

export const PreviousLoans = ({ asset }: PreviousLoansProps): JSX.Element => {
  const { data: loans, isLoading } = useGetLoansQuery(
    {
      take: 50,
      skip: 0,
      assetId: asset.id,
      status: LoanStatus.Complete,
    },
    { skip: !asset }
  );

  if (!asset || !loans || typeof loans === "undefined" || isLoading) {
    return (
      <Box className="flex fr fj-c">
        <CircularProgress />
      </Box>
    );
  }
  if (!isLoading && loans.length < 1) {
    return (
      <Box className="flex fr fj-c">
        <h2>No loan history for this asset</h2>
      </Box>
    );
  }
  return (
    <TableContainer>
      <PaperTable aria-label="Active investments">
        <PaperTableHead>
          <TableRow>
            <PaperTableCell sx={{ fontSize: "16px" }}>Lender</PaperTableCell>
            <PaperTableCell sx={{ fontSize: "16px" }}>Borrower</PaperTableCell>
            <PaperTableCell sx={{ fontSize: "16px" }}>Value</PaperTableCell>
            <PaperTableCell sx={{ fontSize: "16px" }}>Repayment</PaperTableCell>
            <PaperTableCell sx={{ fontSize: "16px" }}>APR</PaperTableCell>
            <PaperTableCell sx={{ fontSize: "16px" }}>Start Date</PaperTableCell>
            <PaperTableCell sx={{ fontSize: "16px" }}>Duration</PaperTableCell>
            <PaperTableCell sx={{ fontSize: "16px" }}>Status</PaperTableCell>
          </TableRow>
        </PaperTableHead>
        <TableBody>
          {loans.map((loan: Loan, index: number) => (
            <PaperTableRow key={`ma-invests-table-${index}`} id={`invests-${index}`}>
              <PaperTableCell sx={{ fontSize: "16px" }}>
                {addressEllipsis(loan.lender.id || "", 3)}
              </PaperTableCell>
              <PaperTableCell sx={{ fontSize: "16px" }}>
                {addressEllipsis(loan.borrower.id || "", 3)}
              </PaperTableCell>
              <PaperTableCell sx={{ fontSize: "16px" }}>
                {formatCurrency(loan.term.amount, 2)}
              </PaperTableCell>
              <PaperTableCell sx={{ fontSize: "16px" }}>repayment amount</PaperTableCell>
              <PaperTableCell sx={{ fontSize: "16px" }}>{loan.term.apr}%</PaperTableCell>
              <PaperTableCell sx={{ fontSize: "16px" }}>
                {new Date(Date.parse(loan.createdAt || "yesterday")).toLocaleDateString()}
              </PaperTableCell>
              <PaperTableCell sx={{ fontSize: "16px" }}>
                {loan.term.duration} days
              </PaperTableCell>
              <PaperTableCell sx={{ fontSize: "16px" }}>{loan.status}</PaperTableCell>
            </PaperTableRow>
          ))}
        </TableBody>
      </PaperTable>
    </TableContainer>
  );
};

export default PreviousLoans;
