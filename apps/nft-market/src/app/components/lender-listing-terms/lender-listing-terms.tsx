import { Box, Button, Container, Paper, SxProps, Theme, Typography } from "@mui/material";
import { useListingTermDetails } from "../../hooks/use-listing-terms";
import { Listing } from "../../types/backend-types";
import style from "./lender-listing-terms.module.scss";

export interface LenderListingTermsProps {
  listing: Listing;
  sx?: SxProps<Theme>;
}

export function LenderListingTerms(props: LenderListingTermsProps) {
  const { repaymentTotal, repaymentAmount } = useListingTermDetails(props.listing);

  return (
    <Container sx={props.sx}>
      <Paper>
        <Box className="flex fr fj-sa fw">
          <Box className="flex fc">
            <Typography className={style["label"]}>Principal</Typography>
            <Typography className={`${style["data"]} ${style["primary"]}`}>
              {props.listing.terms.amount.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </Typography>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>Repayment</Typography>
            <Typography className={`${style["data"]}`}>
              {repaymentAmount.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </Typography>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>Duration</Typography>
            <Typography className={`${style["data"]}`}>
              {props.listing.terms.duration} days
            </Typography>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>APY</Typography>
            <Typography className={`${style["data"]}`}>
              {props.listing.terms.apr}%
            </Typography>
          </Box>
          <Box className="flex fc">
            <Button variant="contained">Make Offer</Button>
          </Box>
          <Box className="flex fc">
            <Button variant="outlined">Accept Terms</Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default LenderListingTerms;
