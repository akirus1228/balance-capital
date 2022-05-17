// external libs
import axios, { AxiosResponse } from "axios";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
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
  CreateListingResponse,
  Loan,
} from "../types/backend-types";
import { BackendAssetQueryParam, ListingQueryParam } from "../store/reducers/interfaces";
import { objectToQueryParams } from "@fantohm/shared-helpers";
import { RootState } from "../store";
import {
  assetAryToAssets,
  dropHelperDates,
  listingAryToListings,
} from "../helpers/data-translations";
import { updateAsset, updateAssets } from "../store/reducers/asset-slice";
import { updateListings } from "../store/reducers/listing-slice";

export const WEB3_SIGN_MESSAGE =
  "This application uses this cryptographic signature, verifying that you are the owner of this address.";
// TODO: use production env to determine correct endpoint
export const NFT_MARKETPLACE_API_URL =
  "https://usdb-nft-lending-backend.herokuapp.com/api";

export const doLogin = (address: string): Promise<LoginResponse> => {
  const url = `${NFT_MARKETPLACE_API_URL}/auth/login`;
  return axios.post(url, { address }).then((resp: AxiosResponse<LoginResponse>) => {
    return resp.data;
  });
};

export const postAsset = (asset: Asset, signature: string): Promise<Asset> => {
  const url = `${NFT_MARKETPLACE_API_URL}/asset`;
  return axios
    .post(url, asset, {
      headers: {
        Authorization: `Bearer ${signature}`,
      },
    })
    .then((resp: AxiosResponse<CreateAssetResponse>) => {
      return resp.data.asset;
    })
    .catch((err) => {
      // most likely a 400 (not in our database)

      return {} as Asset;
    });
};

