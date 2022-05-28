import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  FetchNFTClient,
  FetchNFTClientProps,
  isAssetValid,
} from "@fantohm/shared/fetch-nft";
import { isDev, loadState } from "@fantohm/shared-web3";
import { Asset, BackendLoadingStatus } from "../../types/backend-types";
import { OpenseaAsset } from "../../api/opensea";
import { openseaAssetToAsset } from "../../helpers/data-translations";

const OPENSEA_API_KEY = "6f2462b6e7174e9bbe807169db342ec4";

const openSeaConfig = (): FetchNFTClientProps => {
  const openSeaConfig: any = {
    apiKey: isDev() ? "5bec8ae0372044cab1bef0d866c98618" : OPENSEA_API_KEY,
  };
  if (isDev()) {
    openSeaConfig.apiEndpoint = "https://testnets-api.opensea.io/api/v1";
  }

  return { openSeaConfig };
};

export const assetToAssetId = (asset: Asset) =>
  `${asset.tokenId}:::${asset.assetContractAddress}`;

export type AssetLoadStatus = {
  [assetId: string]: BackendLoadingStatus;
};

export type OpenseaCache = {
  [paramHash: string]: number;
};

export type Assets = {
  [assetId: string]: Asset;
};

export interface AssetState {
  readonly assetStatus: "idle" | "loading" | "partial" | "succeeded" | "failed";
  readonly assets: Assets;
  readonly isDev: boolean;
  readonly nextOpenseaLoad: number;
  readonly fetchNftClient: FetchNFTClient;
  readonly assetLoadStatus: AssetLoadStatus;
  readonly openseaCache: OpenseaCache;
}

export const updateAssetsFromOpensea = createAsyncThunk(
  "asset/updateAssetsFromOpensea",
  async (openseaAssets: OpenseaAsset[], { dispatch }) => {
    const newAssetAry = await openseaAssetToAsset(
      openseaAssets.filter((asset: OpenseaAsset) => isAssetValid(asset))
    );
    const newAssets: Assets = {};
    newAssetAry.forEach((asset: Asset) => {
      newAssets[assetToAssetId(asset)] = asset;
    });
    dispatch(updateAssets(newAssets));
  }
);

// initial wallet slice state
const previousState = loadState("asset");
const initialState: AssetState = {
  assets: [],
  isDev: !process.env["NODE_ENV"] || process.env["NODE_ENV"] === "development",
  ...previousState, // overwrite assets and currencies from cache if recent
  assetStatus: "idle",
  nextOpenseaLoad: 0,
  fetchNftClient: new FetchNFTClient(openSeaConfig()),
  assetLoadStatus: [],
  openseaCache: [],
};

// create slice and initialize reducers
const assetsSlice = createSlice({
  name: "assets",
  initialState,
  reducers: {
    updateAsset: (state, action: PayloadAction<Asset>) => {
      state.assets = {
        ...state.assets,
        ...{ [assetToAssetId(action.payload)]: action.payload },
      };
    },
    updateAssets: (state, action: PayloadAction<Assets>) => {
      const mergedAssets: Assets = {};
      Object.entries(action.payload).forEach(([assetId, asset]) => {
        mergedAssets[assetId] = {
          ...state.assets[assetId],
          ...asset,
        };
      });
      state.assets = { ...state.assets, ...mergedAssets };
    },
  },
});

export const assetsReducer = assetsSlice.reducer;
// actions are automagically generated and exported by the builder/thunk
export const { updateAsset, updateAssets } = assetsSlice.actions;
