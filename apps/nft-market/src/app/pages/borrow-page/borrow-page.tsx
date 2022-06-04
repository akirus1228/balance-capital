import { useWeb3Context } from "@fantohm/shared-web3";
import { Box, CircularProgress, Container, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetListingsQuery } from "../../api/backend-api";
import { OpenseaAsset, useGetOpenseaAssetsQuery } from "../../api/opensea";
import BorrowerAssetFilter from "../../components/asset-filter/borrower-asset-filter/borrower-asset-filter";
import AssetList from "../../components/asset-list/asset-list";
import HeaderBlurryImage from "../../components/header-blurry-image/header-blurry-image";
import { RootState } from "../../store";
import { OpenseaAssetQueryParam } from "../../store/reducers/interfaces";
import { selectMyAssets } from "../../store/selectors/asset-selectors";
import { BackendAssetQueryParams } from "../../types/backend-types";
import style from "./borrow-page.module.scss";

export const BorrowPage = (): JSX.Element => {
  const { address } = useWeb3Context();
  const [displayAssets, setDisplayAssets] = useState<Asset[]>();
  const [osQuery, setOsQuery] = useState<OpenseaAssetQueryParam>({
    limit: 50,
  });
  const [beQuery, setBeQuery] = useState<BackendAssetQueryParams>({
    skip: 0,
    take: 50,
  });
  const myAssets = useSelector((state: RootState) => selectMyAssets(state, address));
  const { authSignature } = useSelector((state: RootState) => state.backend);

  // load assets from opensea api
  const { data: assets, isLoading: assetsLoading } = useGetOpenseaAssetsQuery(osQuery, {
    skip: !address,
  });

  // using the opensea assets, crosscheck with backend api for correlated data
  const { isLoading: isAssetLoading } = useGetListingsQuery(beQuery, {
    skip: !assets || !authSignature,
  });

  useEffect(() => {
    const newQuery = {
      ...beQuery,
      openseaIds: assets?.map((asset: OpenseaAsset) => asset.id.toString()),
    };
    setBeQuery(newQuery);
  }, [assets]);

  useEffect(() => {
    const updatedQuery = {
      ...osQuery,
      owner: address,
    };
    setOsQuery(updatedQuery);
  }, [address]);

  return (
    <Container className={style["borrowPageContainer"]} maxWidth={`xl`}>
      <HeaderBlurryImage
        url={myAssets.length > 0 ? myAssets[0].imageUrl : undefined}
        height="300px"
      />
      <Box className="flex fr fj-sb ai-c">
        <h1>Choose an asset to collateralize</h1>
        <span>{myAssets.length} assets available</span>
      </Box>
      <Box sx={{ mt: "3em" }}>
        <Grid container maxWidth="xl" columnSpacing={5}>
          <Grid item xs={0} md={3}>
            <BorrowerAssetFilter query={beQuery} setQuery={setBeQuery} />
          </Grid>
          <Grid item xs={12} md={9}>
            {(assetsLoading || isAssetLoading) && (
              <Box className="flex fr fj-c">
                <CircularProgress />
              </Box>
            )}
            {(!address || !authSignature) && (
              <Box className="flex fr fj-c">
                <h1>Please connect your wallet.</h1>
              </Box>
            )}
            <AssetList assets={myAssets} type="borrow" />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default BorrowPage;
