import { Asset } from "@fantohm/shared-web3";
import { Box, Chip, Container, Grid, Skeleton, Typography } from "@mui/material";
import AssetOwnerTag from "../asset-owner-tag/asset-owner-tag";
import style from "./asset-details.module.scss";
import StatusInfo from "./status-info/status-info";

export interface AssetDetailsProps {
  asset: Asset;
}

export const AssetDetails = (props: AssetDetailsProps): JSX.Element => {
  return (
    <Container>
      {props.asset && props.asset.imageUrl ? (
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
              <img src={props.asset.imageUrl} alt={props.asset.name || "unknown"} />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography>{props.asset.name}</Typography>
              <h1>{props.asset.name}</h1>
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
              <Chip label={props.asset.status || "Unlisted"} />
              <Typography sx={{ mx: "10px" }}>.</Typography>
              <Chip label={props.asset.mediaType || "Art"} />
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
                    <AssetOwnerTag asset={props.asset} sx={{ mb: "3em" }} />
                  </Box>
                  <Box>
                    <Typography className={style["label"]}>Listed</Typography>
                    <Typography className={style["name"]}>14 hours ago</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
            <StatusInfo asset={props.asset} />
          </Grid>
        </Grid>
      ) : (
        <Skeleton variant="rectangular"></Skeleton>
      )}
    </Container>
  );
};

export default AssetDetails;
