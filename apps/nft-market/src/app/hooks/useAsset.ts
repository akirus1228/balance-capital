import { useState, useEffect } from "react";
import {
  Asset,
  AssetLoadStatus,
  BackendLoadingStatus,
  loadAsset,
  loadWalletAssets,
  useWeb3Context,
} from "@fantohm/shared-web3";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";

export const useAsset = (
  contractAddress: string | undefined,
  tokenId: string | undefined
): Asset | null => {
  console.log("useAsset");
  const dispatch = useDispatch();
  const wallet = useSelector((state: RootState) => state.wallet);
  const backendLoadStatus = useSelector((state: RootState) =>
    state.nftMarketplace.loadAssetStatus.find(
      (assetLoadStatus: AssetLoadStatus) =>
        assetLoadStatus.assetId === `${tokenId}:::${contractAddress}`
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
    // console.log("loadAsset effect");
    // console.log(`chainId ${chainId}`);
    // console.log(`address ${address}`);
    // console.log(`wallet.assetStatus ${wallet.assetStatus}`);
    // console.log(`backendLoadStatus?.status ${backendLoadStatus?.status}`);
    // console.log(asset);
    if (
      asset &&
      chainId &&
      address && // is there an address?
      wallet.assetStatus === "succeeded" && // have we loaded from opensea already?
      (typeof asset.cacheExpire === "undefined" || asset.cacheExpire < Date.now()) && // is the asset needing a backend refresh?
      backendLoadStatus?.status !== BackendLoadingStatus.loading // is it already loading?
    ) {
      console.log("loadAsset");
      dispatch(loadAsset(asset));
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

  return asset || ({} as Asset);
};
