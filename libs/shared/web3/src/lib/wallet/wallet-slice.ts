import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { ierc20Abi, ierc721Abi } from "../abi";
import { addresses } from "../constants";
import { chains } from "../providers";
import { AssetLocAsyncThunk, IBaseAddressAsyncThunk } from "../slices/interfaces";
import { Asset } from "../nft-marketplace-backend";
import {
  Collectible,
  FetchNFTClient,
  FetchNFTClientProps,
} from "@fantohm/shared/fetch-nft";
import { NetworkIds } from "../networks";
import { loadState } from "../helpers/localstorage";
import { isDev } from "../helpers";

const OPENSEA_API_KEY = "6f2462b6e7174e9bbe807169db342ec4";

const openSeaConfig = (): FetchNFTClientProps => {
  console.log("isDev: " + isDev());
  const openSeaConfig: any = {
    apiKey: isDev() ? "" : OPENSEA_API_KEY,
  };
  if (isDev()) {
    openSeaConfig.apiEndpoint = "https://testnets-api.opensea.io/api/v1";
  }
  console.log(openSeaConfig);
  return { openSeaConfig };
};

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
  readonly nextOpenseaLoad: number;
  fetchNftClient: FetchNFTClient;
}

const cacheTime = 300 * 1000; // 5 minutes

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
  async ({ address }: IBaseAddressAsyncThunk, { rejectWithValue, getState }) => {
    if (!address) {
      return rejectWithValue("No wallet address");
    }
    try {
      // see if opensea has any assets listed for this address
      const thisState: any = getState();
      const client: FetchNFTClient = thisState.wallet.fetchNftClient as FetchNFTClient;
      const openseaData = await client.getEthereumCollectibles([address]);
      if (!openseaData) {
        return [] as Asset[];
      }

      // convertCollectible to Asset
      const walletContents = openseaData[address].map(
        (collectible: Collectible): Asset => {
          const { id, ...tmpCollectible } = collectible;
          const asset = {
            ...tmpCollectible,
            openseaLoaded: Date.now() + cacheTime,
          } as Asset;
          return asset;
        }
      );
      return walletContents as Asset[];
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
returns: RejectWithValue<unknown,unknown> | { assetAddress: string, tokenId: string, hasPermission: boolean}
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
    if (networkId != NetworkIds.Ethereum && networkId != NetworkIds.Rinkeby) {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: NetworkIds.Rinkeby }],
      });
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
const previousState = loadState("wallet");
const initialState: WalletData = {
  assets: [],
  currencies: [],
  isDev: !process.env["NODE_ENV"] || process.env["NODE_ENV"] === "development",
  ...previousState, // overwrite assets and currencies from cache if recent
  currencyStatus: "idle", // always reset states on reload
  assetStatus: "idle",
  checkPermStatus: "idle",
  requestPermStatus: "idle",
  nextOpenseaLoad: 0,
  fetchNftClient: new FetchNFTClient(openSeaConfig()),
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
        if (
          asset.assetContractAddress === action.payload.assetContractAddress &&
          asset.tokenId === action.payload.tokenId
        ) {
          console.log("Found update match");
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
        state.nextOpenseaLoad = Date.now() + cacheTime;
        action.payload.map((newAsset: Asset) => {
          let dupAsset = state.assets.find(
            (stateAsset: Asset) =>
              stateAsset.tokenId === newAsset.tokenId &&
              stateAsset.assetContractAddress === newAsset.assetContractAddress
          );
          // if exists, update
          if (dupAsset) {
            dupAsset = { ...dupAsset, ...newAsset };
          } else {
            // if new, push
            state.assets.push(newAsset);
          }
        });
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
