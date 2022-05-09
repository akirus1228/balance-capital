import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadState } from "../helpers/localstorage";
import { SignerAsyncThunk, ListingAsyncThunk } from "../slices/interfaces";
import { BackendApi } from ".";
import {
  Asset,
  AssetStatus,
  Listing,
  LoginResponse,
  StandardAssetLookupParams,
} from "./backend-types";
import { updateAsset } from "../wallet/wallet-slice";

export enum BackendLoadingStatus {
  idle = "idle",
  loading = "loading",
  succeeded = "succeeded",
  failed = "failed",
}

export type AssetLoadStatus = {
  assetId: string;
  status: BackendLoadingStatus;
};

export type ListingLoadStatus = {
  assetId: string;
  status: BackendLoadingStatus;
};

export interface MarketplaceApiData {
  readonly accountStatus: "unknown" | "pending" | "ready" | "failed";
  readonly status: "idle" | "loading" | "succeeded" | "failed";
  readonly loadAssetStatus: AssetLoadStatus[];
  readonly loadListingStatus: ListingLoadStatus[];
  readonly loadListingsStatus: "idle" | "loading" | "succeeded" | "failed";
  readonly createListingStatus: "idle" | "loading" | "succeeded" | "failed";
  readonly authSignature: string | null;
  listings: Listing[];
}

const cacheTime = 300 * 1000; // 5 minutes

/* 
authorizeAccount: generates user account if non existant 
  requests signature to create bearer token
params: 
- networkId: number
- address: string
- provider: JsonRpcProvider
returns: void
*/
export const authorizeAccount = createAsyncThunk(
  "marketplaceApi/authorizeAccount",
  async (
    { address, networkId, provider }: SignerAsyncThunk,
    { dispatch, rejectWithValue, getState }
  ) => {
    const loginResponse: LoginResponse = await BackendApi.doLogin(address);
    if (loginResponse.id) {
      const signature = await BackendApi.handleSignMessage(address, provider);
      if (!signature) {
        rejectWithValue("Login Failed");
      }
      return signature;
    } else {
      rejectWithValue("Login Failed");
    }
  }
);

/* 
loadListings: loads all listings
params: 
- networkId: number
- address: string
- provider: JsonRpcProvider
returns: void
*/
export const loadListings = createAsyncThunk(
  "marketplaceApi/loadListings",
  async (
    { address, provider, networkId }: SignerAsyncThunk,
    { getState, rejectWithValue }
  ) => {
    //const signature = await handleSignMessage(address, provider);
    const thisState: any = getState();
    if (thisState.nftMarketplace.authSignature) {
      return await BackendApi.getListings(
        address,
        thisState.nftMarketplace.authSignature
      );
    } else {
      return rejectWithValue("No authorization found.");
    }
  }
);

/* 
createListing: loads all listings
params: 
- networkId: number
- address: string
- provider: JsonRpcProvider
returns: void
*/
export const createListing = createAsyncThunk(
  "marketplaceApi/createListing",
  async ({ asset, terms }: ListingAsyncThunk, { getState, rejectWithValue }) => {
    console.log("backend-slice: createListing");
    const thisState: any = getState();
    if (thisState.nftMarketplace.authSignature) {
      if (
        !BackendApi.createListing(thisState.nftMarketplace.authSignature, asset, terms)
      ) {
        return rejectWithValue("Failed to create listing");
      }
      return true;
    } else {
      console.warn("no auth");
      return rejectWithValue("No authorization found.");
    }
  }
);

/* 
loadAsset: loads individual listing
params: 
- asset: Asset
returns: boolean
*/
export const loadAsset = createAsyncThunk(
  "marketplaceApi/loadAsset",
  async (asset: Asset, { getState, rejectWithValue, dispatch }) => {
    console.log("loadAssest called");
    if (!asset.openseaId) {
      console.log("no id");
      return false;
    }
    if (asset.cacheExpire && asset.cacheExpire > Date.now()) {
      // recently loaded, use cache
      console.log("Using cache");
      return false;
    }
    const thisState: any = getState();
    if (thisState.nftMarketplace.authSignature) {
      console.log("sig found");
      const apiAsset = await BackendApi.getAssetFromOpenseaId(
        asset.openseaId,
        thisState.nftMarketplace.authSignature
      );
      console.log("apiAsset");
      console.log(apiAsset);
      if (typeof apiAsset === "undefined" || !apiAsset.id) {
        // nothing found by the API, merge in default state
        console.log("No asset found. New asset");
        dispatch(
          updateAsset({
            ...asset,
            status: AssetStatus.New,
            cacheExpire: Date.now() + cacheTime,
          })
        );
      } else {
        dispatch(updateAsset({ ...apiAsset, cacheExpire: Date.now() + cacheTime }));
      }

      return true;
    } else {
      return rejectWithValue("No authorization found.");
    }
  }
);

