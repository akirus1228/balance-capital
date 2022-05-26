import { prettifySeconds } from "@fantohm/shared-web3";
import { Box, Chip, Container, Grid, Paper, Skeleton, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useGetLoansQuery } from "../../api/backend-api";
import { useWalletAsset } from "../../hooks/use-wallet-asset";
import { RootState } from "../../store";
import { Listing, LoanStatus } from "../../types/backend-types";
import AssetOwnerTag from "../asset-owner-tag/asset-owner-tag";
import style from "./asset-details.module.scss";
import QuickStatus from "./quick-status/quick-status";
import StatusInfo from "./status-info/status-info";

export interface AssetDetailsProps {
  contractAddress: string;
  tokenId: string;
  listing?: Listing;
}

export const AssetDetails = ({
  contractAddress,
  tokenId,
  listing,
  ...props
}: AssetDetailsProps): JSX.Element => {
  const { authSignature } = useSelector((state: RootState) => state.backend);
  const asset = useWalletAsset(contractAddress, tokenId);
  const { data: loan, isLoading: isLoanLoading } = useGetLoansQuery(
    {
      skip: 0,
      take: 1,
      assetId: asset !== null ? asset.id : "",
    },
    {
      skip: !asset || asset === null || !asset.id || !listing || !authSignature,
    }
  );

  return (
    <Container>
      <Box
        sx={{
          position: "absolute",
          width: "100vw",
          height: "251px",
          top: "0",
          left: "0",
          zIndex: "-1",
          opacity: "0.23",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            backgroundImage: `url("${asset?.imageUrl}")`,
            height: "100%",
            width: "100%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "100vw",
            position: "relative",
            filter: "blur(8px)",
          }}
        ></Box>
      </Box>
      {asset && asset.imageUrl ? (
        <Grid container columnSpacing={5}>
          <Grid item xs={12} md={6}>
            <Box
              className={style["imgContainer"]}
              sx={{
                borderRadius: "30px",
                overflow: "hidden",
                height: "50vh",
                width: "50vh",
              }}
            >
              <img src={asset.imageUrl} alt={asset.name || "unknown"} />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography>{asset.collection?.name || ""}</Typography>
              <h1>{asset.name}</h1>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                minWidth: "50%",
                pb: "3em",
              }}
            >
              <Chip label={asset.status || "Unlisted"} className="dark" />
              <Typography sx={{ mx: "10px" }}>.</Typography>
              <Chip label={asset.mediaType || "Art"} className="light" />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", mb: "3em" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  background: "#FFF",
                  borderRadius: "30px",
                  py: "1em",
                  width: "100%",
                }}
              >
                <Paper
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}
                  >
                    <AssetOwnerTag asset={asset} />
                  </Box>
                  <QuickStatus listing={listing} />
                </Paper>
              </Box>
            </Box>
            {!!listing && (
              <StatusInfo
                asset={asset}
                listing={listing}
                loan={loan ? loan[0] : undefined}
              />
            )}
          </Grid>
        </Grid>
      ) : (
        <Skeleton variant="rectangular"></Skeleton>
      )}
    </Container>
  );
};

export default AssetDetails;
