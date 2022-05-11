import { createSelector } from "@reduxjs/toolkit";
import { Asset, Listing, ListingStatus } from "../../types/backend-types";
import { Listings, ListingState } from "../reducers/listing-slice";

const selectListings: (listingState: ListingState) => Listings = (
  listingState: ListingState
) => listingState.listings;

const selectListingAsset = (listingState: ListingState, asset: Asset) => asset;
export const selectListingFromAsset = createSelector(
  [selectListings, selectListingAsset],
  (listings, asset) => {
    const key = Object.keys(listings).find((key: string) => {
      const rtn = listings[key].asset.assetContractAddress === asset.assetContractAddress;
      return rtn;
    });

    if (key) {
      return listings[key];
    } else {
      return {} as Listing;
    }
  }
);

const selectListingStatus = (listingState: ListingState, status: ListingStatus) => status;
export const selectListingByStatus = createSelector(
  [selectListings, selectListingStatus],
  (listings, status): Listing[] => {
    const matches = Object.entries(listings).filter(
      ([listingId, listing]) => listing.status === status
    );
    return matches.map(([listingId, listing]) => listing);
  }
);
