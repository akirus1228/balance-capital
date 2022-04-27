// external libs
import axios, { AxiosResponse } from "axios";
import { JsonRpcProvider, Provider } from "@ethersproject/providers";

// internal libs
import { AllListingsResponse, AssetListingRequest, Listing, LoginResponse } from "./backend-types";

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
  address: string,
  signature: string,
  listing: Listing
): Promise<Listing[]> => {
  // console.log(address);
  const url = `${NFT_MARKETPLACE_API_URL}/asset-listing`;
  // console.log(url);
  const postParams: AssetListingRequest = {
    ...listing,
  };
  return axios
    .post(url, postParams, {
      headers: {
        Authorization: `Bearer ${signature}`,
      },
    })
    .then((resp: AxiosResponse<AllListingsResponse>) => {
      // console.log(resp);
      return resp.data.data;
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

export default getListings;
