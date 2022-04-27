import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { ierc20Abi } from "../abi";
import { addresses } from "../constants";
import { chains } from "../providers";
import { IBaseAddressAsyncThunk } from "../slices/interfaces";
import { getWalletAssets, OpenSeaAsset } from "./opensea";

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
  balance: string;
}

export interface WalletData {
  readonly status: "idle" | "loading" | "succeeded" | "failed";
  readonly assets: OpenSeaAsset[];
  readonly currencies: Currency[];
}

/* 
loadWalletBalance: loads balances
params: 
- networkId: number
- address: string
returns: void
*/
export const loadWalletCurrencies = createAsyncThunk(
  "account/loadWalletCurrencies",
  async ({ networkId, address }: IBaseAddressAsyncThunk) => {
    // console.log("loading wallet balances");
    const provider = await chains[networkId].provider;

    const usdbContract = new ethers.Contract(
      addresses[networkId]["USDB_ADDRESS"] as string,
      ierc20Abi,
      provider
    );

    const usdbBalance = await usdbContract["balanceOf"](address);
    return [
      {
        symbol: AcceptedCurrencies.USDB,
        name: "USDBalance",
        balance: ethers.utils.formatUnits(usdbBalance, "gwei"),
      } as Currency,
    ];
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
    // console.log(walletContents);
    return walletContents;
  }
);

// initial wallet slice state
const initialState: WalletData = {
  status: "idle",
  assets: [],
  currencies: [],
};

// create slice and initialize reducers
const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadWalletCurrencies.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(loadWalletCurrencies.fulfilled, (state, action) => {
      state.status = "succeeded";
      // console.log(action.payload);
      state.currencies = action.payload;
    });
    builder.addCase(loadWalletCurrencies.rejected, (state, action) => {
      state.status = "failed";
    });
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
// actions are automagically generated and exported by the builder/thunk
//export const {} = walletSlice.actions;
