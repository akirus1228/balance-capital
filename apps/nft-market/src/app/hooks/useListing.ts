import { useState, useEffect } from "react";
import { Asset, loadAsset, loadWalletAssets, useWeb3Context } from "@fantohm/shared-web3";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";

export const useAsset = (
  contractAddress: string | undefined,
  tokenId: string | undefined
): Asset | null => {
  console.log("useAsset");
  const [asset, setAsset] = useState<Asset | null>(null);
  const dispatch = useDispatch();
  const wallet = useSelector((state: RootState) => state.wallet);
  const backend = useSelector((state: RootState) => state.nftMarketplace);
  const { chainId, address } = useWeb3Context();

  // if we haven't loaded wallet assets yet, do that
  useEffect(() => {
    if (
      chainId &&
      address &&
      (wallet.assetStatus === "idle" || wallet.assetStatus === "failed")
    ) {
      dispatch(loadWalletAssets({ address, networkId: chainId }));
    }
  }, [address, wallet.assetStatus, contractAddress, tokenId]);

  // wallet assets loaded from opensea
  // check the database for a match and merge in data
  useEffect(() => {
    console.log("loadAsset effect");
    console.log(`chainId ${chainId}`);
    console.log(`address ${address}`);
    console.log(`wallet.assetStatus ${wallet.assetStatus}`);
    console.log(`backend.loadAssetStatus ${backend.loadAssetStatus}`);
    console.log(`asset?.backendLoaded ${asset?.backendLoaded}`);
    console.log(asset);
    if (
      asset &&
      chainId &&
      address &&
      wallet.assetStatus === "succeeded" &&
      (backend.loadAssetStatus === "idle" || backend.loadAssetStatus === "failed") &&
      (typeof asset.backendLoaded === "undefined" || asset?.backendLoaded === false)
    ) {
      console.log("loadAsset");
      dispatch(loadAsset(asset));
    }
  }, [
    address,
    wallet.assetStatus,
    backend.loadAssetStatus,
    asset,
    contractAddress,
    tokenId,
  ]);

  // look in the wallet assets to see if our current target is found
  useEffect(() => {
    console.log("asset match effect");
    console.log(wallet.assets);
    const currentAsset = wallet.assets.filter(
      (asset) =>
        asset.assetContractAddress === contractAddress && asset.tokenId === tokenId
    )[0] as Asset;
    console.log(`currentAsset`);
    console.log(currentAsset);
    setAsset(currentAsset);
  }, [JSON.stringify(wallet.assets)]);

  return asset;
};
