import style from "./my-account-page.module.scss";
import MyAccountActiveLoansTable from "./my-account-active-loans-table";
import { Box, Container, Typography } from "@mui/material";
import { useWeb3Context } from "@fantohm/shared-web3";
import { useGetLoansQuery } from "../../api/backend-api";
import { LoanStatus } from "../../types/backend-types";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

export function shorten(str: string) {
  if (str.length < 10) return str;
  return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
}

export const MyAccountPage = (): JSX.Element => {
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
    <Container>
      <Box className={style["myAccountContainer"]}>
        <Box>
          <Typography variant="subtitle1">
            My Account <span style={{ color: "#858E93" }}>{shorten(address)}</span>
          </Typography>
        </Box>
        <h2>Active loans as borrower({activeBorrowerLoans?.length})</h2>
        <MyAccountActiveLoansTable loans={activeBorrowerLoans} />
        <h2>Active loans as lender({activeLenderLoans?.length})</h2>
        <MyAccountActiveLoansTable loans={activeLenderLoans} />
        <h2>Previous loans as borrower({historicalBorrowerLoans?.length})</h2>
        <MyAccountActiveLoansTable loans={historicalBorrowerLoans} />
        <h2>Previous loans as lender({historicalLenderLoans?.length})</h2>
        <MyAccountActiveLoansTable loans={historicalLenderLoans} />
      </Box>
    </Container>
  );
};

export default MyAccountPage;
