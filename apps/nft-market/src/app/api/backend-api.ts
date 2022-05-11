// external libs
import axios, { AxiosResponse } from "axios";
import { JsonRpcProvider } from "@ethersproject/providers";

// internal libs
import {
  AllAssetsResponse,
  AllListingsResponse,
  Asset,
  AssetStatus,
  BackendListing,
  CreateAssetResponse,
  CreateListingRequest,
  AllNotificationsResponse,
  ApiResponse,
  EditNotificationRequest,
  Listing,
  ListingStatus,
  LoginResponse,
  Terms,
  Notification,
  NotificationStatus,
} from "../types/backend-types";

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
  openseaIds: string[],
  signature: string
): Promise<Asset[]> => {
  // console.log(address);
  const url = `${NFT_MARKETPLACE_API_URL}/asset/all?openseaIds=${openseaIds.join(",")}`;
  // console.log(url);
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${signature}`,
      },
    })
    .then((resp: AxiosResponse<AllAssetsResponse>) => {
      return resp.data.data;
    })
    .catch((err) => {
      // most likely a 400 (not in our database)
      console.log("Error found");
      console.log(err);
      return [{}] as Asset[];
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

export const getListings = (
  skip = 0,
  limit = 50,
  signature: string
): Promise<Listing[]> => {
  // console.log(address);
  const url = `${NFT_MARKETPLACE_API_URL}/asset-listing/all?skip=${skip}&limit=${limit}`;
  // console.log(url);
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${signature}`,
      },
    })
    .then((resp: AxiosResponse<AllListingsResponse>) => {
      // console.log(resp);
      return resp.data.data.map((listing: BackendListing) => {
        const { term, ...formattedListing } = listing;
        return { ...formattedListing, terms: term } as Listing;
      });
    });
};

export const getListing = (listingId: string, signature: string): Promise<Listing> => {
  // console.log(address);
  const url = `${NFT_MARKETPLACE_API_URL}/asset-listing/${listingId}`;
  // console.log(url);
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${signature}`,
      },
    })
    .then((resp: AxiosResponse<AllListingsResponse>) => {
      const { term, ...listing } = resp.data.data[0];
      return { ...listing, terms: term };
    });
};

export const getListingByOpenseaIds = (
  openseaIds: string[],
  signature: string
): Promise<Listing> => {
  // console.log(address);
  const url = `${NFT_MARKETPLACE_API_URL}/asset-listing/all?openseaId=${openseaIds.join(
    ","
  )}`;
  // console.log(url);
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${signature}`,
      },
    })
    .then((resp: AxiosResponse<AllListingsResponse>) => {
      // console.log(resp);
      const { term, ...listing } = resp.data.data[0];
      return { ...listing, terms: term };
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
    status: ListingStatus.Listed,
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

export const getNotifications = (
  address: string,
  signature: string
): Promise<AllNotificationsResponse> => {
  // console.log(address);
  const url = `${NFT_MARKETPLACE_API_URL}/user-notification/all`;
  // console.log(url);
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${signature}`,
      },
    })
    .then((resp: AxiosResponse<AllNotificationsResponse>) => {
      // console.log(resp);
      return resp.data;
    });
};

export const deleteNotification = async (
  address: string,
  signature: string,
  id: string | undefined
): Promise<ApiResponse | null> => {
  // console.log(address);
  if (typeof id !== "string") return null;
  const url = `${NFT_MARKETPLACE_API_URL}/user-notification/${id}`;
  // console.log(url);
  return await axios
    .delete(url, {
      headers: {
        Authorization: `Bearer ${signature}`,
      },
    })
    .then((resp: AxiosResponse<ApiResponse>) => {
      // console.log(resp);
      return resp.data;
    });
};

export const markAsRead = async (
  address: string,
  signature: string,
  notification: Notification | undefined
): Promise<ApiResponse | null> => {
  // console.log(address);
  if (!notification || typeof notification.id !== "string") return null;
  const url = `${NFT_MARKETPLACE_API_URL}/user-notification/${notification.id}`;
  // console.log(url);
  const putParams: EditNotificationRequest = {
    id: notification.id,
    importance: notification.importance,
    message: notification.message,
    status: NotificationStatus.Read,
  };
  return await axios
    .put(url, putParams, {
      headers: {
        Authorization: `Bearer ${signature}`,
      },
    })
    .then((resp: AxiosResponse<ApiResponse>) => {
      // console.log(resp);
      return resp.data;
    });
};
