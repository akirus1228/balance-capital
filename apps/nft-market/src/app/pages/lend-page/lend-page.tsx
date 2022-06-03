import { Box, CircularProgress, Container, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetListingsQuery } from "../../api/backend-api";
import LenderAssetFilter from "../../components/asset-filter/lender-asset-filter/lender-asset-filter";
import AssetList from "../../components/asset-list/asset-list";
import HeaderBlurryImage from "../../components/header-blurry-image/header-blurry-image";
import { RootState } from "../../store";
import { ListingQueryParam } from "../../store/reducers/interfaces";
import { Asset, Listing, ListingStatus } from "../../types/backend-types";
import style from "./lend-page.module.scss";

export const LendPage = (): JSX.Element => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [query, setQuery] = useState<ListingQueryParam>({
    skip: 0,
    take: 50,
    status: ListingStatus.Listed,
  });
  const { authSignature } = useSelector((state: RootState) => state.backend);
  const { data: listings, isLoading } = useGetListingsQuery(query);

  useEffect(() => {
    if (!listings) {
      return;
    }
    setAssets(
      listings.map((listing: Listing): Asset => {
        return listing.asset;
      })
    );
  }, [listings]);

  return (
    <Container className={style["lendPageContainer"]} maxWidth={`xl`}>
      <HeaderBlurryImage
        url={listings && listings.length > 0 ? listings[0].asset.imageUrl : undefined}
        height="300px"
      />
      <h1>Explore loan requests</h1>
      <Box sx={{ mt: "3em" }}>
        <Grid container maxWidth="xl" columnSpacing={5}>
          <Grid item xs={0} md={2}>
            <LenderAssetFilter query={query} setQuery={setQuery} />
          </Grid>
          <Grid item xs={12} md={10}>
            {isLoading && (
              <Box className="flex fr fj-c">
                <CircularProgress />
              </Box>
            )}
            <AssetList assets={assets} type="lend" />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default LendPage;
