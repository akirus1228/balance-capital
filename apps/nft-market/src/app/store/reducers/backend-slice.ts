import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  BackendLoadingStatus,
  LoginResponse,
  Notification,
  User,
} from "../../types/backend-types";
import { loadState } from "@fantohm/shared-web3";
import { BackendApi } from "../../api";
import { SignerAsyncThunk } from "./interfaces";

export type AssetLoadStatus = {
  assetId: string;
  status: BackendLoadingStatus;
};

type SignaturePayload = {
  signature: string;
  address: string;
  user: User;
};

export interface BackendData {
  readonly accountStatus: "unknown" | "pending" | "ready" | "failed";
  readonly status: "idle" | "loading" | "succeeded" | "failed";
  readonly loadAssetStatus: AssetLoadStatus[];
  readonly authSignature: string | null;
  readonly authorizedAccount: string;
  readonly notifications: Notification[] | null;
  readonly user: User;
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
  async ({ address, networkId, provider }: SignerAsyncThunk, { rejectWithValue }) => {
    const loginResponse: LoginResponse = await BackendApi.doLogin(address);
    if (loginResponse.id) {
      const signature = await BackendApi.handleSignMessage(address, provider);
      if (!signature) {
        rejectWithValue("Login Failed");
      }
      return { signature, address, user: loginResponse };
    } else {
      return rejectWithValue("Login Failed");
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
  authorizedAccount: null,
  user: {} as User,
  ...previousState,
  status: "idle",
  loadAssetStatus: [],
};

// create slice and initialize reducers
const backendSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    logout: (state) => {
      state.authSignature = null;
      state.authorizedAccount = "";
      state.accountStatus = "unknown";
      state.user = {} as User;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(authorizeAccount.pending, (state, action) => {
      state.accountStatus = "pending";
    });
    builder.addCase(
      authorizeAccount.fulfilled,
      (state, action: PayloadAction<SignaturePayload | undefined>) => {
        if (action.payload) {
          state.accountStatus = "ready";
          state.authSignature = action.payload.signature;
          state.authorizedAccount = action.payload.address;
          state.user = action.payload.user;
        }
      }
    );
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
export const { logout } = backendSlice.actions;
