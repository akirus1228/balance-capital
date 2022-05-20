import style from "./my-account-page.module.scss";
import MyAccountActiveLoansTable from "./my-account-active-loans-table";
import { Box, Typography } from "@mui/material";
// import MyAccountDetailsTable from "../../../../../usdb/src/app/pages/my-account/my-account-details-table";
// import { shorten } from "../../../../../usdb/src/app/pages/my-account/my-account";
import { useWeb3Context } from "@fantohm/shared-web3";
import { useGetLoansQuery } from "../../api/backend-api";

export function shorten(str: string) {
  if (str.length < 10) return str;
  return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
}

export const MyAccountPage = (): JSX.Element => {
  const { provider, address, chainId } = useWeb3Context();
  const { data: activeBorrowerLoans, isLoading: activeBorrowerLoansIsListing } =
    useGetLoansQuery({
      take: 50,
      skip: 0,
    });
  const { data: activeLenderLoans, isLoading: activeLenderLoansIsListing } =
    useGetLoansQuery({
      take: 50,
      skip: 0,
    });
  const { data: historicalBorrowerLoans, isLoading: historicalBorrowerLoansIsListing } =
    useGetLoansQuery({
      take: 50,
      skip: 0,
    });
  const { data: historicalLenderLoans, isLoading: historicalLenderLoansIsListing } =
    useGetLoansQuery({
      take: 50,
      skip: 0,
    });

  const listings = [];
  return (
    <div>
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
    </div>
  );
};

export default MyAccountPage;
