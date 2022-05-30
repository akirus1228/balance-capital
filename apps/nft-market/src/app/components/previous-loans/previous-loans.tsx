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
  SxProps,
  TableBody,
  TableContainer,
  TableRow,
  Theme,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useGetLoansQuery } from "../../api/backend-api";
import { RootState } from "../../store";
import { Asset, Loan, LoanStatus } from "../../types/backend-types";
import style from "./previous-loans.module.scss";

export interface PreviousLoansProps {
  asset: Asset;
  sx?: SxProps<Theme>;
}

export const PreviousLoans = ({ asset, sx }: PreviousLoansProps): JSX.Element => {
  const { authSignature } = useSelector((state: RootState) => state.backend);
  const { data: loans, isLoading } = useGetLoansQuery(
    {
      take: 50,
      skip: 0,
      assetId: asset.id,
      status: LoanStatus.Complete,
    },
    { skip: !asset || !authSignature }
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
    <Box className="flex fc fj-fs" sx={{ mb: "5em", ...sx }}>
      <h2 style={{ marginBottom: "0" }}>Previous Loans</h2>
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
                <PaperTableCell sx={{ fontSize: "16px" }}>
                  repayment amount
                </PaperTableCell>
                <PaperTableCell sx={{ fontSize: "16px" }}>
                  {loan.term.apr}%
                </PaperTableCell>
                <PaperTableCell sx={{ fontSize: "16px" }}>
                  {new Date(
                    Date.parse(loan.createdAt || "yesterday")
                  ).toLocaleDateString()}
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
    </Box>
  );
};

export default PreviousLoans;
