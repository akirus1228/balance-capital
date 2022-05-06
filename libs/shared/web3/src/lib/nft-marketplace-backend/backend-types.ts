import { Collectible } from "@fantohm/shared/fetch-nft";

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

export type AllAssetsResponse = {
  data: Asset[];
  count: number;
};

export type CreateAssetResponse = {
  asset: Asset;
};

export type AllListingsResponse = {
  data: Listing[];
  count: number;
};

// data models
export enum AssetStatus {
  New = "NEW",
  Ready = "READY",
  Listed = "LISTED",
  Locked = "LOCKED",
}

export enum CollectibleMediaType {
  Image = "IMAGE",
  Video = "VIDEO",
  Gif = "GIF",
  ThreeD = "THREE_D",
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
  id?: string;
  amount: number;
  apr: number;
  duration: number;
  expirationAt: Date;
  createdAt?: string;
  updatedAt?: string;
};

export type ListingStatus = "Pending" | "LISTED" | "COMPLETED" | "Cancelled";
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
  hasPermission?: boolean;
  owner?: Owner;
}
