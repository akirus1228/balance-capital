import { Collectible } from "@audius/fetch-nft";

// request types
export interface AssetListingRequest extends Listing {
  term: Terms; //convert terms to term for api
}

// response types
export type LoginResponse = {
  address: string;
  createdAt: string;
  description?: string;
  email?: string;
  id: string;
  name?: string;
  profileImageUrl?: string;
  updatedAt: string;
};

export type AllListingsResponse = {
  data: Listing[];
  count: number;
};

// data models
export enum AssetStatus {
  READY,
  LISTED,
  LOCKED,
}

export enum AssetMediaType {
  IMAGE,
  VIDEO,
  GIF,
  THREE_D,
}

export enum AssetChain {
  eth,
  sol,
}

export type Owner = {
  id?: string;
  address: string;
  createdAt?: string;
  updatedAt?: string;
  name?: string;
  email?: string;
  description?: string;
  profileImageUrl?: string;
};

export type Terms = {
  id: string;
  amount: number;
  apr: number;
  duration: number;
  expirationAt: string;
  createdAt: string;
  updatedAt: string;
};

export enum ListingStatus {
  Pending,
  LISTED,
  COMPLETED,
  Cancelled,
}

export interface Listing {
  id?: string;
  asset: Collectible;
  terms: Terms;
  status: ListingStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface Asset extends Collectible {
  status: AssetStatus;
}
