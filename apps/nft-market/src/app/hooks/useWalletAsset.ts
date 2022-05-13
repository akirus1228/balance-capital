import { useEffect } from "react";
import { useWeb3Context } from "@fantohm/shared-web3";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { Asset } from "../types/backend-types";
import { loadMyAssetsFromOpensea } from "../store/reducers/asset-slice";
import { selectAssetByAddress } from "../store/selectors/asset-selectors";

export const useWalletAsset = (
  contractAddress: string,
  tokenId: string
): Asset | null => {
  console.log("useWalletAsset");
  const dispatch = useDispatch();
  const assets = useSelector((state: RootState) => state.assets);
  const asset = useSelector((state: RootState) =>
    selectAssetByAddress(state, { tokenId, contractAddress })
  );
  const { chainId, address } = useWeb3Context();

  // if we haven't loaded wallet assets yet, do that
  useEffect(() => {
    if (
      !asset &&
      chainId &&
      address &&
      (assets.assetStatus === "idle" || assets.assetStatus === "failed") &&
      assets.nextOpenseaLoad < Date.now()
    ) {
      dispatch(loadMyAssetsFromOpensea({ address, networkId: chainId }));
    }
  }, [address, assets.assetStatus, contractAddress, tokenId]);

  return asset || ({} as Asset);
};
