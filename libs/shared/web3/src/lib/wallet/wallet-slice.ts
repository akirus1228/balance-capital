import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { chains } from "../providers";
import { IBaseAddressAsyncThunk } from "../slices/interfaces";

export interface Token {
  contract: string;
  name: string;
  symbol: string;
  maxSupply: string;
}

export interface Nft extends Token {
  nft: boolean;
}

export interface Currency extends Token {
  currency: boolean;
}

export interface WalletData {
  readonly status: "idle" | "loading" | "succeeded" | "failed";
  readonly nfts: Nft[];
  readonly currencies: Currency[];
}

const initialState: WalletData = {
  status: "idle",
  nfts: [],
  currencies: [],
};

export const loadWallet = createAsyncThunk(
  "account/loadWallet",
  async ({ networkId, address }: IBaseAddressAsyncThunk, { dispatch }) => {
    const provider = await chains[networkId].provider;
    console.log(await provider.lookupAddress(address));
    return {};
  }
);

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setNfts: (state, action: PayloadAction<Nft[]>) => {
      state.nfts = action.payload;
    },
    setCurrencies: (state, action: PayloadAction<Currency[]>) => {
      state.currencies = action.payload;
    },
  },
});

export const walletReducer = walletSlice.reducer;
export const { setNfts, setCurrencies } = walletSlice.actions;
