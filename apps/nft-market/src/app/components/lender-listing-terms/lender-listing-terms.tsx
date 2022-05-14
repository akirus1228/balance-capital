import { useWeb3Context } from "@fantohm/shared-web3";
import { Box, Button, Container, Paper, SxProps, Theme, Typography } from "@mui/material";
import { useCallback } from "react";
import { signTerms } from "../../helpers/signatures";
import { useListingTermDetails } from "../../hooks/use-listing-terms";
import { Listing } from "../../types/backend-types";
import style from "./lender-listing-terms.module.scss";

export interface LenderListingTermsProps {
  listing: Listing;
  sx?: SxProps<Theme>;
}

export function LenderListingTerms(props: LenderListingTermsProps) {
  const { provider, chainId, address } = useWeb3Context();
  const { repaymentTotal, repaymentAmount } = useListingTermDetails(props.listing);

  const handleAcceptTerms = useCallback(async () => {
    console.log("Accept Terms");
    if (!provider || !chainId || !address) {
      return;
    }
    const signature = await signTerms(
      provider,
      address,
      chainId,
      props.listing.asset.assetContractAddress,
      props.listing.asset.tokenId,
      props.listing.terms
    );
    console.log(signature);
  }, [props.listing, provider, chainId]);

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
            <Button variant="outlined" onClick={handleAcceptTerms}>
              Accept Terms
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default LenderListingTerms;
