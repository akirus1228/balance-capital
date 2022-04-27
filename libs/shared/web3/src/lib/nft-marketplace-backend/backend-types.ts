import { Asset } from "../wallet/opensea";

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

// request types
export interface AssetListingRequest extends Listing {
  id?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

// data models
export type Terms = {
  id: string;
  amount: number;
  apr: number;
  duration: number;
  expirationAt: string;
  createdAt: string;
  updatedAt: string;
};

export interface Listing {
  asset: Asset;
  term: Terms;
}
