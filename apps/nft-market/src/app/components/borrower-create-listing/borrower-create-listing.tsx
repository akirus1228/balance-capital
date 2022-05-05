import { Asset } from "@fantohm/shared-web3";
import { Box, Button, Container, Paper, SxProps, Theme } from "@mui/material";
import { useState } from "react";
import style from "./borrower-create-listing.module.scss";
import ListAsCollateral from "./list-as-collateral/list-as-collateral";

/* eslint-disable-next-line */
export interface BorrowerCreateListingProps {
  asset: Asset;
  sx?: SxProps<Theme>;
}

export const BorrowerCreateListing = (props: BorrowerCreateListingProps): JSX.Element => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const onClickButton = () => {
    setDialogOpen(true);
  };

  const onListDialogClose = (accepted: boolean) => {
    console.log(accepted);
    setDialogOpen(false);
  };

  return (
    <Container sx={props.sx}>
      <ListAsCollateral onClose={onListDialogClose} open={dialogOpen} />
      <Paper>
        <Box className="flex fr fj-sa fw">
          <Button variant="contained" onClick={onClickButton}>
            List this asset as collateral
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default BorrowerCreateListing;
