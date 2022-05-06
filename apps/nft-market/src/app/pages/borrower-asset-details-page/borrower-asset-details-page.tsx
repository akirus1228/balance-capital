import {
  Asset,
  AssetStatus,
  defaultNetworkId,
  loadAsset,
  loadWalletAssets,
  useWeb3Context,
} from "@fantohm/shared-web3";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../../store";

import AssetDetails from "../../components/asset-details/asset-details";
import BorrowerLoanDetails from "../../components/borrower-loan-details/borrower-loan-details";
import BorrowerCreateListing from "../../components/borrower-create-listing/borrower-create-listing";

export const BorrowerAssetDetailsPage = (): JSX.Element => {
  const params = useParams();
  const dispatch = useDispatch();

  const wallet = useSelector((state: RootState) => state.wallet);
  const backend = useSelector((state: RootState) => state.nftMarketplace);
  const { chainId, address } = useWeb3Context();

  const currentAsset: Asset = useMemo(() => {
    if (params["assetId"] && wallet.assets) {
      return wallet.assets.filter((asset) => asset.id === params["assetId"])[0];
    } else {
      return {} as Asset;
    }
  }, [JSON.stringify(wallet.assets)]);

  useEffect(() => {
    if (backend.authSignature !== null && currentAsset && address) {
      dispatch(loadAsset(currentAsset));
    } else if (backend.authSignature !== null && !currentAsset) {
      dispatch(loadWalletAssets({ networkId: chainId || defaultNetworkId, address }));
    }
  }, [currentAsset, address]);

  return (
    <>
      <AssetDetails asset={currentAsset} />
      {!currentAsset && <h1>Loading...</h1>}
      {[AssetStatus.Ready, AssetStatus.New].includes(currentAsset?.status) && (
        <BorrowerCreateListing asset={currentAsset} sx={{ mt: "3em" }} />
      )}
      {currentAsset?.status === AssetStatus.Listed && (
        <BorrowerLoanDetails asset={currentAsset} sx={{ mt: "3em" }} />
      )}
    </>
  );
};

export default BorrowerAssetDetailsPage;
