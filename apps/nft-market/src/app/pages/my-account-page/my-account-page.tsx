import style from "./my-account-page.module.scss";
import MyAccountActiveLoansTable from "./my-account-active-loans-table";
import { Box, Typography } from "@mui/material";
// import MyAccountDetailsTable from "../../../../../usdb/src/app/pages/my-account/my-account-details-table";
// import { shorten } from "../../../../../usdb/src/app/pages/my-account/my-account";
import { useWeb3Context } from "@fantohm/shared-web3";

export function shorten(str: string) {
  if (str.length < 10) return str;
  return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
}

export const MyAccountPage = (): JSX.Element => {
  const { provider, address, chainId } = useWeb3Context();

  const listings = [];
  return (
    <div>
      <Box>
        <Typography variant="subtitle1">
          My Account <span style={{ color: "#858E93" }}>{shorten(address)}</span>
        </Typography>
      </Box>
      <h2>Active loans as borrower({listings.length})</h2>
      <MyAccountActiveLoansTable listings={[]} />
      <h2>Active loans as lender({listings.length})</h2>
      <MyAccountActiveLoansTable listings={[]} />
      <h2>Previous loans as borrower({listings.length})</h2>
      <MyAccountActiveLoansTable listings={[]} />
      <h2>Previous loans as lender({listings.length})</h2>
      <MyAccountActiveLoansTable listings={[]} />
    </div>
  );
};

export default MyAccountPage;
