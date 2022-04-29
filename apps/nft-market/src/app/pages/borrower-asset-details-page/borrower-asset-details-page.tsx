import { Asset } from "@fantohm/shared-web3";
import { Avatar, Box, Chip, Container, Grid, Skeleton, Typography } from "@mui/material";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../../store";
import style from "./borrower-asset-details-page.module.scss";
import tmpAvatar from "../../../assets/images/temp-avatar.png";

export const BorrowerAssetDetailsPage = (): JSX.Element => {
  const params = useParams();

  const wallet = useSelector((state: RootState) => state.wallet);
  const backend = useSelector((state: RootState) => state.nftMarketplace);

  const currentAsset: Asset = useMemo(() => {
    if (params["assetId"]) {
      return wallet.assets.filter((asset) => asset.id === params["assetId"])[0];
    } else {
      return {} as Asset;
    }
  }, [wallet.assets]);

  return (
    <Container>
      {currentAsset && currentAsset.imageUrl ? (
        <Grid container columnSpacing={5}>
          <Grid item>
            <Box
              className={style["imgContainer"]}
              sx={{
                borderRadius: "30px",
                overflow: "hidden",
                height: "50vh",
                width: "50vh",
              }}
            >
              <img src={currentAsset.imageUrl} alt={currentAsset.name || "unknown"} />
            </Box>
          </Grid>
          <Grid item>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography>{currentAsset.name}</Typography>
              <h1>{currentAsset.name}</h1>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  background: "#FFF",
                  borderRadius: "30px",
                  paddingTop: "5em",
                  px: "20px",
                }}
              >
                <Box sx={{ position: "absolute" }}>
                  <Chip
                    sx={{
                      position: "relative",
                      top: "15px",
                      left: "20px",
                      zIndex: 10,
                    }}
                    label={currentAsset.status || "Unlisted"}
                  />
                  <Chip
                    sx={{
                      position: "relative",
                      top: "15px",
                      left: "20px",
                      zIndex: 10,
                    }}
                    label={currentAsset.mediaType || "Art"}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Avatar src={tmpAvatar} />
                    <Typography>Owner</Typography>
                    <Typography>You</Typography>
                  </Box>
                  <Box>
                    <Typography>Listed</Typography>
                    <Typography>14 hours ago</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      ) : (
        <Skeleton variant="rectangular"></Skeleton>
      )}
    </Container>
  );
};

export default BorrowerAssetDetailsPage;
