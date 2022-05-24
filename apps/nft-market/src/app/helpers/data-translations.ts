import { assetToCollectible, Collectible } from "@fantohm/shared/fetch-nft";
import { OpenseaAsset } from "../api/opensea";
import { Assets, assetToAssetId } from "../store/reducers/asset-slice";
import { Listings } from "../store/reducers/listing-slice";
import {
  Asset,
  AssetStatus,
  CreateListingRequest,
  Listing,
  ListingStatus,
  StandardBackendObject,
  Terms,
} from "../types/backend-types";

// convert asset data from opensea to our internal type
export const openseaAssetToAsset = async (
  openseaAsset: OpenseaAsset[]
): Promise<Asset[]> => {
  const collectibles = await Promise.all(
    openseaAsset.map(async (asset) => await assetToCollectible(asset))
  );
  // convertCollectible to Asset
  const walletContents = collectibles.map((collectible: Collectible): Asset => {
    const { id, ...tmpCollectible } = collectible;
    const asset = {
      ...tmpCollectible,
      openseaLoaded: Date.now() + 300 * 1000,
      status: AssetStatus.New,
    } as Asset;
    return asset;
  });

  return walletContents;
};

// convert Asset[] to Assets
export const assetAryToAssets = (assetAry: Asset[]): Assets => {
  const assets: Assets = {};
  assetAry.forEach((asset: Asset) => {
    assets[assetToAssetId(asset)] = asset;
  });
  return assets;
};

// convert Listing[] to Listings
export const listingAryToListings = (listingAry: Listing[]): Listings => {
  const listings: Listings = {};
  listingAry.forEach((listing: Listing) => {
    listings[listing.id || ""] = listing;
  });
  return listings;
};

export const dropHelperDates = <T extends StandardBackendObject>(obj: T): T => {
  if (obj.updatedAt) obj.updatedAt = undefined;
  if (obj.createdAt) obj.createdAt = undefined;
  return obj;
};

export const listingToCreateListingRequest = (
  asset: Asset,
  term: Terms
): CreateListingRequest => {
  // convert term to term
  const tempListing: CreateListingRequest = {
    asset: asset,
    term: term,
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
