import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BigNumber, ethers } from "ethers";
import { ierc20Abi, ierc721Abi, usdbLending } from "../abi";
import { addresses } from "../constants";
import { isDev, loadState } from "../helpers";
import { NetworkIds } from "../networks";
import { chains } from "../providers";
import {
  AssetLocAsyncThunk,
  Erc20AllowanceAsyncThunk,
  IBaseAddressAsyncThunk,
  InteractiveWalletErc20AsyncThunk,
} from "../slices/interfaces";

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

export type NftPermStatus = {
  [tokenIdentifier: string]: boolean;
};

export type Erc20Allowance = {
  [tokenIdentifier: string]: BigNumber;
};

export type NftPermissionPayload = {
  assetAddress: string;
  tokenId: string;
  hasPermission: boolean;
};

export interface WalletState {
  readonly currencyStatus: "idle" | "loading" | "succeeded" | "failed";
  readonly checkPermStatus: "idle" | "loading" | "failed";
  readonly requestPermStatus: "idle" | "loading" | "failed";
  readonly requestErc20AllowanceStatus: "idle" | "loading" | "failed";
  readonly checkErc20AllowanceStatus: "idle" | "loading" | "failed";
  readonly nftPermStatus: NftPermStatus;
  readonly erc20Allowance: Erc20Allowance;
  readonly currencies: Currency[];
  readonly isDev: boolean;
  readonly platformFee: number;
}

/* 
loadPlatformFee: loads current fee for usdbLending contract
params: 
- networkId: number
- address: string
returns: void
*/
export const loadPlatformFee = createAsyncThunk(
  "wallet/loadPlatformFee",
  async ({ networkId, address }: IBaseAddressAsyncThunk) => {
    const provider = await chains[networkId].provider;

    const usdbLendingContract = new ethers.Contract(
      addresses[networkId]["USDB_LENDING_ADDRESS"] as string,
      usdbLending,
      provider
    );

    const platformFee = await usdbLendingContract["platformFee"]();
    return +platformFee / 10000;
  }
);

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
      const approveTx = await nftContract["approve"](
        addresses[networkId]["USDB_LENDING_ADDRESS"] as string,
        tokenId
      );
      await approveTx.wait();
      const payload: NftPermStatus = {};
      payload[`${tokenId}:::${assetAddress}`] = true;
      return payload;
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
      const response: string = await nftContract["getApproved"](tokenId);
      const hasPermission =
        response.toLowerCase() ===
        addresses[networkId]["USDB_LENDING_ADDRESS"].toLowerCase();
      const payload: NftPermStatus = {};
      payload[`${tokenId}:::${assetAddress}`] = hasPermission;
      return payload;
    } catch (err) {
      console.log(err);
      return rejectWithValue("Unable to load create listing.");
    }
  }
);

/* 
requestNftPermission: loads nfts owned by specific address
params: 
- address: string
returns: void
*/
export const requestErc20Allowance = createAsyncThunk(
  "wallet/requestErc20Allowance",
  async (
    {
      networkId,
      provider,
      walletAddress,
      assetAddress,
      amount,
    }: Erc20AllowanceAsyncThunk,
    { rejectWithValue }
  ) => {
    if (!walletAddress || !assetAddress) {
      return rejectWithValue("Addresses and id required");
    }
    try {
      const signer = provider.getSigner();
      const nftContract = new ethers.Contract(assetAddress, ierc20Abi, signer);
      const approveTx = await nftContract["approve"](
        addresses[networkId]["USDB_LENDING_ADDRESS"] as string,
        amount
      );
      await approveTx.wait();
      const payload: Erc20Allowance = {};
      payload[`${walletAddress}:::${assetAddress}`] = amount;
      return payload;
    } catch (err) {
      console.log(err);
      return rejectWithValue("Unable to load create listing.");
    }
  }
);

