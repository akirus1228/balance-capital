import { useWeb3Context } from "@fantohm/shared-web3";
import { Box, CircularProgress, Container, Grid } from "@mui/material";
import { useSelector } from "react-redux";
import { useGetListingsQuery } from "../../api/backend-api";
import { OpenseaAsset, useGetOpenseaAssetsQuery } from "../../api/opensea";
import BorrowerAssetFilter from "../../components/asset-filter/borrower-asset-filter/borrower-asset-filter";
import AssetList from "../../components/asset-list/asset-list";
import HeaderBlurryImage from "../../components/header-blurry-image/header-blurry-image";
import { RootState } from "../../store";
import { selectMyAssets } from "../../store/selectors/asset-selectors";
import style from "./borrow-page.module.scss";

export const BorrowPage = (): JSX.Element => {
  const { address } = useWeb3Context();
  const myAssets = useSelector((state: RootState) => selectMyAssets(state, address));
  const { authSignature } = useSelector((state: RootState) => state.backend);

  // load assets from opensea api
  const { data: assets, isLoading: assetsLoading } = useGetOpenseaAssetsQuery(
    { owner: address, limit: 50 },
    { skip: !address }
  );

  // using the opensea assets, crosscheck with backend api for correlated data
  const { isLoading: isAssetLoading } = useGetListingsQuery(
    {
      openseaIds: assets?.map((asset: OpenseaAsset) => asset.id.toString()),
      skip: 0,
      take: 50,
    },
    { skip: !assets || !authSignature }
  );

  return (
    <Container className={style["borrowPageContainer"]} maxWidth={`xl`}>
      <HeaderBlurryImage
        url={myAssets.length > 0 ? myAssets[0].imageUrl : undefined}
        height="300px"
      />
      <h1>Choose an asset to collateralize</h1>
      <Box sx={{ mt: "3em" }}>
        <Grid container maxWidth="xl" columnSpacing={5}>
          <Grid item xs={0} md={2}>
            <BorrowerAssetFilter />
          </Grid>
          <Grid item xs={12} md={10}>
            {(assetsLoading || isAssetLoading) && <CircularProgress />}
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
