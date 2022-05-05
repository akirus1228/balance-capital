import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ethers } from "ethers";

import { ierc20Abi } from "../abi";
import { addresses } from "../constants";
import { chains } from "../providers";
import { IBaseAddressAsyncThunk } from "../slices/interfaces";
import { Asset } from "../nft-marketplace-backend";
import { FetchNFTClient } from "@fantohm/shared/fetch-nft";

const OPENSEA_API_KEY = "6f2462b6e7174e9bbe807169db342ec4";

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
  readonly assetStatus: "idle" | "loading" | "succeeded" | "failed";
  readonly currencyStatus: "idle" | "loading" | "succeeded" | "failed";
  readonly assets: Asset[];
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
  "wallet/loadWalletCurrencies",
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
  "wallet/loadWalletAssets",
  async ({ address }: IBaseAddressAsyncThunk, { rejectWithValue }) => {
    if (!address) {
      return rejectWithValue("No wallet address");
    }
    const isDev = !process.env["NODE_ENV"] || process.env["NODE_ENV"] === "development";
    const openSeaConfig: any = {
      apiKey: isDev ? "" : OPENSEA_API_KEY,
    };
    if (isDev) {
      openSeaConfig.apiEndpoint = "https://testnets-api.opensea.io/api/v1";
    }
    try {
      const client = new FetchNFTClient({ openSeaConfig });
      const walletContents = await client.getEthereumCollectibles([address]);
      if (!walletContents) {
        return [] as Asset[];
      }
      return walletContents[address] as Asset[];
    } catch (err) {
      console.log(err);
      rejectWithValue("Unable to load assets.");
      return [] as Asset[];
    }
  }
);

// initial wallet slice state
const initialState: WalletData = {
  currencyStatus: "idle",
  assetStatus: "idle",
  assets: [],
  currencies: [],
};

// create slice and initialize reducers
const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    updateAsset: (state, action: PayloadAction<Asset>) => {
      console.log("Update asset");
      console.log(action.payload);
      state.assets = state.assets.map((asset: Asset) => {
        if (asset.id === action.payload.id) {
          return { ...asset, ...action.payload };
        }
        return asset;
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadWalletCurrencies.pending, (state, action) => {
      state.currencyStatus = "loading";
    });
    builder.addCase(loadWalletCurrencies.fulfilled, (state, action) => {
      state.currencyStatus = "succeeded";
      // console.log(action.payload);
      state.currencies = action.payload;
    });
    builder.addCase(loadWalletCurrencies.rejected, (state, action) => {
      state.currencyStatus = "failed";
    });
    builder.addCase(loadWalletAssets.pending, (state, action) => {
      state.assetStatus = "loading";
    });
    builder.addCase(
      loadWalletAssets.fulfilled,
      (state, action: PayloadAction<Asset[]>) => {
        state.assetStatus = "succeeded";
        state.assets = [...state.assets, ...action.payload];
      }
    );
    builder.addCase(loadWalletAssets.rejected, (state, action) => {
      state.assetStatus = "failed";
    });
  },
});

export const walletReducer = walletSlice.reducer;
// actions are automagically generated and exported by the builder/thunk
export const { updateAsset } = walletSlice.actions;
