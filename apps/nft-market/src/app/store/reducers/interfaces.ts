import { JsonRpcProvider } from "@ethersproject/providers";
import {
  IBaseAddressAsyncThunk,
  IBaseAsyncThunk,
  IInteractiveAsyncThunk,
} from "@fantohm/shared-web3";
import { BigNumber } from "ethers";
import { Asset, BackendAssetQueryParams, Loan, Terms } from "../../types/backend-types";

// nft-marketplace slice
export interface SignerAsyncThunk
  extends IBaseAddressAsyncThunk,
    IInteractiveAsyncThunk {}

export interface AssetAsyncThunk {
  readonly asset: Asset;
}

export interface TermsAsyncThunk {
  readonly term: Terms;
}

export interface ListingAsyncThunk extends AssetAsyncThunk, TermsAsyncThunk {}

export interface LoanAsyncThunk extends IBaseAsyncThunk {
  readonly loan: Loan;
  networkId: number;
  provider: JsonRpcProvider;
}

export interface LoanDetailsAsyncThunk extends IBaseAsyncThunk {
  readonly loanId: number;
  readonly networkId: number;
  readonly provider: JsonRpcProvider;
}

export interface RepayLoanAsyncThunk extends IBaseAsyncThunk {
  readonly loanId: number;
  readonly amountDue: BigNumber;
  readonly networkId: number;
  readonly provider: JsonRpcProvider;
}

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
  minApr?: number;
  maxApr?: number;
  minDuration?: number;
  maxDuration?: number;
  minPrice?: number;
  maxPrice?: number;
  borrower?: string;
};

export interface ListingQueryAsyncThunk {
  queryParams?: ListingQueryParam;
}

export interface BackendAssetQueryAsyncThunk {
  queryParams?: BackendAssetQueryParams;
}

export type OpenseaAssetQueryParam = {
  owner?: string; // wallet address
  token_ids?: string[]; //array of token ids
  collection?: string;
  collection_slug?: string;
  order_direction?: string;
  asset_contract_address?: string;
  asset_contract_addresses?: string;
  limit?: number;
};

export interface OpenseaAssetQueryAsyncThunk {
  queryParams?: OpenseaAssetQueryParam;
}
