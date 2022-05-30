import { createSelector } from "@reduxjs/toolkit";
import { useStore } from "react-redux";
import { WalletState } from "./wallet-slice";

export type RootState = { wallet: WalletState };

const selectErc20Allowances = (state: RootState) => state.wallet.erc20Allowance;

const selectErc20Allowance = (
  state: RootState,
  {
    walletAddress,
    erc20TokenAddress,
  }: { walletAddress: string; erc20TokenAddress: string }
) => ({
  walletAddress,
  erc20TokenAddress,
});
export const selectErc20AllowanceByAddress = createSelector(
  selectErc20Allowances,
  selectErc20Allowance,
  (erc20Allowance, { walletAddress, erc20TokenAddress }): number =>
    erc20Allowance[`${walletAddress}:::${erc20TokenAddress}`] || 0
);
