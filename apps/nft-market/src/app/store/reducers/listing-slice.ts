import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { isDev, loadState } from "@fantohm/shared-web3";
import { Asset, BackendLoadingStatus, Listing } from "../../types/backend-types";
import { ListingAsyncThunk, ListingQueryAsyncThunk } from "./interfaces";
import { BackendApi } from "../../api";
import { RootState } from "..";
import { updateAssets } from "./asset-slice";

export type Listings = {
  [listingId: string]: Listing;
};

export type ListingLoadStatus = {
  [key: string]: BackendLoadingStatus;
};

export interface ListingState {
  readonly listingsLoadStatus: BackendLoadingStatus;
  readonly listings: Listings;
  readonly isDev: boolean;
  readonly loadListingStatus: ListingLoadStatus;
  readonly createListingStatus: BackendLoadingStatus;
}

const cacheTime = 300 * 1000; // 5 minutes

/*
loadListings: loads all listings
params:
- networkId: number
- address: string
- provider: JsonRpcProvider
returns: void
*/
export const loadListings = createAsyncThunk(
  "listings/loadListings",
  async (
    { queryParams = { skip: 0, take: 50 } }: ListingQueryAsyncThunk,
    { getState, rejectWithValue, dispatch }
  ) => {
    //const signature = await handleSignMessage(address, provider);
    const thisState: any = getState();
    if (thisState.backend.authSignature) {
      const listings: Listing[] = await BackendApi.getListings(
        queryParams,
        thisState.backend.authSignature
      );
      // listings come with assets, might as well update since we have it already
      const listingAssets: Asset[] = listings.map((listing: Listing) => listing.asset);
      dispatch(updateAssets(listingAssets));
      return listings;
    } else {
      return rejectWithValue("No authorization found.");
    }
  }
);

/*
createListing: loads all listings
params:
- networkId: number
- address: string
- provider: JsonRpcProvider
returns: void
*/
export const createListing = createAsyncThunk(
  "listings/createListing",
  async ({ asset, terms }: ListingAsyncThunk, { getState, rejectWithValue }) => {
    console.log("backend-slice: createListing");
    const thisState: any = getState();
    if (thisState.backend.authSignature) {
      if (!BackendApi.createListing(thisState.backend.authSignature, asset, terms)) {
        return rejectWithValue("Failed to create listing");
      }
      return true;
    } else {
      console.warn("no auth");
      return rejectWithValue("No authorization found.");
    }
  }
);

/* 
loadListing: loads individual listing
params: 
- asset: Asset
returns: Listing
*/
export const loadListing = createAsyncThunk(
  "listings/loadListing",
  async (listingId: string, { getState, rejectWithValue, dispatch }) => {
    console.log("loadListing called");
    if (!listingId) {
      console.log("no id");
      return rejectWithValue("No openseaId");
    }
    const thisState: any = getState();
    if (thisState.backend.authSignature) {
      const listing: Listing = await BackendApi.getListing(
        listingId,
        thisState.backend.authSignature
      );

      return listing;
    } else {
      return rejectWithValue("No authorization found.");
    }
  }
);

// initial wallet slice state
const previousState = loadState("listings");
const initialState: ListingState = {
  listings: [],
  ...previousState, // overwrite assets and currencies from cache if recent
  isDev: isDev(),
  loadListingStatus: [],
  listingsLoadStatus: BackendLoadingStatus.idle,
  createListingStatus: BackendLoadingStatus.idle,
};

// create slice and initialize reducers
const listingsSlice = createSlice({
  name: "listings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadListings.pending, (state, action) => {
      state.listingsLoadStatus = BackendLoadingStatus.loading;
    });
    builder.addCase(loadListings.fulfilled, (state, action: PayloadAction<Listing[]>) => {
      state.listingsLoadStatus = BackendLoadingStatus.succeeded;
      action.payload.forEach((newListing: Listing) => {
        if (newListing.id) {
          state.listings[newListing.id] = {
            ...state.listings[newListing.id],
            ...newListing,
          };
        }
      });
    });
    builder.addCase(loadListings.rejected, (state, action) => {
      state.listingsLoadStatus = BackendLoadingStatus.failed;
    });
    builder.addCase(createListing.pending, (state, action) => {
      state.createListingStatus = BackendLoadingStatus.loading;
    });
    builder.addCase(createListing.fulfilled, (state, action) => {
      state.createListingStatus = BackendLoadingStatus.succeeded;
    });
    builder.addCase(createListing.rejected, (state, action) => {
      state.createListingStatus = BackendLoadingStatus.failed;
    });
    builder.addCase(loadListing.pending, (state, action) => {
      state.loadListingStatus[action.meta.arg] = BackendLoadingStatus.loading;
    });
    builder.addCase(loadListing.fulfilled, (state, action: PayloadAction<Listing>) => {
      const currentListing = action.payload;
      if (currentListing.id) {
        state.loadListingStatus[currentListing.id] = BackendLoadingStatus.succeeded;
        state.listings[currentListing.id] = {
          ...state.listings[currentListing.id],
          ...currentListing,
        };
      }
    });
    builder.addCase(loadListing.rejected, (state, action) => {
      state.loadListingStatus[action.meta.arg] = BackendLoadingStatus.failed;
    });
  },
});

export const listingsReducer = listingsSlice.reducer;
// actions are automagically generated and exported by the builder/thunk
//export const { } = listingsReducer.actions;

const baseInfo = (state: RootState) => state.listings;
export const getListingState = createSelector(baseInfo, (listings) => listings);
