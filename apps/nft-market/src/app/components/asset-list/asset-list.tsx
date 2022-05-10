import { Box, Button, Grid, SxProps, Theme, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import style from "./asset-list.module.scss";
import BorrowerAsset from "./borrower-asset/borrower-asset";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import AssetFilter from "../asset-filter/asset-filter";
import AssetCategoryFilter from "../asset-category-filter/asset-category-filter";
import { Asset } from "../../types/backend-types";
import { defaultNetworkId, useWeb3Context } from "@fantohm/shared-web3";
import { useEffect } from "react";
import { loadAssetsFromAddress } from "../../store/reducers/asset-slice";

export interface AssetListProps {
  address?: string;
  sx?: SxProps<Theme>;
}

export const AssetList = (props: AssetListProps): JSX.Element => {
  const assets = useSelector((state: RootState) => state.assets);
  const dispatch = useDispatch();
  const { chainId, address } = useWeb3Context();

  // Load assets and nfts in current wallet
  useEffect(() => {
    if (
      address &&
      chainId &&
      assets.assetStatus !== "loading" &&
      assets.nextOpenseaLoad < Date.now()
    ) {
      dispatch(
        loadAssetsFromAddress({ networkId: chainId || defaultNetworkId, address })
      );
    }
  }, [chainId, address, assets.assetStatus]);

  return (
    <Box sx={props.sx}>
      <Grid container maxWidth="xl" columnSpacing={5}>
        <Grid item xs={0} md={2}>
          <AssetFilter />
        </Grid>
        <Grid item xs={12} md={10}>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <AssetCategoryFilter />
            <Button>
              <GridViewOutlinedIcon />
              <Typography>Grid View</Typography>
            </Button>
            <Button>
              <FormatListBulletedOutlinedIcon />
              <Typography>List view</Typography>
            </Button>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
            {assets.assets &&
              assets.assets.map((asset: Asset, index: number) => (
                <BorrowerAsset
                  key={`asset-${index}`}
                  contractAddress={asset.assetContractAddress}
                  tokenId={asset.tokenId}
                />
              ))}
            {assets.assetStatus === "succeeded" &&
              (!assets.assets || assets.assets.length < 1) && (
                <h1>No assets available for listing.</h1>
              )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AssetList;
