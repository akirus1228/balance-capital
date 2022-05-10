import { Box, Chip, Container, Grid, Skeleton, Typography } from "@mui/material";
import { useWalletAsset } from "../../hooks/useWalletAsset";
import AssetOwnerTag from "../asset-owner-tag/asset-owner-tag";
import style from "./asset-details.module.scss";
import StatusInfo from "./status-info/status-info";

export interface AssetDetailsProps {
  contractAddress: string;
  tokenId: string;
}

export const AssetDetails = (props: AssetDetailsProps): JSX.Element => {
  console.log("asset from assetDetails");
  const asset = useWalletAsset(props.contractAddress, props.tokenId);

  return (
    <Container>
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
              <Typography>{asset.name}</Typography>
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
              <Chip label={asset.status || "Unlisted"} />
              <Typography sx={{ mx: "10px" }}>.</Typography>
              <Chip label={asset.mediaType || "Art"} />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
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
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-around",
                    }}
                  >
                    <AssetOwnerTag asset={asset} sx={{ mb: "3em" }} />
                  </Box>
                  <Box>
                    <Typography className={style["label"]}>Listed</Typography>
                    <Typography className={style["name"]}>14 hours ago</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
            <StatusInfo asset={asset} />
          </Grid>
        </Grid>
      ) : (
        <Skeleton variant="rectangular"></Skeleton>
      )}
    </Container>
  );
};

export default AssetDetails;
