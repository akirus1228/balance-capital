import { Box, Button, Container, Paper, SxProps, Theme, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Listing } from "../../types/backend-types";
import style from "./borrower-listing-details.module.scss";

export interface BorrowerListingDetailsProps {
  listing: Listing;
  sx?: SxProps<Theme>;
}

export const BorrowerListingDetails = (
  props: BorrowerListingDetailsProps
): JSX.Element => {
  const [repaymentAmount, setRepaymentAmount] = useState(0);
  const [repaymentTotal, setRepaymentTotal] = useState(0);

  // calculate repayment totals
  useEffect(() => {
    if (
      props.listing?.terms.amount &&
      props.listing?.terms.apr &&
      props.listing?.terms.duration
    ) {
      const wholePercent = (props.listing.terms.duration / 365) * props.listing.terms.apr;
      const realPercent = wholePercent / 100;
      const _repaymentAmount = props.listing.terms.amount * realPercent;
      setRepaymentAmount(_repaymentAmount);
      setRepaymentTotal(_repaymentAmount + props.listing.terms.amount);
    }
  }, [
    props.listing?.terms.amount,
    props.listing?.terms.apr,
    props.listing?.terms.duration,
  ]);

  if (!props.listing) {
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
              {props.listing.terms.amount.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </Typography>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>APY</Typography>
            <Typography className={`${style["data"]}`}>
              {props.listing.terms.apr}%
            </Typography>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>Time until offer expires</Typography>
            <Box className="flex fr w100">
              <Typography className={`${style["data"]}`}>
                {props.listing.terms.expirationAt}
              </Typography>
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
