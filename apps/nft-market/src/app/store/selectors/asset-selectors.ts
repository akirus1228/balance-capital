import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { Asset, StandardAssetLookupParams } from "../../types/backend-types";

const selectAssets = (state: RootState) => state.assets.assets;

const selectAssetId = (state: RootState, id: string) => id;
export const selectAssetById = createSelector(
  selectAssets,
  selectAssetId,
  (assets, backendAssetId) => {
    const match: [string, Asset] | undefined = Object.entries(assets).find(
      ([assetId, asset]) => asset.id === backendAssetId
    );
    if (match) {
      return match[1];
    } else {
      return {} as Asset;
    }
  }
  //(assets, assetId) => assets.filter((asset: Asset) => asset.id === assetId)
);

const selectAssetAddress = (state: RootState, addressParams: StandardAssetLookupParams) =>
  addressParams;
export const selectAssetByAddress = createSelector(
  selectAssets,
  selectAssetAddress,
  (assets, addressParams) =>
    assets[`${addressParams.tokenId}:::${addressParams.contractAddress}`]
);

const selectAssetMine = (state: RootState, address: string) => address;
export const selectMyAssets = createSelector(
  selectAssets,
  selectAssetMine,
  (assets, address) => {
    const matches: [string, Asset][] = Object.entries(assets).filter(
      ([assetId, asset]) => asset.owner?.address.toLowerCase() === address.toLowerCase()
    );
    return matches.map((assetMap: [string, Asset]) => assetMap[1]);
  }
  //(assets, assetId) => assets.filter((asset: Asset) => asset.id === assetId)
);
