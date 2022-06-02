// external libs
import axios, { AxiosResponse } from "axios";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { JsonRpcProvider } from "@ethersproject/providers";

// internal libs
import {
  AllAssetsResponse,
  AllListingsResponse,
  Asset,
  CreateAssetResponse,
  CreateListingRequest,
  AllNotificationsResponse,
  ApiResponse,
  EditNotificationRequest,
  Listing,
  LoginResponse,
  Terms,
  Notification,
  NotificationStatus,
  CreateListingResponse,
  Loan,
  Offer,
  BackendAssetQueryParams,
  BackendLoanQueryParams,
  BackendOfferQueryParams,
  BackendStandardQuery,
  PlatformWalletInfo,
  BackendNotificationQueryParams,
} from "../types/backend-types";
import { ListingQueryParam } from "../store/reducers/interfaces";
import { RootState } from "../store";
import {
  assetAryToAssets,
  dropHelperDates,
  listingAryToListings,
  listingToCreateListingRequest,
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
      return { ...listing, term: term };
    });
};

export const createListing = (
  signature: string,
  asset: Asset,
  term: Terms
): Promise<Listing | boolean> => {
  const url = `${NFT_MARKETPLACE_API_URL}/asset-listing`;
  const listingParams = listingToCreateListingRequest(asset, term);
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

const createListingResponseToListing = (
  createListingResponse: CreateListingResponse
): Listing => {
  const { term, ...listing } = createListingResponse;
  return { ...listing, term: term };
};

const notificationDateOldestFirst = (a: Notification, b: Notification): number => {
  if (!a.createdAt || !b.createdAt) return 0;
  return Date.parse(b.createdAt) - Date.parse(a.createdAt);
};

const standardQueryParams: BackendStandardQuery = {
  skip: 0,
  take: 50,
};

export const backendApi = createApi({
  reducerPath: "backendApi",
  tagTypes: [
    "Asset",
    "Listing",
    "Loan",
    "Notification",
    "Offer",
    "Order",
    "PlatformWalletInfo",
    "Terms",
    "User",
  ],
  baseQuery: fetchBaseQuery({
    baseUrl: NFT_MARKETPLACE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const signature = (getState() as RootState).backend.authSignature;
      headers.set("authorization", `Bearer ${signature}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Assets
    getAssets: builder.query<Asset[], Partial<BackendAssetQueryParams>>({
      query: (queryParams) => ({
        url: `asset/all`,
        params: {
          ...standardQueryParams,
          ...queryParams,
        },
      }),
      transformResponse: (response: AllAssetsResponse, meta, arg) => response.data,
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const { data }: { data: Asset[] } = await queryFulfilled;
        dispatch(updateAssets(assetAryToAssets(data)));
      },
      providesTags: (result, error, queryParams) =>
        result
          ? [...result.map(({ id }) => ({ type: "Asset" as const, id })), "Asset"]
          : ["Asset"],
    }),
    getAsset: builder.query<Asset, string | undefined>({
      query: (id) => ({
        url: `asset/${id}`,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const { data }: { data: Asset } = await queryFulfilled;
        dispatch(updateAsset(data));
      },
      providesTags: ["Asset"],
    }),
    deleteAsset: builder.mutation<Asset, Partial<Asset> & Pick<Asset, "id">>({
      query: ({ id, ...asset }) => {
        return {
          url: `asset/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (result, error, arg) => [{ type: "Asset", id: arg.id }],
    }),
    // Listings
    getListings: builder.query<Listing[], Partial<ListingQueryParam>>({
      query: (queryParams) => ({
        url: `asset-listing/all`,
        params: {
          ...standardQueryParams,
          ...queryParams,
        },
      }),
      transformResponse: (response: AllListingsResponse, meta, arg) =>
        response.data.map((listing: Listing) => {
          const { term, ...formattedListing } = listing;
          return { ...formattedListing, term: term } as Listing;
        }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const { data }: { data: Listing[] } = await queryFulfilled;
        const assets = data.map((listing: Listing) => listing.asset);
        dispatch(updateListings(listingAryToListings(data)));
        dispatch(updateAssets(assetAryToAssets(assets)));
      },
      providesTags: (result, error, queryParams) =>
        result
          ? [...result.map(({ id }) => ({ type: "Listing" as const, id })), "Listing"]
          : ["Listing"],
    }),
    createListing: builder.mutation<CreateListingRequest, Partial<CreateListingRequest>>({
      query: (body) => {
        return {
          url: `asset-listing`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Listing", "Asset", "Terms"],
    }),
    deleteListing: builder.mutation<Listing, Partial<Listing> & Pick<Listing, "id">>({
      query: ({ id, ...listing }) => {
        return {
          url: `asset-listing/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Listing", "Asset", "Terms"],
    }),
    // Terms
    getTerms: builder.query<Terms[], Partial<BackendStandardQuery>>({
      query: (queryParams) => ({
        url: `term/all`,
        params: {
          ...standardQueryParams,
          ...queryParams,
        },
      }),
      transformResponse: (response: { count: number; data: Terms[] }, meta, arg) =>
        response.data,
      providesTags: (result, error, queryParams) =>
        result
          ? [...result.map(({ id }) => ({ type: "Terms" as const, id })), "Terms"]
          : ["Terms"],
    }),
    updateTerms: builder.mutation<Terms, Partial<Terms> & Pick<Terms, "id">>({
      query: ({ id, ...patch }) => ({
        url: `term/${id}`,
        method: "PUT",
        body: { ...patch, id },
      }),
      transformResponse: (response: Terms, meta, arg) => response,
      invalidatesTags: ["Terms", "Listing", "Offer"],
    }),
    deleteTerms: builder.mutation<Terms, Partial<Terms> & Pick<Terms, "id">>({
      query: ({ id, ...terms }) => {
        return {
          url: `term/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Listing", "Terms", "Offer"],
    }),
    // Loans
    getLoans: builder.query<Loan[], Partial<BackendLoanQueryParams>>({
      query: (queryParams) => ({
        url: `loan/all`,
        params: {
          ...standardQueryParams,
          ...queryParams,
        },
      }),
      transformResponse: (response: { count: number; data: Loan[] }, meta, arg) =>
        response.data,
      providesTags: (result, error, queryParams) =>
        result
          ? [...result.map(({ id }) => ({ type: "Loan" as const, id })), "Loan"]
          : ["Loan"],
    }),
    createLoan: builder.mutation<Loan, Loan>({
      query: ({ id, borrower, lender, assetListing, term, ...loan }) => {
        const { collection, ...asset } = dropHelperDates({ ...assetListing.asset }); // backend doesn't like collection
        const loanRequest = {
          ...loan,
          assetListing: {
            ...dropHelperDates({ ...assetListing }),
            asset: dropHelperDates({ ...asset }),
            term: dropHelperDates({ ...assetListing.term }),
          },
          borrower: dropHelperDates({ ...borrower }),
          lender: dropHelperDates({ ...lender }),
          term: dropHelperDates({ ...term }),
        };
        return {
          url: `loan`,
          method: "POST",
          body: loanRequest,
        };
      },
      invalidatesTags: ["Loan", "Asset", "Listing", "Terms"],
    }),
    updateLoan: builder.mutation<Loan, Partial<Loan> & Pick<Loan, "id">>({
      query: ({ id, ...patch }) => ({
        url: `loan/${id}`,
        method: "PUT",
        body: { ...patch, id },
      }),
      transformResponse: (response: Loan, meta, arg) => response,
      invalidatesTags: ["Listing", "Offer", "Loan", "Asset"],
    }),
    deleteLoan: builder.mutation<Loan, Partial<Loan> & Pick<Loan, "id">>({
      query: ({ id, ...loan }) => {
        return {
          url: `loan/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Loan", "Asset", "Listing", "Terms"],
    }),
    // Offers
    getOffers: builder.query<Offer[], Partial<BackendOfferQueryParams>>({
      query: (queryParams) => ({
        url: `offer/all`,
        params: {
          ...standardQueryParams,
          ...queryParams,
        },
      }),
      transformResponse: (response: { count: number; data: Offer[] }, meta, arg) =>
        response.data,
      providesTags: (result, error, queryParams) =>
        result
          ? [...result.map(({ id }) => ({ type: "Offer" as const, id })), "Offer"]
          : ["Offer"],
    }),
    createOffer: builder.mutation<Offer, Partial<Offer>>({
      query: (body) => {
        return {
          url: `offer`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Offer"],
    }),
    updateOffer: builder.mutation<Offer, Partial<Offer> & Pick<Offer, "id">>({
      query: ({ id, ...patch }) => ({
        url: `offer/${id}`,
        method: "PUT",
        body: { ...patch, id },
      }),
      transformResponse: (response: Offer, meta, arg) => response,
      invalidatesTags: ["Terms", "Listing", "Offer"],
    }),
    deleteOffer: builder.mutation<Offer, Partial<Offer> & Pick<Offer, "id">>({
      query: ({ id, ...offer }) => {
        return {
          url: `offer/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Asset", "Listing", "Terms", "Offer"],
    }),
    // User Notifications
    getUserNotifications: builder.query<
      Notification[],
      Partial<BackendNotificationQueryParams>
    >({
      query: (queryParams) => ({
        url: `user-notification/all`,
        params: {
          ...standardQueryParams,
          ...queryParams,
        },
      }),
      transformResponse: (response: { count: number; data: Notification[] }, meta, arg) =>
        response.data.sort(notificationDateOldestFirst),
      providesTags: (result, error, queryParams) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Notification" as const, id })),
              "Notification",
            ]
          : ["Notification"],
    }),
    updateUserNotification: builder.mutation<
      Notification,
      Partial<Notification> & Pick<Notification, "id">
    >({
      query: ({ id, ...patch }) => ({
        url: `user-notification/${id}`,
        method: "PUT",
        body: { ...patch, id },
      }),
      transformResponse: (response: Notification, meta, arg) => response,
      invalidatesTags: ["Notification"],
    }),
    // Wallet
    getWallet: builder.query<PlatformWalletInfo, string | undefined>({
      query: (walletAddress) => ({
        url: `wallet/${walletAddress}`,
      }),
      providesTags: ["PlatformWalletInfo"],
    }),
  }),
});

export const {
  useGetAssetQuery,
  useGetAssetsQuery,
  useDeleteAssetMutation,
  useGetListingsQuery,
  useDeleteListingMutation,
  useGetLoansQuery,
  useCreateLoanMutation,
  useUpdateLoanMutation,
  useDeleteLoanMutation,
  useCreateListingMutation,
  useGetTermsQuery,
  useUpdateTermsMutation,
  useDeleteTermsMutation,
  useGetOffersQuery,
  useCreateOfferMutation,
  useUpdateOfferMutation,
  useDeleteOfferMutation,
  useGetWalletQuery,
  useGetUserNotificationsQuery,
  useUpdateUserNotificationMutation,
} = backendApi;
