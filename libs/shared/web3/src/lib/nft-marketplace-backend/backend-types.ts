import { Collectible } from "@fantohm/shared/fetch-nft";

// request types
export interface CreateListingRequest {
  asset: Asset | string;
  term: Terms | string; //convert terms to term for api
  status: ListingStatus;
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

export enum ListingStatus {
  Pending = "Pending",
  LISTED = "LISTED",
  COMPLETED = "COMPLETED",
  Cancelled = "Cancelled",
}

export interface Listing {
  id?: string;
  asset: Asset;
  terms: Terms;
  status: ListingStatus;
  createdAt?: string;
  updatedAt?: string;
}

export type Chain = "eth" | "sol";

export interface Asset {
  status: AssetStatus;
  cacheExpire?: number;
  openseaLoaded?: number;
  hasPermission?: boolean;
  owner?: Owner;
  id?: string;
  tokenId: string;
  openseaId?: string;
  name: Nullable<string>;
  description: Nullable<string>;
  mediaType: CollectibleMediaType;
  frameUrl: Nullable<string>;
  imageUrl: Nullable<string>;
  gifUrl: Nullable<string>;
  videoUrl: Nullable<string>;
  threeDUrl: Nullable<string>;
  isOwned: boolean;
  dateCreated: Nullable<string>;
  dateLastTransferred: Nullable<string>;
  externalLink: Nullable<string>;
  permaLink: Nullable<string>;
  assetContractAddress: string;
  chain: Chain;
  wallet: string;
}

export type Nullable<T> = T | null;
