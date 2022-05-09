// external libs
import axios, { AxiosResponse } from "axios";
import { JsonRpcProvider } from "@ethersproject/providers";

// internal libs
import {
  AllAssetsResponse,
  AllListingsResponse,
  Asset,
  AssetStatus,
  CreateAssetResponse,
  CreateListingRequest,
  Listing,
  ListingStatus,
  LoginResponse,
  Terms,
} from "./backend-types";

export const WEB3_SIGN_MESSAGE =
  "This application uses this cryptographic signature, verifying that you are the owner of this address.";
// TODO: use production env to determine correct endpoint
export const NFT_MARKETPLACE_API_URL =
  "https://usdb-nft-lending-backend.herokuapp.com/api";

export const doLogin = (address: string): Promise<LoginResponse> => {
  const url = `${NFT_MARKETPLACE_API_URL}/auth/login`;
  return axios.post(url, { address }).then((resp: AxiosResponse<LoginResponse>) => {
    console.log(resp);
    return resp.data;
  });
};

export const getAsset = (assetId: string, signature: string): Promise<Asset> => {
  // console.log(address);
  const url = `${NFT_MARKETPLACE_API_URL}/asset/${assetId}`;
  // console.log(url);
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${signature}`,
      },
    })
    .then((resp: AxiosResponse<AllAssetsResponse>) => {
      console.log("");
      console.log(resp);
      return resp.data.data[0];
    })
    .catch((err) => {
      // most likely a 400 (not in our database)
      console.log("Error found");
      console.log(err);
      return {} as Asset;
    });
};

export const getAssetFromOpenseaId = (
  openseaId: string,
  signature: string
): Promise<Asset> => {
  // console.log(address);
  const url = `${NFT_MARKETPLACE_API_URL}/asset/all?openseaIds=${openseaId}`;
  // console.log(url);
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${signature}`,
      },
    })
    .then((resp: AxiosResponse<AllAssetsResponse>) => {
      return resp.data.data[0];
    })
    .catch((err) => {
      // most likely a 400 (not in our database)
      console.log("Error found");
      console.log(err);
      return {} as Asset;
    });
};

export const postAsset = (asset: Asset, signature: string): Promise<Asset> => {
  // console.log(address);
  const url = `${NFT_MARKETPLACE_API_URL}/asset`;
  return axios
    .post(url, asset, {
      headers: {
        Authorization: `Bearer ${signature}`,
      },
    })
    .then((resp: AxiosResponse<CreateAssetResponse>) => {
      console.log("");
      console.log(resp);
      return resp.data.asset;
    })
    .catch((err) => {
      // most likely a 400 (not in our database)
      console.log("Error found");
      console.log(err);
      return {} as Asset;
    });
};

export const getListings = (address: string, signature: string): Promise<Listing[]> => {
  // console.log(address);
  const url = `${NFT_MARKETPLACE_API_URL}/asset-listing/all`;
  // console.log(url);
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${signature}`,
      },
    })
    .then((resp: AxiosResponse<AllListingsResponse>) => {
      // console.log(resp);
      return resp.data.data;
    });
};

export const createListing = (
  signature: string,
  asset: Asset,
  terms: Terms
): Promise<Listing[] | boolean> => {
  const url = `${NFT_MARKETPLACE_API_URL}/asset-listing`;
  const listingParams = listingToCreateListingRequest(asset, terms);
  // post
  return axios
    .post(url, listingParams, {
      headers: {
        Authorization: `Bearer ${signature}`,
      },
    })
    .then((resp: AxiosResponse<any>) => {
      console.log(resp);
      return resp.data;
    })
    .catch((err: any) => {
      console.log(err);
      return false;
    });
};

export const handleSignMessage = (
  address: string,
  provider: JsonRpcProvider
): Promise<string> | void => {
  try {
    const signer = provider.getSigner(address);
    return signer.signMessage(WEB3_SIGN_MESSAGE);
  } catch (err) {
    console.warn(err);
  }
};

const listingToCreateListingRequest = (
  asset: Asset,
  terms: Terms
): CreateListingRequest => {
  // convert terms to term
  const tempListing: CreateListingRequest = {
    asset: asset,
    term: terms,
    status: ListingStatus.LISTED,
  };
  // if the asset isn't in the database we need to pass the asset without the ID
  // if the asset is in the database we need to pass just the ID
  if (
    typeof tempListing.asset !== "string" &&
    tempListing.asset.status === AssetStatus.New
  ) {
    delete tempListing.asset.id;
    tempListing.asset.status = AssetStatus.Listed;
  } else if (
    typeof tempListing.asset !== "string" &&
    tempListing.asset.status !== AssetStatus.New &&
    tempListing.asset.id
  ) {
    tempListing.asset = tempListing.asset.id;
  }

  return tempListing;
};
