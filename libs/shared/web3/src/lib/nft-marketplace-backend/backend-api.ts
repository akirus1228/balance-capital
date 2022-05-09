// external libs
import axios, { AxiosResponse } from "axios";
import { JsonRpcProvider } from "@ethersproject/providers";

// internal libs
import {
  AllListingsResponse,
  AllNotificationsResponse,
  ApiResponse,
  AssetListingRequest,
  EditNotificationRequest,
  Listing,
  LoginResponse,
  Notification,
  NotificationStatus,
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
  listing: Listing
): Promise<Listing[]> => {
  const url = `${NFT_MARKETPLACE_API_URL}/asset-listing`;
  const postParams: AssetListingRequest = {
    ...listing,
    term: listing.terms,
  };
  return axios
    .post(url, postParams, {
      headers: {
        Authorization: `Bearer ${signature}`,
      },
    })
    .then((resp: AxiosResponse<any>) => {
      console.log(resp);
      return resp.data;
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
