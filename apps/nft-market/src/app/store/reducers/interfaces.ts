import {
  IBaseAddressAsyncThunk,
  IBaseAsyncThunk,
  IInteractiveAsyncThunk,
} from "@fantohm/shared-web3";
import { Asset, Terms } from "../../types/backend-types";

// nft-marketplace slice
export interface SignerAsyncThunk
  extends IBaseAddressAsyncThunk,
    IInteractiveAsyncThunk {}

export interface AssetAsyncThunk {
  readonly asset: Asset;
}

export interface TermsAsyncThunk {
  readonly terms: Terms;
}

export interface ListingAsyncThunk extends AssetAsyncThunk, TermsAsyncThunk {}

export interface AssetLocAsyncThunk extends IBaseAsyncThunk, IInteractiveAsyncThunk {
  readonly walletAddress: string;
  readonly assetAddress: string;
  readonly tokenId: string;
}
