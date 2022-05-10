import { useEffect } from "react";
import {
  Asset,
  AssetLoadStatus,
  BackendLoadingStatus,
  Listing,
  loadListing,
  loadWalletAssets,
  useWeb3Context,
} from "@fantohm/shared-web3";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";

export const useListing = (
  contractAddress: string | undefined,
  tokenId: string | undefined
): Listing | null => {
  console.log("useListing");
  const dispatch = useDispatch();
  const wallet = useSelector((state: RootState) => state.wallet);
  const backendLoadStatus = useSelector((state: RootState) =>
    state.nftMarketplace.loadListingStatus.find(
      (listingLoadStatus: AssetLoadStatus) =>
        listingLoadStatus.assetId === `${tokenId}:::${contractAddress}`
    )
  );
  const listing = useSelector((state: RootState) =>
    state.nftMarketplace.listings.find(
      (listing: Listing) =>
        listing.asset.assetContractAddress === contractAddress &&
        listing.asset.tokenId === tokenId
    )
  );
  const asset = useSelector((state: RootState) =>
    state.wallet.assets.find(
      (walletAsset: Asset) =>
        walletAsset.assetContractAddress === contractAddress &&
        walletAsset.tokenId === tokenId
    )
  );
  const backend = useSelector((state: RootState) => state.nftMarketplace);
  const { chainId, address } = useWeb3Context();

  // if we haven't loaded wallet assets yet, do that
  useEffect(() => {
    if (
      chainId &&
      address &&
      (wallet.assetStatus === "idle" || wallet.assetStatus === "failed") &&
      wallet.nextOpenseaLoad < Date.now()
    ) {
      console.log("loading wallet assets");
      dispatch(loadWalletAssets({ address, networkId: chainId }));
    }
  }, [address, wallet.assetStatus, contractAddress, tokenId]);

  // wallet assets loaded from opensea
  // check the database for a match and merge in data
  useEffect(() => {
    if (
      tokenId &&
      chainId &&
      address && // is there an address?
      asset?.openseaId &&
      wallet.assetStatus === "succeeded" && // have we loaded from opensea already?
      (typeof listing?.cacheExpire === "undefined" ||
        listing?.cacheExpire < Date.now()) && // is the asset needing a backend refresh?
      backendLoadStatus?.status !== BackendLoadingStatus.loading // is it already loading?
    ) {
      console.log("loadListing");
      dispatch(loadListing(asset?.openseaId));
    }
  }, [
    address,
    wallet.assetStatus,
    backend.loadAssetStatus,
    asset?.openseaLoaded,
    contractAddress,
    tokenId,
    backendLoadStatus?.status,
  ]);

  return listing || ({} as Listing);
};
