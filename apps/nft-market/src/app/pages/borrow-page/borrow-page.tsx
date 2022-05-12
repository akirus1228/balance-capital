import { defaultNetworkId, useWeb3Context } from "@fantohm/shared-web3";
import { Box, Container, Grid } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import BorrowerAssetFilter from "../../components/asset-filter/borrower-asset-filter/borrower-asset-filter";
import AssetList from "../../components/asset-list/asset-list";
import { RootState } from "../../store";
import { loadAssetsFromOpensea } from "../../store/reducers/asset-slice";
import { Asset } from "../../types/backend-types";
import style from "./borrow-page.module.scss";

export const BorrowPage = (): JSX.Element => {
  const dispatch = useDispatch();
  const { chainId, address } = useWeb3Context();
  const assetState = useSelector((state: RootState) => state.assets);
  const myAssets = useSelector((state: RootState) =>
    state.assets.assets.filter(
      (asset: Asset) => asset.owner?.address.toLowerCase() === address.toLowerCase()
    )
  );

  // Load assets and nfts in current wallet
  useEffect(() => {
    if (
      address &&
      chainId &&
      assetState.assetStatus !== "loading" &&
      assetState.nextOpenseaLoad < Date.now()
    ) {
      dispatch(
        loadAssetsFromOpensea({ networkId: chainId || defaultNetworkId, address })
      );
    }
  }, [chainId, address, assetState.assetStatus]);

  return (
    <Container className={style["borrowPageContainer"]} maxWidth={`xl`}>
      <h1>Choose an asset to collateralize</h1>
      <Box sx={{ mt: "2em" }}>
        <Grid container maxWidth="xl" columnSpacing={5}>
          <Grid item xs={0} md={2}>
            <BorrowerAssetFilter />
          </Grid>
          <Grid item xs={12} md={10}>
            <AssetList assets={myAssets} type="borrow" />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default BorrowPage;
