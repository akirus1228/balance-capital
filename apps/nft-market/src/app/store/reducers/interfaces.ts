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

export interface SkipLimitAsyncThunk {
  readonly skip: number;
  readonly limit: number;
}

export type ListingQueryParam = {
  skip: number;
  take: number;
  status?: string;
  openseaIds?: string[];
  contractAddress?: string;
  mediaType?: string;
  apr?: number;
  duration?: number;
  borrower?: string;
};

export interface ListingQueryAsyncThunk {
  queryParams?: ListingQueryParam;
}