export const getListingByOpenseaIds = (
  openseaIds: string[],
  signature: string
): Promise<Listing> => {
  const url = `${NFT_MARKETPLACE_API_URL}/asset-listing/all?openseaId=${openseaIds.join(
    ","
  )}`;

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

export const createListing = (
  signature: string,
  asset: Asset,
  terms: Terms
): Promise<Listing | boolean> => {
  const url = `${NFT_MARKETPLACE_API_URL}/asset-listing`;
  const listingParams = listingToCreateListingRequest(asset, terms);
  // post
  return axios
    .post(url, listingParams, {
      headers: {
        Authorization: `Bearer ${signature}`,
      },
    })
    .then((resp: AxiosResponse<CreateListingResponse>) => {
      return createListingResponseToListing(resp.data);
    })
    .catch((err: AxiosResponse) => {
      return false;
    });
};

export const handleSignMessage = (
  address: string,
  provider: JsonRpcProvider
): Promise<string> | string => {
  try {
    const signer = provider.getSigner(address);
    return signer.signMessage(WEB3_SIGN_MESSAGE);
  } catch (err) {
    return "";
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
  }

  return tempListing;
};

const createListingResponseToListing = (
  createListingResponse: CreateListingResponse
): Listing => {
  const { term, ...listing } = createListingResponse;
  return { ...listing, terms: term };
};

export const getNotifications = (
  address: string,
  signature: string
): Promise<AllNotificationsResponse> => {
  const url = `${NFT_MARKETPLACE_API_URL}/user-notification/all`;

  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${signature}`,
      },
    })
    .then((resp: AxiosResponse<AllNotificationsResponse>) => {
      return resp.data;
    });
};

export const deleteNotification = async (
  address: string,
  signature: string,
  id: string | undefined
): Promise<ApiResponse | null> => {
  if (typeof id !== "string") return null;
  const url = `${NFT_MARKETPLACE_API_URL}/user-notification/${id}`;

  return await axios
    .delete(url, {
      headers: {
        Authorization: `Bearer ${signature}`,
      },
    })
    .then((resp: AxiosResponse<ApiResponse>) => {
      return resp.data;
    });
};

export const markAsRead = async (
  address: string,
  signature: string,
  notification: Notification | undefined
): Promise<ApiResponse | null> => {
  if (!notification || typeof notification.id !== "string") return null;
  const url = `${NFT_MARKETPLACE_API_URL}/user-notification/${notification.id}`;

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
      return resp.data;
    });
};

export const backendApi = createApi({
  reducerPath: "backendApi",
  baseQuery: fetchBaseQuery({
    baseUrl: NFT_MARKETPLACE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const signature = (getState() as RootState).backend.authSignature;
      headers.set("authorization", `Bearer ${signature}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getListings: builder.query<Listing[], ListingQueryParam>({
      query: (queryParams) => ({
        url: `asset-listing/all`,
        params: queryParams,
      }),
      transformResponse: (response: AllListingsResponse, meta, arg) =>
        response.data.map((listing: BackendListing) => {
          const { term, ...formattedListing } = listing;
          return { ...formattedListing, terms: term } as Listing;
        }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const { data }: { data: Listing[] } = await queryFulfilled;
        const assets = data.map((listing: Listing) => listing.asset);
        dispatch(updateListings(listingAryToListings(data)));
        dispatch(updateAssets(assetAryToAssets(assets)));
      },
      // providesTags: (result, error, queryParams) => [
      //   { type: "Asset Listings", queryParams },
      // ],
    }),
    // getListing: builder.query<Listing, string>({
    //   query: (id) => ({
    //     url: `asset-listing/${id}`,
    //   }),
    //   transformResponse: (response: AllListingsResponse, meta, arg) =>
    //     response.data.map((listing: BackendListing) => {
    //       const { term, ...formattedListing } = listing;
    //       return { ...formattedListing, terms: term } as Listing;
    //     }),
    //   async onQueryStarted(arg, { dispatch, queryFulfilled }) {
    //     const { data }: { data: Listing[] } = await queryFulfilled;
    //     const assets = data.map((listing: Listing) => listing.asset);
    //     dispatch(updateListings(listingAryToListings(data)));
    //     dispatch(updateAssets(assetAryToAssets(assets)));
    //   },
    //   // providesTags: (result, error, queryParams) => [
    //   //   { type: "Asset Listings", queryParams },
    //   // ],
    // }),
    getAssets: builder.query<Asset[], BackendAssetQueryParam>({
      query: (queryParams) => ({
        url: `asset/all`,
        params: queryParams,
      }),
      transformResponse: (response: AllAssetsResponse, meta, arg) => response.data,
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const { data }: { data: Asset[] } = await queryFulfilled;
        dispatch(updateAssets(assetAryToAssets(data)));
      },
    }),
    getAsset: builder.query<Asset, string | undefined>({
      query: (id) => ({
        url: `asset/${id}`,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const { data }: { data: Asset } = await queryFulfilled;
        dispatch(updateAsset(data));
      },
    }),
    createListing: builder.mutation<CreateListingRequest, Partial<CreateListingRequest>>({
      query: (body) => {
        return {
          url: `asset-listing`,
          method: "POST",
          body,
        };
      },
      // invalidatesTags: [{ type: "Asset Listings", id: "MINE" }],
    }),
    updateTerms: builder.mutation<Terms, Partial<Terms> & Pick<Terms, "id">>({
      query: ({ id, ...patch }) => ({
        url: `term/${id}`,
        method: "PUT",
        body: patch,
      }),
    }),
    createLoan: builder.mutation<Loan, Loan>({
      query: ({ id, ...loan }) => {
        const loanRequest = {
          ...loan,
          assetListing: listingToCreateListingRequest(
            dropHelperDates({ ...loan.assetListing.asset }),
            dropHelperDates({ ...loan.assetListing.terms })
          ),
        };
        return {
          url: `loan`,
          method: "POST",
          body: loanRequest,
        };
      },
    }),
  }),
});
export const {
  useGetAssetQuery,
  useGetAssetsQuery,
  // useGetListingQuery,
  useGetListingsQuery,
  useCreateLoanMutation,
  useCreateListingMutation,
  useUpdateTermsMutation,
} = backendApi;
