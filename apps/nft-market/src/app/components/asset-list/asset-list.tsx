import { Box, Button, Grid, SxProps, Theme, Typography } from "@mui/material";
// import style from "./asset-list.module.scss";
import BorrowerAsset from "./borrower-asset/borrower-asset";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import AssetFilter from "../asset-filter/asset-filter";
import AssetCategoryFilter from "../asset-category-filter/asset-category-filter";
import { Asset } from "../../types/backend-types";

export interface AssetListProps {
  assets: Asset[];
  address?: string;
  sx?: SxProps<Theme>;
}

export const AssetList = (props: AssetListProps): JSX.Element => {
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
            {props.assets &&
              props.assets.map((asset: Asset, index: number) => (
                <BorrowerAsset
                  key={`asset-${index}`}
                  contractAddress={asset.assetContractAddress}
                  tokenId={asset.tokenId}
                />
              ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AssetList;
