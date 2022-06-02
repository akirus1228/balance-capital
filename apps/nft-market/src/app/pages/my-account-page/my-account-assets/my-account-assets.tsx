import { Box } from "@mui/material";
import BorrowPage from "../../borrow-page/borrow-page";
import "./my-account-assets.module.scss";

/* eslint-disable-next-line */
export interface MyAccountAssetsProps {}

export function MyAccountAssets(props: MyAccountAssetsProps) {
  return (
    <Box>
      <BorrowPage />
    </Box>
  );
}

export default MyAccountAssets;
