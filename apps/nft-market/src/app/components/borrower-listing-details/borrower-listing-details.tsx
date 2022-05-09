import { Asset, Listing } from "@fantohm/shared-web3";
import { Box, Button, Container, Paper, SxProps, Theme, Typography } from "@mui/material";
import { useListing } from "../../hooks/useListing";
import style from "./borrower-listing-details.module.scss";

export interface BorrowerListingDetailsProps {
  asset: Asset;
  sx?: SxProps<Theme>;
}

export const BorrowerListingDetails = (
  props: BorrowerListingDetailsProps
): JSX.Element => {
  const listing: Listing | null = useListing(
    props.asset.assetContractAddress,
    props.asset.tokenId
  );

  if (!listing) {
    return <h3>Loading...</h3>;
  }

  return (
    <Container sx={props.sx}>
      <Paper>
        <Box className="flex fr fj-sa fw">
          <Box className="flex fc">
            <Typography className={style["label"]}>Total repayment</Typography>
            <Typography className={`${style["data"]} ${style["primary"]}`}>
              ${listing.terms.amount}
            </Typography>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>Principal</Typography>
            <Typography className={`${style["data"]}`}>$32,500</Typography>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>APY</Typography>
            <Typography className={`${style["data"]}`}>10%</Typography>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>Time until loan expires</Typography>
            <Box className="flex fr w100">
              <Typography className={`${style["data"]}`}>55/60 days</Typography>
            </Box>
          </Box>
          <Box className="flex fc">
            <Button variant="contained">Repay loan</Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default BorrowerListingDetails;
