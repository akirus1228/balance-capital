import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Collectible,
  FetchNFTClient,
  FetchNFTClientProps,
} from "@fantohm/shared/fetch-nft";
import { IBaseAddressAsyncThunk, isDev, loadState } from "@fantohm/shared-web3";
import { Asset, AssetStatus, BackendLoadingStatus } from "../../types/backend-types";
import { BackendApi } from "../../api";
import { BackendAssetQueryAsyncThunk } from "./interfaces";

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

export type AssetLoadStatus = {
  [assetId: string]: BackendLoadingStatus;
};

export interface AssetState {
  readonly assetStatus: "idle" | "loading" | "partial" | "succeeded" | "failed";
  readonly assets: Asset[];
  readonly isDev: boolean;
  readonly nextOpenseaLoad: number;
  readonly fetchNftClient: FetchNFTClient;
  readonly assetLoadStatus: AssetLoadStatus;
}

const cacheTime = 300 * 1000; // 5 minutes

/* 
loadWalletNfts: loads nfts owned by specific address
params: 
- address: string
returns: void
*/
export const loadAssetsFromOpensea = createAsyncThunk(
  "assets/loadAssetsFromOpensea",
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
        return [] as Asset[];
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

      return walletContents as Asset[];
    } catch (err) {
      console.log(err);
      rejectWithValue("Unable to load assets.");
      return [] as Asset[];
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
    { getState, rejectWithValue, dispatch }
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
};

// create slice and initialize reducers
const assetsSlice = createSlice({
  name: "assets",
  initialState,
  reducers: {
    updateAsset: (state, action: PayloadAction<Asset>) => {
      state.assets = state.assets.map((asset: Asset) => {
        if (
          asset.assetContractAddress === action.payload.assetContractAddress &&
          asset.tokenId === action.payload.tokenId
        ) {
          return { ...asset, ...action.payload };
        }
        return asset;
      });
    },
    updateAssets: (state, action: PayloadAction<Asset[]>) => {
      action.payload.forEach((updatedAsset: Asset) => {
        state.assets = state.assets.map((asset: Asset) => {
          if (
            asset.assetContractAddress === updatedAsset.assetContractAddress &&
            asset.tokenId === updatedAsset.tokenId
          ) {
            return { ...asset, ...updatedAsset };
          }
          return asset;
        });
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadAssetsFromOpensea.pending, (state, action) => {
      state.assetStatus = "loading";
    });
    builder.addCase(
      loadAssetsFromOpensea.fulfilled,
      (state, action: PayloadAction<Asset[]>) => {
        state.assetStatus = "partial";
        state.nextOpenseaLoad = Date.now() + cacheTime;
        action.payload.map((newAsset: Asset) => {
          let dupAsset = state.assets.find(
            (stateAsset: Asset) =>
              stateAsset.tokenId === newAsset.tokenId &&
              stateAsset.assetContractAddress === newAsset.assetContractAddress
          );
          // if exists, update
          if (dupAsset) {
            dupAsset = { ...dupAsset, ...newAsset };
          } else {
            // if new, push
            state.assets.push(newAsset);
          }
        });
      }
    );
    builder.addCase(loadAssetsFromOpensea.rejected, (state, action) => {
      state.assetStatus = "failed";
    });
    builder.addCase(loadAssetsFromBackend.pending, (state, action) => {
      state.assetStatus = "loading";
    });
    builder.addCase(loadAssetsFromBackend.fulfilled, (state, action) => {
      state.assetStatus = "succeeded";
      if (!action.payload) {
        return;
      }
      action.payload.forEach((updatedAsset: Asset) => {
        state.assets = state.assets.map((asset: Asset) => {
          if (
            asset.assetContractAddress === updatedAsset.assetContractAddress &&
            asset.tokenId === updatedAsset.tokenId
          ) {
            return { ...asset, ...updatedAsset };
          }
          return asset;
        });
      });
    });
    builder.addCase(loadAssetsFromBackend.rejected, (state, action) => {
      state.assetStatus = "failed";
    });
  },
});

export const assetsReducer = assetsSlice.reducer;
// actions are automagically generated and exported by the builder/thunk
export const { updateAsset, updateAssets } = assetsSlice.actions;
