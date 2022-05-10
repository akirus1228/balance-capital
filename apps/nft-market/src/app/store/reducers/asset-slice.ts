import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Collectible,
  FetchNFTClient,
  FetchNFTClientProps,
} from "@fantohm/shared/fetch-nft";
import { IBaseAddressAsyncThunk, isDev, loadState } from "@fantohm/shared-web3";
import { Asset } from "../../types/backend-types";
import { loadAssetsFromOpenseaIds } from "./backend-slice";

const OPENSEA_API_KEY = "6f2462b6e7174e9bbe807169db342ec4";

const openSeaConfig = (): FetchNFTClientProps => {
  console.log("isDev: " + isDev());
  const openSeaConfig: any = {
    apiKey: isDev() ? "5bec8ae0372044cab1bef0d866c98618" : OPENSEA_API_KEY,
  };
  if (isDev()) {
    openSeaConfig.apiEndpoint = "https://testnets-api.opensea.io/api/v1";
  }
  console.log(openSeaConfig);
  return { openSeaConfig };
};

export interface AssetState {
  readonly assetStatus: "idle" | "loading" | "succeeded" | "failed";
  readonly assets: Asset[];
  readonly isDev: boolean;
  readonly nextOpenseaLoad: number;
  fetchNftClient: FetchNFTClient;
}

const cacheTime = 300 * 1000; // 5 minutes

/* 
loadWalletNfts: loads nfts owned by specific address
params: 
- address: string
returns: void
*/
export const loadAssetsFromAddress = createAsyncThunk(
  "wallet/loadAssetsFromAddress",
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
        console.log("Opensea returning no items");
        return [] as Asset[];
      }

      // convertCollectible to Asset
      const walletContents = openseaData[address].map(
        (collectible: Collectible): Asset => {
          const { id, ...tmpCollectible } = collectible;
          const asset = {
            ...tmpCollectible,
            openseaLoaded: Date.now() + cacheTime,
          } as Asset;
          return asset;
        }
      );

      const openseaIds = walletContents.map((asset: Asset) => asset.openseaId || "");
      // see if we have this data on the backend
      console.log("load data from backend");
      dispatch(loadAssetsFromOpenseaIds(openseaIds));

      return walletContents as Asset[];
    } catch (err) {
      console.log(err);
      rejectWithValue("Unable to load assets.");
      return [] as Asset[];
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
    builder.addCase(loadAssetsFromAddress.pending, (state, action) => {
      state.assetStatus = "loading";
    });
    builder.addCase(
      loadAssetsFromAddress.fulfilled,
      (state, action: PayloadAction<Asset[]>) => {
        state.assetStatus = "succeeded";
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
    builder.addCase(loadAssetsFromAddress.rejected, (state, action) => {
      state.assetStatus = "failed";
    });
  },
});

export const assetsReducer = assetsSlice.reducer;
// actions are automagically generated and exported by the builder/thunk
export const { updateAsset, updateAssets } = assetsSlice.actions;
