import { useWeb3Context } from "@fantohm/shared-web3";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { useGetLoansQuery } from "../../../api/backend-api";
import { RootState } from "../../../store";
import { LoanStatus } from "../../../types/backend-types";
import MyAccountActiveLoansTable from "../my-account-active-loans-table";
import style from "./my-account-loans.module.scss";

/* eslint-disable-next-line */
export interface MyAccountLoansProps {}

export function MyAccountLoans(props: MyAccountLoansProps) {
  const { address } = useWeb3Context();
  const { authSignature } = useSelector((state: RootState) => state.backend);

  const { data: activeBorrowerLoans } = useGetLoansQuery(
    {
      take: 50,
      skip: 0,
      status: LoanStatus.Active,
      borrowerAddress: address,
    },
    { skip: !address || !authSignature }
  );
  const { data: activeLenderLoans } = useGetLoansQuery(
    {
      take: 50,
      skip: 0,
      status: LoanStatus.Active,
      lenderAddress: address,
    },
    { skip: !address || !authSignature }
  );
  const { data: historicalBorrowerLoans } = useGetLoansQuery(
    {
      take: 50,
      skip: 0,
      status: LoanStatus.Complete,
      borrowerAddress: address,
    },
    { skip: !address || !authSignature }
  );
  const { data: historicalLenderLoans } = useGetLoansQuery(
    {
      take: 50,
      skip: 0,
      status: LoanStatus.Complete,
      lenderAddress: address,
    },
    { skip: !address || !authSignature }
  );

  return (
    <Box className={style["myAccountContainer"]}>
      <h2>Active loans as borrower({activeBorrowerLoans?.length})</h2>
      <MyAccountActiveLoansTable loans={activeBorrowerLoans} />
      <h2>Active loans as lender({activeLenderLoans?.length})</h2>
      <MyAccountActiveLoansTable loans={activeLenderLoans} />
      <h2>Previous loans as borrower({historicalBorrowerLoans?.length})</h2>
      <MyAccountActiveLoansTable loans={historicalBorrowerLoans} />
      <h2>Previous loans as lender({historicalLenderLoans?.length})</h2>
      <MyAccountActiveLoansTable loans={historicalLenderLoans} />
    </Box>
  );
}

export default MyAccountLoans;
