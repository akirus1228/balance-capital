import { AsyncThunk, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loadState } from "../helpers/localstorage";
import { SignerAsyncThunk, ListingAsyncThunk } from "../slices/interfaces";
import { BackendApi } from ".";
import { Listing, ListingStatus, LoginResponse } from "./backend-types";

export interface MarketplaceApiData {
  readonly accountStatus: "unknown" | "pending" | "ready" | "failed";
  readonly status: "idle" | "loading" | "succeeded" | "failed";
  readonly authSignature: string | null;
}

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
      console.log(
        await BackendApi.getListings(address, thisState.nftMarketplace.authSignature)
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
  "marketplaceApi/createListing",
  async ({ asset, terms }: ListingAsyncThunk, { getState, rejectWithValue }) => {
    console.log("backend-slice: createListing");
    const thisState: any = getState();
    if (thisState.nftMarketplace.authSignature) {
      const listing: Listing = {
        asset,
        terms,
        status: ListingStatus.LISTED,
      };
      console.log(listing);
      BackendApi.createListing(thisState.nftMarketplace.authSignature, listing);
    } else {
      console.warn("no auth");
      rejectWithValue("No authorization found.");
    }
  }
);

/* 
loadAsset: loads all listings
params: 
- networkId: number
- address: string
- provider: JsonRpcProvider
returns: void
*/
export const loadAsset = createAsyncThunk(
  "marketplaceApi/loadAsset",
  async (assetId: string, { getState, rejectWithValue }) => {
    //const signature = await handleSignMessage(address, provider);
    const thisState: any = getState();
    if (thisState.nftMarketplace.authSignature) {
      console.log(
        await BackendApi.getAsset(assetId, thisState.nftMarketplace.authSignature)
      );
    } else {
      rejectWithValue("No authorization found.");
    }
  }
);

// initial wallet slice state
const previousState = loadState("nftMarketplace");
const initialState: MarketplaceApiData = {
  accountStatus: "unknown",
  status: "idle",
  authSignature: null,
  ...previousState,
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
      state.status = "loading";
    });
    builder.addCase(loadListings.fulfilled, (state, action) => {
      state.status = "succeeded";
      // console.log(action.payload);
      //state.currencies = action.payload;
    });
    builder.addCase(loadListings.rejected, (state, action) => {
      state.status = "failed";
    });
  },
});

export const marketplaceApiReducer = marketplaceApiSlice.reducer;
// actions are automagically generated and exported by the builder/thunk
//export const {} = walletSlice.actions;
