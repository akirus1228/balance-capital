// request types
export interface CreateListingRequest {
  asset: Asset | string;
  term: Terms | string; //convert term to term for api
  status: ListingStatus;
}

// response types
export type LoginResponse = User;

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
  name?: string;
  email?: string;
  description?: string;
  profileImageUrl?: string;
} & StandardBackendObject;

export type Owner = {
  id?: string;
  address: string;
  name?: string;
  email?: string;
  description?: string;
  profileImageUrl?: string;
} & StandardBackendObject;

export type User = Person;

export type Terms = {
  id?: string;
  amount: number;
  apr: number;
  duration: number;
  expirationAt: Date;
  signature: string;
} & StandardBackendObject;

export enum ListingStatus {
  Pending = "PENDING",
  Listed = "LISTED",
  Completed = "COMPLETED",
  Cancelled = "CANCELLED",
}

export type IncludesTerms = {
  term: Terms;
};

export type IncludesTerm = {
  term: Terms;
};

export type Listing = {
  id?: string;
  asset: Asset;
  status: ListingStatus;
  cacheExpire?: number;
} & StandardBackendObject &
  IncludesTerms;

export type Chain = "eth" | "sol";

export type BackendAsset = {
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
} & StandardBackendObject;

export type Asset = BackendAsset & {
  collection: Collection;
};

export type Collection = {
  banner_image_url?: string;
  chat_url?: string;
  created_date: string;
  default_to_fiat: boolean;
  description?: string;
  dev_buyer_fee_basis_points: number;
  dev_seller_fee_basis_points: number;
  discord_url?: string;
  display_data: { card_display_style: string; images: string[] };
  external_url?: string;
  featured: boolean;
  featured_image_url?: string;
  hidden: boolean;
  image_url?: string;
  instagram_username?: string;
  is_nsfw: boolean;
  is_subject_to_whitelist: boolean;
  large_image_url?: string;
  medium_username?: string;
  name: string;
  only_proxied_transfers: boolean;
  opensea_buyer_fee_basis_points: number;
  opensea_seller_fee_basis_points: number;
  payout_address?: string;
  require_email: boolean;
  safelist_request_status?: string;
  short_description?: string;
  slug: string;
  telegram_url?: string;
  twitter_username?: string;
  wiki_url?: string;
};

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
} & StandardBackendObject;

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

export enum LoanStatus {
  Active = "ACTIVE",
  Default = "DEFAULT",
  Complete = "COMPLETE",
}

export type Loan = {
  id?: string;
  lender: Person;
  borrower: Person;
  assetListing: Listing;
  term: Terms;
  status: LoanStatus;
} & StandardBackendObject;

export type Updatable = {
  updatedAt?: string;
};

export type Deleteable = {
  deletedAt?: string;
};

export type Creatable = {
  createdAt?: string;
};

export type StandardBackendObject = Updatable & Creatable & Deleteable;

export type Offer = {
  id?: string;
  lender: User;
  assetListing: Listing;
  term: Terms;
} & StandardBackendObject;

export type BackendStandardQuery = {
  skip: number;
  take: number;
};

export type BackendAssetQueryParams = {
  status?: string;
  openseaIds?: string[];
  contractAddress?: string;
  mediaType?: string;
} & BackendStandardQuery;

export type BackendLoanQueryParams = {
  assetId?: string;
  assetListingId?: string;
  lenderAddress?: string;
  borrowerAddress?: string;
  status?: LoanStatus;
} & BackendStandardQuery;

export type BackendOfferQueryParams = {
  assetId: string;
  assetListingId: string;
  lenderAddress: string;
  borrowerAddress: string;
} & BackendStandardQuery;
