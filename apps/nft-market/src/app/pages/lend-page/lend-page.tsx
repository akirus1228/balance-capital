import { useWeb3Context } from "@fantohm/shared-web3";
import { Container } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AssetList from "../../components/asset-list/asset-list";
import { RootState } from "../../store";
import { loadListings } from "../../store/reducers/listing-slice";
import style from "./lend-page.module.scss";

export const LendPage = (): JSX.Element => {
  const dispatch = useDispatch();
  const { chainId, address } = useWeb3Context();
  const assetState = useSelector((state: RootState) => state.assets);
  const listings = useSelector((state: RootState) => state.listings.listings);

  // Load assets and nfts in current wallet
  useEffect(() => {
    if (assetState.assetStatus !== "loading" && assetState.nextOpenseaLoad < Date.now()) {
      dispatch(loadListings({ queryParams: { skip: 0, take: 50 } }));
    }
  }, [chainId, address, assetState.assetStatus]);

  return (
    <Container className={style["borrowPageContainer"]} maxWidth={`xl`}>
      <h1>Explore loan requests</h1>
      <AssetList sx={{ mt: "2em" }} assets={assetState.assets} />
    </Container>
  );
};

export default LendPage;
