import { useWeb3Context } from "@fantohm/shared-web3";
import { Container } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  const dispatch = useDispatch();
  const [assets, setAssets] = useState([] as Asset[]);
  const { chainId, address } = useWeb3Context();
  const listingState = getListingState(store.getState());
  const listings: Listing[] = selectListingByStatus(listingState, ListingStatus.Listed);

  // Load assets and nfts in current wallet
  useEffect(() => {
    if (listingState.listingsLoadStatus !== BackendLoadingStatus.loading) {
      dispatch(loadListings({ queryParams: { skip: 0, take: 50 } }));
    }
  }, [chainId, address]);

  useEffect(() => {
    setAssets(listings.map((listing: Listing) => listing.asset));
  }, [JSON.stringify(listings)]);

  return (
    <Container className={style["borrowPageContainer"]} maxWidth={`xl`}>
      <h1>Explore loan requests</h1>
      <AssetList sx={{ mt: "2em" }} assets={assets} />
    </Container>
  );
};

export default LendPage;
