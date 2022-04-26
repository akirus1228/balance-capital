import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IBaseAddressAsyncThunk, SignerAsyncThunk } from "../slices/interfaces";
import getListings, {
  doLogin,
  handleSignMessage,
  LoginResponse,
} from "./marketplace-api";

export interface MarketplaceApiData {
  readonly accountStatus: "unknown" | "pending" | "ready" | "failed";
  readonly status: "idle" | "loading" | "succeeded" | "failed";
  readonly authSignature: string | null;
}

/* 
authorizeAccount: calls the auth/login function adding the address to our db if non-existant
  upon success
params: 
- networkId: number
- address: string
returns: void
*/
export const authorizeAccount = createAsyncThunk(
  "marketplaceApi/authorizeAccount",
  async (
    { address, networkId, provider }: SignerAsyncThunk,
    { dispatch, rejectWithValue }
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
loadListings: loads balances
params: 
- networkId: number
- address: string
returns: void
*/
export const loadListings = createAsyncThunk(
  "marketplaceApi/loadListings",
  async ({ address, provider, networkId }: SignerAsyncThunk, { getState }) => {
    //const signature = await handleSignMessage(address, provider);
    const thisState: any = getState();
    if (thisState.nftMarketplace.authSignature) {
      console.log(await getListings(address, thisState.nftMarketplace.authSignature));
    }
  }
);

// initial wallet slice state
const initialState: MarketplaceApiData = {
  accountStatus: "unknown",
  status: "idle",
  authSignature: null,
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
      } else if (action.payload === "Login Failed") {
        state.accountStatus = "failed";
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