/* 
checkCurrencyAllowance: loads nfts owned by specific address
params: 
- networkId: string
- provider: JsonRpcProvider
- walletAddress: string
- assetAddress: string
- tokenId: string
returns: RejectWithValue<unknown,unknown> | { assetAddress: string, tokenId: string, hasPermission: boolean}
*/
export const checkErc20Allowance = createAsyncThunk(
  "wallet/checkCurrencyAllowance",
  async (
    {
      networkId,
      provider,
      walletAddress,
      assetAddress,
    }: InteractiveWalletErc20AsyncThunk,
    { rejectWithValue }
  ) => {
    if (!walletAddress || !assetAddress) {
      return rejectWithValue("Addresses and id required");
    }
    if (networkId != NetworkIds.Ethereum && networkId != NetworkIds.Rinkeby) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: isDev() ? NetworkIds.Rinkeby : NetworkIds.Ethereum }],
        });
      } catch (err: any) {
        console.warn(err);
      }
    }
    try {
      const erc20Contract = new ethers.Contract(assetAddress, ierc20Abi, provider);
      const response: BigNumber = await erc20Contract["allowance"](
        walletAddress,
        addresses[networkId]["USDB_LENDING_ADDRESS"]
      );
      const payload: Erc20Allowance = {};
      payload[`${walletAddress}:::${assetAddress}`] = response;
      return payload;
    } catch (err) {
      console.log(err);
      return rejectWithValue("Unable to load create listing.");
    }
  }
);

// initial wallet slice state
const previousState = loadState("wallet");
const initialState: WalletState = {
  currencies: [],
  nftPermStatus: [],
  platformFee: null,
  ...previousState, // overwrite assets and currencies from cache if recent
  currencyStatus: "idle", // always reset states on reload
  checkPermStatus: "idle",
  requestPermStatus: "idle",
  erc20Allowance: [],
  requestErc20AllowanceStatus: "idle",
  checkErc20AllowanceStatus: "idle",
};

// create slice and initialize reducers
const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadPlatformFee.fulfilled, (state, action: PayloadAction<number>) => {
      state.platformFee = action.payload;
    });
    builder.addCase(loadWalletCurrencies.pending, (state, action) => {
      state.currencyStatus = "loading";
    });
    builder.addCase(loadWalletCurrencies.fulfilled, (state, action) => {
      state.currencyStatus = "succeeded";
      state.currencies = action.payload;
    });
    builder.addCase(loadWalletCurrencies.rejected, (state, action) => {
      state.currencyStatus = "failed";
    });
    builder.addCase(checkNftPermission.pending, (state, action) => {
      state.checkPermStatus = "loading";
    });
    builder.addCase(
      checkNftPermission.fulfilled,
      (state, action: PayloadAction<NftPermStatus>) => {
        state.checkPermStatus = "idle";
        state.nftPermStatus = { ...state.nftPermStatus, ...action.payload };
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
      (state, action: PayloadAction<NftPermStatus>) => {
        state.requestPermStatus = "idle";
        state.nftPermStatus = { ...state.nftPermStatus, ...action.payload };
      }
    );
    builder.addCase(requestNftPermission.rejected, (state, action) => {
      state.requestPermStatus = "failed";
    });
    builder.addCase(checkErc20Allowance.pending, (state, action) => {
      state.checkErc20AllowanceStatus = "loading";
    });
    builder.addCase(
      checkErc20Allowance.fulfilled,
      (state, action: PayloadAction<Erc20Allowance>) => {
        state.checkErc20AllowanceStatus = "idle";
        state.erc20Allowance = { ...state.erc20Allowance, ...action.payload };
      }
    );
    builder.addCase(checkErc20Allowance.rejected, (state, action) => {
      state.checkErc20AllowanceStatus = "failed";
    });
    builder.addCase(requestErc20Allowance.pending, (state, action) => {
      state.requestErc20AllowanceStatus = "loading";
    });
    builder.addCase(
      requestErc20Allowance.fulfilled,
      (state, action: PayloadAction<Erc20Allowance>) => {
        state.requestErc20AllowanceStatus = "idle";
        state.erc20Allowance = { ...state.erc20Allowance, ...action.payload };
      }
    );
    builder.addCase(requestErc20Allowance.rejected, (state, action) => {
      state.requestErc20AllowanceStatus = "failed";
    });
  },
});

export const walletReducer = walletSlice.reducer;
// actions are automagically generated and exported by the builder/thunk
// export const {} = assetsSlice.actions;
