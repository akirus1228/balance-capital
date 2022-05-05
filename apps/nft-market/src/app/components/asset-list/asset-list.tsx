import { Box, Button, Grid, Icon, SxProps, Theme, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import style from "./asset-list.module.scss";
import BorrowerAsset from "./borrower-asset/borrower-asset";
import {
  Asset,
  defaultNetworkId,
  loadWalletAssets,
  useWeb3Context,
} from "@fantohm/shared-web3";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import { useEffect } from "react";
import AssetFilter from "../asset-filter/asset-filter";
import AssetCategoryFilter from "../asset-category-filter/asset-category-filter";

export interface AssetListProps {
  address?: string;
  sx?: SxProps<Theme>;
}

export const AssetList = (props: AssetListProps): JSX.Element => {
  const dispatch = useDispatch();
  const wallet = useSelector((state: RootState) => state.wallet);
  const backend = useSelector((state: RootState) => state.nftMarketplace);
  const { address, chainId } = useWeb3Context();

  // Load assets and nfts in current wallet
  useEffect(() => {
    if (address && ["failed", "idle"].includes(wallet.assetStatus)) {
      dispatch(loadWalletAssets({ networkId: chainId || defaultNetworkId, address }));
    }
  }, [chainId, address, wallet.assetStatus]);

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
            {wallet.assets &&
              wallet.assets.map((asset: Asset, index: number) => (
                <BorrowerAsset key={`asset-${index}`} asset={asset} />
              ))}
            {wallet.assetStatus === "succeeded" &&
              (!wallet.assets || wallet.assets.length < 1) && (
                <h1>No assets available for listing.</h1>
              )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AssetList;
