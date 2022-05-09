import { Asset, Listing } from "@fantohm/shared-web3";
import { Box, Button, Container, Paper, SxProps, Theme, Typography } from "@mui/material";
import { useEffect, useState } from "react";
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
  const [repaymentAmount, setRepaymentAmount] = useState(0);
  const [repaymentTotal, setRepaymentTotal] = useState(0);

  // calculate repayment totals
  useEffect(() => {
    if (listing?.terms.amount && listing?.terms.apr && listing?.terms.duration) {
      const wholePercent = (listing.terms.duration / 365) * listing.terms.apr;
      const realPercent = wholePercent / 100;
      const _repaymentAmount = listing.terms.amount * realPercent;
      setRepaymentAmount(_repaymentAmount);
      setRepaymentTotal(_repaymentAmount + listing.terms.amount);
    }
  }, [listing?.terms.amount, listing?.terms.apr, listing?.terms.duration]);

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
              {repaymentTotal.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </Typography>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>Principal</Typography>
            <Typography className={`${style["data"]}`}>{listing.terms.amount.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}</Typography>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>APY</Typography>
            <Typography className={`${style["data"]}`}>{listing.terms.apr}%</Typography>
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
