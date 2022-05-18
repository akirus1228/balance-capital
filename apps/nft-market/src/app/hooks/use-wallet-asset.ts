import { useEffect } from "react";
import { useWeb3Context } from "@fantohm/shared-web3";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { Asset } from "../types/backend-types";
import { selectAssetByAddress } from "../store/selectors/asset-selectors";
import { OpenseaAsset, useGetOpenseaAssetsQuery } from "../api/opensea";
import { useGetAssetsQuery } from "../api/backend-api";

export const useWalletAsset = (
  contractAddress: string,
  tokenId: string
): Asset | null => {
  console.log("useWalletAsset");
  const asset = useSelector((state: RootState) =>
    selectAssetByAddress(state, { tokenId, contractAddress })
  );
  const { address } = useWeb3Context();
  // load asset data from opensea
  const { data: osAssets, isLoading: isAssetLoading } = useGetOpenseaAssetsQuery(
    {
      owner: address,
      token_ids: [tokenId],
      asset_contract_address: contractAddress,
      limit: 1,
    },
    { skip: !!asset }
  );

  const { data: beAssets, isLoading: isBeLoading } = useGetAssetsQuery(
    {
      skip: 0,
      take: 1,
      openseaIds: osAssets
        ? osAssets.map((asset: OpenseaAsset) => asset.id.toString())
        : [],
    },
    { skip: !osAssets && isAssetLoading }
  );

  return asset || ({} as Asset);
};
