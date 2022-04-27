import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loadState } from "../helpers/localstorage";
import { SignerAsyncThunk } from "../slices/interfaces";
import getListings, { doLogin, handleSignMessage } from "./backend-api";
import { LoginResponse } from "./backend-types";

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
    const loginResponse: LoginResponse = await doLogin(address);
    if (loginResponse.id) {
      const signature = await handleSignMessage(address, provider);
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
      console.log(await getListings(address, thisState.nftMarketplace.authSignature));
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
