import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Asset,
  AssetStatus,
  Listing,
  LoginResponse,
  Notification,
} from "../../types/backend-types";
import { loadState } from "@fantohm/shared-web3";
import { BackendApi } from "../../api";
import { ListingAsyncThunk, SignerAsyncThunk } from "./interfaces";
import { updateAsset, updateAssets } from "./asset-slice";

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

export interface BackendData {
  readonly accountStatus: "unknown" | "pending" | "ready" | "failed";
  readonly status: "idle" | "loading" | "succeeded" | "failed";
  readonly loadAssetStatus: AssetLoadStatus[];
  readonly loadListingStatus: ListingLoadStatus[];
  readonly loadListingsStatus: "idle" | "loading" | "succeeded" | "failed";
  readonly createListingStatus: "idle" | "loading" | "succeeded" | "failed";
  readonly authSignature: string | null;
  readonly notifications: Notification[] | null;
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
  "backend/authorizeAccount",
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
  "backend/loadListings",
  async (
    { address, provider, networkId }: SignerAsyncThunk,
    { getState, rejectWithValue }
  ) => {
    //const signature = await handleSignMessage(address, provider);
    const thisState: any = getState();
    if (thisState.backend.authSignature) {
      return await BackendApi.getListings(address, thisState.backend.authSignature);
    } else {
      return rejectWithValue("No authorization found.");
    }
  }
);

/*
loadListings: loads all notifications
params:
- networkId: number
- address: string
- provider: JsonRpcProvider
returns: void
*/
export const loadNotifications = createAsyncThunk(
  "backend/loadNotifications",
  async (
    { address, provider, networkId }: SignerAsyncThunk,
    { getState, rejectWithValue }
  ) => {
    //const signature = await handleSignMessage(address, provider);
    const thisState: any = getState();
    if (thisState.backend.authSignature) {
      console.log(
        await BackendApi.getNotifications(address, thisState.backend.authSignature)
      );
    } else {
      rejectWithValue("No authorization found.");
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
  "backend/createListing",
  async ({ asset, terms }: ListingAsyncThunk, { getState, rejectWithValue }) => {
    console.log("backend-slice: createListing");
    const thisState: any = getState();
    if (thisState.backend.authSignature) {
      if (!BackendApi.createListing(thisState.backend.authSignature, asset, terms)) {
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
  "backend/loadAsset",
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
    if (thisState.backend.authSignature) {
      console.log("sig found");
      const apiResults = await BackendApi.getAssetFromOpenseaId(
        [asset.openseaId],
        thisState.backend.authSignature
      );
      const apiAsset = apiResults[0];
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
loadAssetsFromOpenseaIds: loads multiple assets from API and merges into assets
params: 
- openseaIds: string[]
returns: boolean
*/
export const loadAssetsFromOpenseaIds = createAsyncThunk(
  "backend/loadAsset",
  async (openseaIds: string[], { getState, rejectWithValue, dispatch }) => {
    console.log("loadAssetsFromOpenseaIds called");
    const thisState: any = getState();
    if (thisState.backend.authSignature) {
      console.log("sig found");
      const apiAssets = await BackendApi.getAssetFromOpenseaId(
        openseaIds,
        thisState.backend.authSignature
      );

      dispatch(
        updateAssets(
          apiAssets.map((asset: Asset) => ({
            ...asset,
            cacheExpire: Date.now() + cacheTime,
          }))
        )
      );
    } else {
      rejectWithValue("No authorization found.");
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
  "backend/loadListing",
  async (openseaId: string, { getState, rejectWithValue, dispatch }) => {
    console.log("loadListing called");
    if (!openseaId) {
      console.log("no id");
      return rejectWithValue("No openseaId");
    }
    const thisState: any = getState();
    if (thisState.backend.authSignature) {
      console.log("sig found");
      const listing: Listing = await BackendApi.getListingFromOpenseaId(
        openseaId,
        thisState.backend.authSignature
      );

      return listing;
    } else {
      return rejectWithValue("No authorization found.");
    }
  }
);

// initial wallet slice state
const previousState = loadState("backend");
const initialState: BackendData = {
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
const backendSlice = createSlice({
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
      if (listing) {
        listing = { ...listing, ...action.payload };
      } else {
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
    builder.addCase(loadNotifications.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(loadNotifications.fulfilled, (state, action) => {
      state.status = "succeeded";
      // console.log(action.payload);
      //state.notifications = action.payload;
    });
    builder.addCase(loadNotifications.rejected, (state, action) => {
      state.status = "failed";
    });
  },
});

export const backendReducer = backendSlice.reducer;
// actions are automagically generated and exported by the builder/thunk
//export const {} = walletSlice.actions;
