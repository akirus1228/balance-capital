import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ethers } from "ethers";

import { ierc20Abi, ierc721Abi, usdbLending } from "../abi";
import { addresses } from "../constants";
import { chains } from "../providers";
import {
  AssetAsyncThunk,
  AssetLocAsyncThunk,
  IBaseAddressAsyncThunk,
} from "../slices/interfaces";
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
  readonly checkPermStatus: "idle" | "loading" | "failed";
  readonly requestPermStatus: "idle" | "loading" | "failed";
  readonly assets: Asset[];
  readonly currencies: Currency[];
  readonly isDev: boolean;
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

/* 
requestNftPermission: loads nfts owned by specific address
params: 
- address: string
returns: void
*/
export const requestNftPermission = createAsyncThunk(
  "wallet/requestNftPermission",
  async (
    { networkId, provider, walletAddress, assetAddress, tokenId }: AssetLocAsyncThunk,
    { rejectWithValue }
  ) => {
    if (!walletAddress || !assetAddress || !tokenId) {
      return rejectWithValue("Addresses and id required");
    }
    try {
      const signer = provider.getSigner();
      const nftContract = new ethers.Contract(assetAddress, ierc721Abi, signer);
      const response = await nftContract["approve"](
        addresses[networkId]["USDB_LENDING_ADDRESS"] as string,
        tokenId
      );
      console.log(response);
      return { assetAddress, tokenId };
    } catch (err) {
      console.log(err);
      return rejectWithValue("Unable to load create listing.");
    }
  }
);

/* 
checkNftPermission: loads nfts owned by specific address
params: 
- networkId: string
- provider: JsonRpcProvider
- walletAddress: string
- assetAddress: string
- tokenId: string
returns: void
*/
export const checkNftPermission = createAsyncThunk(
  "wallet/checkNftPermission",
  async (
    { networkId, provider, walletAddress, assetAddress, tokenId }: AssetLocAsyncThunk,
    { rejectWithValue }
  ) => {
    if (!walletAddress || !assetAddress || !tokenId) {
      return rejectWithValue("Addresses and id required");
    }
    try {
      const nftContract = new ethers.Contract(assetAddress, ierc721Abi, provider);
      const response = await nftContract["getApproved"](tokenId);
      console.log(response);
      const hasPermission = response.includes(
        addresses[networkId]["USDB_LENDING_ADDRESS"]
      );
      return { assetAddress, tokenId, hasPermission };
    } catch (err) {
      console.log(err);
      return rejectWithValue("Unable to load create listing.");
    }
  }
);

// initial wallet slice state
const initialState: WalletData = {
  currencyStatus: "idle",
  assetStatus: "idle",
  checkPermStatus: "idle",
  requestPermStatus: "idle",
  assets: [],
  currencies: [],
  isDev: !process.env["NODE_ENV"] || process.env["NODE_ENV"] === "development",
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
        console.log(action.payload);
        state.assets = [...state.assets, ...action.payload];
      }
    );
    builder.addCase(loadWalletAssets.rejected, (state, action) => {
      state.assetStatus = "failed";
    });
    builder.addCase(checkNftPermission.pending, (state, action) => {
      state.checkPermStatus = "loading";
    });
    builder.addCase(
      checkNftPermission.fulfilled,
      (
        state,
        action: PayloadAction<{
          assetAddress: string;
          tokenId: string;
          hasPermission: boolean;
        }>
      ) => {
        state.checkPermStatus = "idle";
        console.log(action.payload);
        state.assets = state.assets.map((asset: Asset) => {
          if (
            asset.assetContractAddress === action.payload.assetAddress &&
            asset.tokenId === action.payload.tokenId
          ) {
            asset.hasPermission = action.payload.hasPermission;
          }
          return asset;
        });
      }
    );
    builder.addCase(checkNftPermission.rejected, (state, action) => {
      state.checkPermStatus = "failed";
    });
    builder.addCase(requestNftPermission.pending, (state, action) => {
      state.requestPermStatus = "loading";
    });
    builder.addCase(
      requestNftPermission.fulfilled,
      (
        state,
        action: PayloadAction<{
          assetAddress: string;
          tokenId: string;
        }>
      ) => {
        state.requestPermStatus = "idle";
        state.assets = state.assets.map((asset: Asset) => {
          if (
            asset.assetContractAddress === action.payload.assetAddress &&
            asset.tokenId === action.payload.tokenId
          ) {
            asset.hasPermission = true;
          }
          return asset;
        });
      }
    );
    builder.addCase(requestNftPermission.rejected, (state, action) => {
      state.requestPermStatus = "failed";
    });
  },
});

export const walletReducer = walletSlice.reducer;
// actions are automagically generated and exported by the builder/thunk
export const { updateAsset } = walletSlice.actions;
