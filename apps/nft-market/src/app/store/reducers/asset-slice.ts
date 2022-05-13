import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  assetToCollectible,
  Collectible,
  FetchNFTClient,
  FetchNFTClientProps,
  isAssetValid,
} from "@fantohm/shared/fetch-nft";
import { IBaseAddressAsyncThunk, isDev, loadState } from "@fantohm/shared-web3";
import { Asset, AssetStatus, BackendLoadingStatus } from "../../types/backend-types";
import { BackendApi } from "../../api";
import { BackendAssetQueryAsyncThunk, OpenseaAssetQueryAsyncThunk } from "./interfaces";
import getOpenseaAssets, { OpenseaAsset } from "../../api/opensea";
import { ethers } from "ethers";
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

const cacheTime = 300 * 1000; // 5 minutes

/* 
loadWalletNfts: loads nfts owned by specific address
params: 
- address: string
returns: void
*/
export const loadMyAssetsFromOpensea = createAsyncThunk(
  "assets/loadMyAssetsFromOpensea",
  async (
    { address }: IBaseAddressAsyncThunk,
    { rejectWithValue, getState, dispatch }
  ) => {
    if (!address) {
      return rejectWithValue("No wallet address");
    }
    try {
      // see if opensea has any assets listed for this address
      const thisState: any = getState();
      const client: FetchNFTClient = thisState.assets.fetchNftClient as FetchNFTClient;
      const openseaData = await client.getEthereumCollectibles([address]);
      if (!openseaData || typeof openseaData[address] === "undefined") {
        return {} as Assets;
      }

      // convertCollectible to Asset
      const walletContents = openseaData[address].map(
        (collectible: Collectible): Asset => {
          const { id, ...tmpCollectible } = collectible;
          const asset = {
            ...tmpCollectible,
            openseaLoaded: Date.now() + cacheTime,
            status: AssetStatus.New,
          } as Asset;
          return asset;
        }
      );

      const openseaIds = walletContents.map((asset: Asset) => asset.openseaId || "");
      // see if we have this data on the backend

      dispatch(loadAssetsFromBackend({ queryParams: { openseaIds, skip: 0, take: 50 } }));
      const newAssets: Assets = {};
      walletContents.forEach((asset: Asset) => {
        newAssets[assetToAssetId(asset)] = asset;
      });
      return newAssets;
    } catch (err) {
      console.log(err);
      rejectWithValue("Unable to load assets.");
      return {} as Assets;
    }
  }
);

/* 
loadWalletNfts: loads nfts owned by specific address
params: 
- address: string
returns: void
*/
export const loadAssetsFromOpensea = createAsyncThunk(
  "assets/loadAssetsFromOpensea",
  async (
    { queryParams = { limit: 50 } }: OpenseaAssetQueryAsyncThunk,
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      // see if opensea has any assets listed for this address
      const openseaData = await getOpenseaAssets(queryParams);
      const walletContents = await openseaAssetToAsset(openseaData);

      const openseaIds = walletContents.map((asset: Asset) => asset.openseaId || "");
      // see if we have this data on the backend

      dispatch(loadAssetsFromBackend({ queryParams: { openseaIds, skip: 0, take: 50 } }));
      const newAssets: Assets = {};
      walletContents.forEach((asset: Asset) => {
        newAssets[assetToAssetId(asset)] = asset;
      });
      return newAssets;
    } catch (err) {
      console.log(err);
      rejectWithValue("Unable to load assets.");
      return {} as Assets;
    }
  }
);

/* 
loadAssetsFromBackend: loads multiple assets from API and merges into assets
params: 
- openseaIds: string[]
returns: boolean
*/
export const loadAssetsFromBackend = createAsyncThunk(
  "asset/loadAssetsFromBackend",
  async (
    { queryParams = { skip: 0, take: 50 } }: BackendAssetQueryAsyncThunk,
    { getState, rejectWithValue }
  ) => {
    console.log("loadAssetsFromOpenseaIds called");
    const thisState: any = getState();
    if (thisState.backend.authSignature) {
      console.log("sig found");
      const apiAssets = await BackendApi.getAssets(
        queryParams,
        thisState.backend.authSignature
      );

      return apiAssets.map((asset: Asset) => ({
        ...asset,
        cacheExpire: Date.now() + cacheTime,
      }));
    } else {
      return rejectWithValue("No authorization found.");
    }
  }
);

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
  extraReducers: (builder) => {
    builder.addCase(loadAssetsFromOpensea.rejected, (state, action) => {
      state.assetStatus = "failed";
    });
    builder.addCase(loadAssetsFromOpensea.pending, (state, action) => {
      state.assetStatus = "loading";

      // add a hash with the expiration
      const cacheHash = ethers.utils.sha256(JSON.stringify(action.meta.arg));
      state.openseaCache = {
        ...state.openseaCache,
        ...{ [cacheHash]: Date.now() },
      };
    });
    builder.addCase(
      loadAssetsFromOpensea.fulfilled,
      (state, action: PayloadAction<Assets>) => {
        state.assetStatus = "partial";
        state.assets = { ...state.assets, ...action.payload };
      }
    );
    builder.addCase(loadMyAssetsFromOpensea.rejected, (state, action) => {
      state.assetStatus = "failed";
    });
    builder.addCase(loadMyAssetsFromOpensea.pending, (state, action) => {
      state.assetStatus = "loading";
    });
    builder.addCase(
      loadMyAssetsFromOpensea.fulfilled,
      (state, action: PayloadAction<Assets>) => {
        state.assetStatus = "succeeded";
        state.nextOpenseaLoad = Date.now() + cacheTime;
        state.assets = { ...state.assets, ...action.payload };
      }
    );
    builder.addCase(loadAssetsFromBackend.rejected, (state, action) => {
      state.assetStatus = "failed";
    });
  },
});

export const assetsReducer = assetsSlice.reducer;
// actions are automagically generated and exported by the builder/thunk
export const { updateAsset, updateAssets } = assetsSlice.actions;
