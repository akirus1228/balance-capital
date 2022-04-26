import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { chains } from "../providers";
import { IBaseAddressAsyncThunk } from "../slices/interfaces";
import { getWalletAssets, Asset } from "./opensea";

export enum AcceptedCurrencies {
  USDB,
  WETH,
  DAI,
  FTM,
  USDC,
}

export interface Currency {
  symbol: AcceptedCurrencies;
  name: string;
  balance: number;
}

export interface WalletData {
  readonly status: "idle" | "loading" | "succeeded" | "failed";
  readonly assets: Asset[];
  readonly currencies: Currency[];
}

const initialState: WalletData = {
  status: "idle",
  assets: [],
  currencies: [],
};

/* 
loadWalletBalance: loads balances
params: 
- networkId: number
- address: string
returns: void
*/
export const loadWallet = createAsyncThunk(
  "account/loadWalletBalances",
  async ({ networkId, address }: IBaseAddressAsyncThunk) => {
    console.log("loading wallet balances");
    const provider = await chains[networkId].provider;
    console.log(await provider.lookupAddress(address));
    return {};
  }
);

/* 
loadWalletNfts: loads nfts owned by specific address
params: 
- address: string
returns: void
*/
export const loadWalletAssets = createAsyncThunk(
  "account/loadWalletAssets",
  async ({ address }: IBaseAddressAsyncThunk) => {
    const walletContents = await getWalletAssets(address);
    console.log(walletContents);
    return walletContents;
  }
);

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadWalletAssets.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(loadWalletAssets.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.assets = action.payload;
      //console.log(action);
    });
    builder.addCase(loadWalletAssets.rejected, (state, action) => {
      state.status = "failed";
    });
  },
});

export const walletReducer = walletSlice.reducer;
//export const {} = walletSlice.actions;
