import { useWeb3Context } from "@fantohm/shared-web3";
import { Box, Container, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useGetListingsQuery } from "../../api/backend-api";
import { OpenseaAsset, useGetOpenseaAssetsQuery } from "../../api/opensea";
import BorrowerAssetFilter from "../../components/asset-filter/borrower-asset-filter/borrower-asset-filter";
import AssetList from "../../components/asset-list/asset-list";
import { RootState } from "../../store";
import { selectMyAssets } from "../../store/selectors/asset-selectors";
import style from "./borrow-page.module.scss";

export const BorrowPage = (): JSX.Element => {
  const dispatch = useDispatch();
  const { address } = useWeb3Context();
  const myAssets = useSelector((state: RootState) => selectMyAssets(state, address));
  const { data: assets, isLoading: assetsLoading } = useGetOpenseaAssetsQuery(
    { owner: address, limit: 50 },
    { skip: !address }
  );
  const { data, isLoading } = useGetListingsQuery(
    {
      openseaIds: assets?.map((asset: OpenseaAsset) => asset.id.toString()),
      skip: 0,
      take: 50,
    },
    { skip: !assets }
  );

  return (
    <Container className={style["borrowPageContainer"]} maxWidth={`xl`}>
      <h1>Choose an asset to collateralize</h1>
      <Box sx={{ mt: "2em" }}>
        <Grid container maxWidth="xl" columnSpacing={5}>
          <Grid item xs={0} md={2}>
            <BorrowerAssetFilter />
          </Grid>
          <Grid item xs={12} md={10}>
            {assetsLoading && <h3>Loading...</h3>}
            <AssetList assets={myAssets} type="borrow" />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default BorrowPage;
