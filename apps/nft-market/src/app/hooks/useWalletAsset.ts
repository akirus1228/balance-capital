import { useEffect } from "react";
import { useWeb3Context } from "@fantohm/shared-web3";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { Asset } from "../types/backend-types";
import { loadAssetsFromOpensea } from "../store/reducers/asset-slice";

export const useWalletAsset = (
  contractAddress: string | undefined,
  tokenId: string | undefined
): Asset | null => {
  console.log("useWalletAsset");
  const dispatch = useDispatch();
  const assets = useSelector((state: RootState) => state.assets);
  const asset = useSelector((state: RootState) =>
    state.assets.assets.find(
      (walletAsset: Asset) =>
        walletAsset.assetContractAddress === contractAddress &&
        walletAsset.tokenId === tokenId
    )
  );
  const { chainId, address } = useWeb3Context();

  // if we haven't loaded wallet assets yet, do that
  useEffect(() => {
    if (
      chainId &&
      address &&
      (assets.assetStatus === "idle" || assets.assetStatus === "failed") &&
      assets.nextOpenseaLoad < Date.now()
    ) {
      dispatch(loadAssetsFromOpensea({ address, networkId: chainId }));
    }
  }, [address, assets.assetStatus, contractAddress, tokenId]);

  return asset || ({} as Asset);
};
