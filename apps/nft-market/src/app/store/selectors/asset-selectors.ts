import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { Asset, Listing, ListingStatus } from "../../types/backend-types";

const selectAssets = (state: RootState) => state.assets.assets;

const selectAssetId = (state: RootState, id: string) => id;
export const selectAssetById = createSelector(
  selectAssets,
  selectAssetId,
  (assets, assetId) => assets.filter((asset: Asset) => asset.id === assetId)
);