/* 
loadListing: loads individual listing
params: 
- asset: Asset
returns: Listing
*/
export const loadListing = createAsyncThunk(
  "marketplaceApi/loadListing",
  async (openseaId: string, { getState, rejectWithValue, dispatch }) => {
    console.log("loadListing called");
    if (!openseaId) {
      console.log("no id");
      return rejectWithValue("No openseaId");
    }
    const thisState: any = getState();
    if (thisState.nftMarketplace.authSignature) {
      console.log("sig found");
      const listing: Listing = await BackendApi.getListingFromOpenseaId(
        openseaId,
        thisState.nftMarketplace.authSignature
      );

      return listing;
    } else {
      return rejectWithValue("No authorization found.");
    }
  }
);

// initial wallet slice state
const previousState = loadState("nftMarketplace");
const initialState: MarketplaceApiData = {
  accountStatus: "unknown",
  authSignature: null,
  listings: [],
  ...previousState,
  status: "idle",
  loadAssetStatus: [],
  loadListingStatus: [],
  loadListingsStatus: "idle",
  createListingStatus: "idle",
};

// create slice and initialize reducers
const marketplaceApiSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(authorizeAccount.pending, (state, action) => {
      state.accountStatus = "pending";
    });
    builder.addCase(authorizeAccount.fulfilled, (state, action) => {
      if (action.payload) {
        state.accountStatus = "ready";
        state.authSignature = action.payload;
      }
    });
    builder.addCase(authorizeAccount.rejected, (state, action) => {
      state.accountStatus = "failed";
    });
    builder.addCase(loadListings.pending, (state, action) => {
      state.loadListingsStatus = "loading";
    });
    builder.addCase(
      loadListings.fulfilled,
      (state, action: PayloadAction<Listing[] | undefined>) => {
        state.loadListingsStatus = "succeeded";
        if (action.payload) {
          state.listings = [...state.listings, ...action.payload];
        }
      }
    );
    builder.addCase(loadListings.rejected, (state, action) => {
      state.loadListingsStatus = "failed";
    });
    builder.addCase(loadAsset.pending, (state, action) => {
      const currentAsset = action.meta.arg as Asset;
      state.loadAssetStatus.push({
        assetId: `${currentAsset.tokenId}:::${currentAsset.assetContractAddress}`,
        status: BackendLoadingStatus.loading,
      });
    });
    builder.addCase(loadAsset.fulfilled, (state, action) => {
      const currentAsset = action.meta.arg as Asset;
      const status = state.loadAssetStatus.find(
        (status: AssetLoadStatus) =>
          status.assetId ===
          `${currentAsset.tokenId}:::${currentAsset.assetContractAddress}`
      );
      if (status) {
        status.status = BackendLoadingStatus.succeeded;
      }
    });
    builder.addCase(loadAsset.rejected, (state, action) => {
      const currentAsset = action.meta.arg as Asset;
      const status = state.loadAssetStatus.find(
        (status: AssetLoadStatus) =>
          status.assetId ===
          `${currentAsset.tokenId}:::${currentAsset.assetContractAddress}`
      );
      if (status) {
        status.status = BackendLoadingStatus.failed;
      }
    });
    builder.addCase(createListing.pending, (state, action) => {
      state.createListingStatus = "loading";
    });
    builder.addCase(createListing.fulfilled, (state, action) => {
      state.createListingStatus = "succeeded";
    });
    builder.addCase(createListing.rejected, (state, action) => {
      state.createListingStatus = "failed";
    });
    builder.addCase(loadListing.pending, (state, action) => {
      state.loadListingStatus.push({
        assetId: action.meta.arg,
        status: BackendLoadingStatus.loading,
      });
    });
    builder.addCase(loadListing.fulfilled, (state, action: PayloadAction<Listing>) => {
      const status = state.loadAssetStatus.find(
        (status: ListingLoadStatus) => status.assetId === action.payload.asset.openseaId
      );
      if (status) {
        status.status = BackendLoadingStatus.succeeded;
      }

      let listing = state.listings.find(
        (listing: Listing) => listing.asset.openseaId === action.payload.asset.openseaId
      );
      if(listing){
        listing = { ...listing, ...action.payload };
      }else{
        state.listings.push(action.payload);
      }
    });
    builder.addCase(loadListing.rejected, (state, action) => {
      const status = state.loadAssetStatus.find(
        (status: ListingLoadStatus) => status.assetId === action.meta.arg
      );
      if (status) {
        status.status = BackendLoadingStatus.failed;
      }
    });
  },
});

export const marketplaceApiReducer = marketplaceApiSlice.reducer;
// actions are automagically generated and exported by the builder/thunk
//export const {} = walletSlice.actions;
