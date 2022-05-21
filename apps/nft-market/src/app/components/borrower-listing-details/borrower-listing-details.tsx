import { Box, Button, Container, Paper, SxProps, Theme, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useListingTermDetails } from "../../hooks/use-listing-terms";
import { RootState } from "../../store";
import { selectListingFromAsset } from "../../store/selectors/listing-selectors";
import { Asset, Listing } from "../../types/backend-types";
import { useGetListingsQuery } from "../../api/backend-api";
import UpdateTerms from "../update-terms/update-terms";
import style from "./borrower-listing-details.module.scss";

export interface BorrowerListingDetailsProps {
  asset: Asset;
  sx?: SxProps<Theme>;
}

export const BorrowerListingDetails = (
  props: BorrowerListingDetailsProps
): JSX.Element => {
  console.log("BorrowerListingDetails render");
  const listing: Listing = useSelector((state: RootState) =>
    selectListingFromAsset(state, props.asset)
  );

  useGetListingsQuery({
    skip: 0,
    take: 50,
    openseaIds: props.asset.openseaId ? [props.asset?.openseaId] : [],
  });

  // calculate repayment totals
  const { repaymentTotal } = useListingTermDetails(listing);

  // update term
  const [dialogOpen, setDialogOpen] = useState(false);
  const onClickButton = () => {
    setDialogOpen(true);
  };

  const onListDialogClose = (accepted: boolean) => {
    console.log(accepted);
    setDialogOpen(false);
  };

  if (typeof listing.term === "undefined") {
    return <h3>Loading...</h3>;
  }

  return (
    <Container sx={props.sx}>
      <UpdateTerms onClose={onListDialogClose} open={dialogOpen} listing={listing} />
      <Paper>
        <Box className="flex fr fj-sa fw">
          <Box className="flex fc">
            <Typography className={style["label"]}>Total repayment</Typography>
            <Typography className={`${style["data"]} ${style["primary"]}`}>
              {repaymentTotal.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </Typography>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>Principal</Typography>
            <Typography className={`${style["data"]}`}>
              {listing.term.amount.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </Typography>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>APY</Typography>
            <Typography className={`${style["data"]}`}>{listing.term.apr}%</Typography>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>Time until offer expires</Typography>
            <Box className="flex fr w100">
              <Typography className={`${style["data"]}`}>
                {listing.term.expirationAt}
              </Typography>
            </Box>
          </Box>
          <Box className="flex fc">
            <Button variant="contained" onClick={onClickButton}>
              Update Terms
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default BorrowerListingDetails;
