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
  data: BackendListing[];
  count: number;
};

export type CreateListingResponse = {
  asset: Asset;
  status: ListingStatus;
  term: Terms;
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

export type Person = {
  id?: string;
  address: string;
  createdAt?: string;
  updatedAt?: string;
  name?: string;
  email?: string;
  description?: string;
  profileImageUrl?: string;
};

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
  Listed = "LISTED",
  Completed = "COMPLETED",
  Cancelled = "Cancelled",
}

export interface Listing {
  id?: string;
  asset: Asset;
  terms: Terms;
  status: ListingStatus;
  createdAt?: string;
  updatedAt?: string;
  cacheExpire?: number;
}

export interface BackendListing {
  id?: string;
  asset: Asset;
  term: Terms;
  status: ListingStatus;
  createdAt?: string;
  updatedAt?: string;
  cacheExpire?: number;
}

export type Chain = "eth" | "sol";

export interface Asset {
  status: AssetStatus;
  cacheExpire?: number;
  openseaLoaded?: number;
  hasPermission?: boolean;
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
  owner?: Owner;
  dateCreated: Nullable<string>;
  dateLastTransferred: Nullable<string>;
  externalLink: Nullable<string>;
  permaLink: Nullable<string>;
  assetContractAddress: string;
  chain: Chain;
  wallet: string;
}

export type Nullable<T> = T | null;

export type StandardAssetLookupParams = {
  tokenId: string;
  contractAddress: string;
};

export enum NotificationStatus {
  Read = "READ",
  Unread = "UNREAD",
}

export enum Importance {
  High = "HIGH",
  Medium = "MEDIUM",
  Low = "LOW",
}

export type AllNotificationsResponse = {
  data: Notification[];
  count: number;
};

export type Notification = {
  id?: string;
  user: LoginResponse;
  importance: Importance;
  message: string;
  status: NotificationStatus;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
};

export type ApiResponse = {
  success: boolean;
  message: string;
};

export type EditNotificationRequest = {
  id: string;
  importance: Importance;
  message: string;
  status: NotificationStatus;
};

export enum BackendLoadingStatus {
  idle = "idle",
  loading = "loading",
  succeeded = "succeeded",
  failed = "failed",
}

export type Loan = {
  id?: string;
  lender: Person;
  borrower: Person;
  assetListing: Listing;
  term: Terms;
  createdAt?: string;
  updatedAt?: string;
};
