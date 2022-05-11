import { Box, Button, Container, Paper, SxProps, Theme, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { loadListings } from "../../store/reducers/listing-slice";
import { Asset, Listing } from "../../types/backend-types";
import style from "./borrower-listing-details.module.scss";

export interface BorrowerListingDetailsProps {
  asset: Asset;
  sx?: SxProps<Theme>;
}

export const BorrowerListingDetails = (
  props: BorrowerListingDetailsProps
): JSX.Element => {
  console.log("BorrowerListingDetails render");
  const dispatch = useDispatch();
  const [repaymentAmount, setRepaymentAmount] = useState(0);
  const [repaymentTotal, setRepaymentTotal] = useState(0);

  const listing: Listing = useSelector((state: RootState) => {
    const key = Object.keys(state.listings.listings).find((key: string) => {
      const rtn =
        state.listings.listings[key].asset.assetContractAddress ===
        props.asset.assetContractAddress;

      return rtn;
    });

    if (key) {
      return state.listings.listings[key];
    } else {
      return {} as Listing;
    }
  });

  useEffect(() => {
    if (props.asset?.openseaId) {
      dispatch(
        loadListings({
          queryParams: { skip: 0, take: 50, openseaIds: [props.asset?.openseaId] },
        })
      );
    }
  }, [props.asset?.openseaId]);

  // calculate repayment totals
  useEffect(() => {
    if (
      listing &&
      listing.terms &&
      listing?.terms.amount &&
      listing?.terms.apr &&
      listing?.terms.duration
    ) {
      const wholePercent = (listing.terms.duration / 365) * listing.terms.apr;
      const realPercent = wholePercent / 100;
      const _repaymentAmount = listing.terms.amount * realPercent;
      setRepaymentAmount(_repaymentAmount);
      setRepaymentTotal(_repaymentAmount + listing.terms.amount);
    }
  }, [JSON.stringify(listing)]);

  if (typeof listing.terms === "undefined") {
    return <h3>Loading...</h3>;
  }

  return (
    <Container sx={props.sx}>
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
              {listing.terms.amount.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </Typography>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>APY</Typography>
            <Typography className={`${style["data"]}`}>{listing.terms.apr}%</Typography>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>Time until offer expires</Typography>
            <Box className="flex fr w100">
              <Typography className={`${style["data"]}`}>
                {listing.terms.expirationAt}
              </Typography>
            </Box>
          </Box>
          <Box className="flex fc">
            <Button variant="contained">Update Terms</Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default BorrowerListingDetails;
