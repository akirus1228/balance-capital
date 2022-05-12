import { NftPermStatus, WalletState } from "@fantohm/shared-web3";
import { createSelector } from "@reduxjs/toolkit";
import { Asset } from "../../types/backend-types";

const selectNftPerm: (walletState: WalletState) => NftPermStatus = (
  walletState: WalletState
) => walletState.nftPermStatus;

const selectNftPermAsset = (walletState: WalletState, asset: Asset) => asset;
export const selectNftPermFromAsset = createSelector(
  [selectNftPerm, selectNftPermAsset],
  (nftPerms, asset) => nftPerms[`${asset.tokenId}:::${asset.assetContractAddress}`]
);
