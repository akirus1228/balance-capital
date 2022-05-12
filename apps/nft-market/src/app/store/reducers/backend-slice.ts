import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  BackendLoadingStatus,
  LoginResponse,
  Notification,
} from "../../types/backend-types";
import { loadState } from "@fantohm/shared-web3";
import { BackendApi } from "../../api";
import { SignerAsyncThunk } from "./interfaces";

export type AssetLoadStatus = {
  assetId: string;
  status: BackendLoadingStatus;
};
export interface BackendData {
  readonly accountStatus: "unknown" | "pending" | "ready" | "failed";
  readonly status: "idle" | "loading" | "succeeded" | "failed";
  readonly loadAssetStatus: AssetLoadStatus[];
  readonly authSignature: string | null;
  readonly notifications: Notification[] | null;
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
loadNotifications: loads all notifications
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

// initial wallet slice state
const previousState = loadState("backend");
const initialState: BackendData = {
  accountStatus: "unknown",
  authSignature: null,
  ...previousState,
  status: "idle",
  loadAssetStatus: [],
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
