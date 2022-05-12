import { useWeb3Context } from "@fantohm/shared-web3";
import { Box, Container, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LenderAssetFilter from "../../components/asset-filter/lender-asset-filter/lender-asset-filter";
import AssetList from "../../components/asset-list/asset-list";
import store, { RootState } from "../../store";
import {
  getListingState,
  Listings,
  loadListings,
} from "../../store/reducers/listing-slice";
import { selectListingByStatus } from "../../store/selectors/listing-selectors";
import {
  Asset,
  BackendLoadingStatus,
  Listing,
  ListingStatus,
} from "../../types/backend-types";
import style from "./lend-page.module.scss";

export const LendPage = (): JSX.Element => {
  console.log("render LendPage");
  const dispatch = useDispatch();
  const [assets, setAssets] = useState<Asset[]>([]);
  const { chainId, address } = useWeb3Context();
  const listingState = useSelector((state: RootState) => state.listings);
  const listings: Listing[] = useSelector((state: RootState) =>
    selectListingByStatus(state, ListingStatus.Listed)
  );
  const { authSignature } = useSelector((state: RootState) => state.backend);

  // Load assets and nfts in current wallet
  useEffect(() => {
    console.log("Load listings");
    if (listingState.listingsLoadStatus !== BackendLoadingStatus.loading) {
      dispatch(loadListings({ queryParams: { skip: 0, take: 50 } }));
    }
  }, [chainId, address, authSignature]);

  useEffect(() => {
    console.log("Set Assets");
    console.log(listings);
    setAssets(listings.map((listing: Listing) => listing.asset));
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
            <AssetList assets={assets} type="lend" />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default LendPage;
