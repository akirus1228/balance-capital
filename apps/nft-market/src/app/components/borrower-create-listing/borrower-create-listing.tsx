import { Asset } from "@fantohm/shared-web3";
import { SxProps, Theme } from "@mui/material";
import style from "./borrower-create-listing.module.scss";

/* eslint-disable-next-line */
export interface BorrowerCreateListingProps {
  asset: Asset;
  sx?: SxProps<Theme>;
}

export const BorrowerCreateListing = (props: BorrowerCreateListingProps): JSX.Element => {
  return (
    <div>
      <h1>Welcome to BorrowerCreateListing!</h1>
    </div>
  );
};

export default BorrowerCreateListing;
