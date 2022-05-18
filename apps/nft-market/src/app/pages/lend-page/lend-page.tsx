import { Box, CircularProgress, Container, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useGetListingsQuery } from "../../api/backend-api";
import LenderAssetFilter from "../../components/asset-filter/lender-asset-filter/lender-asset-filter";
import AssetList from "../../components/asset-list/asset-list";
import { Asset, Listing } from "../../types/backend-types";
import style from "./lend-page.module.scss";

export const LendPage = (): JSX.Element => {
  console.log("render LendPage");
  const [assets, setAssets] = useState<Asset[]>([]);
  const { data: listings, error, isLoading } = useGetListingsQuery({ skip: 0, take: 50 });

  useEffect(() => {
    console.log("Set Assets");
    console.log(listings);
    if (!listings) {
      return;
    }
    console.log(listings);
    setAssets(
      listings.map((listing: Listing): Asset => {
        console.log(listing.asset);
        return listing.asset;
      })
    );
  }, [listings]);

  return (
    <Container className={style["borrowPageContainer"]} maxWidth={`xl`}>
      <h1>Explore loan requests</h1>
      <Box sx={{ mt: "2em" }}>
        <Grid container maxWidth="xl" columnSpacing={5}>
          <Grid item xs={0} md={2}>
            <LenderAssetFilter />
          </Grid>
          <Grid item xs={12} md={10}>
            {isLoading && <CircularProgress />}
            <AssetList assets={assets} type="lend" />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default LendPage;
