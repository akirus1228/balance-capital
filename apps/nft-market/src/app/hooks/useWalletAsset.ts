import { useEffect } from "react";
import { Asset, loadWalletAssets, useWeb3Context } from "@fantohm/shared-web3";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";

export const useWalletAsset = (
  contractAddress: string | undefined,
  tokenId: string | undefined
): Asset | null => {
  console.log("useWalletAsset");
  const dispatch = useDispatch();
  const wallet = useSelector((state: RootState) => state.wallet);
  const asset = useSelector((state: RootState) =>
    state.wallet.assets.find(
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
      (wallet.assetStatus === "idle" || wallet.assetStatus === "failed") &&
      wallet.nextOpenseaLoad < Date.now()
    ) {
      console.log("loading wallet assets");
      dispatch(loadWalletAssets({ address, networkId: chainId }));
    }
  }, [address, wallet.assetStatus, contractAddress, tokenId]);

  return asset || ({} as Asset);
};
