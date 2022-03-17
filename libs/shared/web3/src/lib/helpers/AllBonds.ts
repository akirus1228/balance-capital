import { StableBond, LPBond, CustomBond, BondType, PaymentToken, BondAction, RedeemAction } from "../types/Bond";
import { addresses } from "../constants";
import { NetworkIDs } from "../networks";

import { abi as BondTradFiContract } from "../abi/TradFiBondDepository.json";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { getBondCalculator } from "../helpers/BondCalculator";
import { getTokenPrice } from "./index";
import { ethers } from "ethers";

export const tradfi = new StableBond({
  name: "tradfi",
  type: BondType.TRADFI,
  displayName: "USDB ➜ FHM",
  bondToken: "USDB",
  decimals: 18,
  isAvailable: { [NetworkIDs.FantomTestnet]: true,[NetworkIDs.FantomOpera]: true, [NetworkIDs.Ethereum]: true },
  isPurchaseable: true,
  bondIconSvg: null,
  bondContractABI: BondTradFiContract,
  paymentToken: PaymentToken.FHM,
  bondAction: BondAction.Mint,
  redeemAction: RedeemAction.Collect,
  networkAddrs: {
    [NetworkIDs.FantomTestnet]: {
      bondAddress: "0x38F0e4B286127AEbA6eC76B8466628030301Fb84",
      reserveAddress: "0x6Fc9383486c163fA48becdEC79d6058f984f62cA",
    },
  },
});

// HOW TO ADD A NEW BOND:
// Is it a stableCoin bond? use `new StableBond`
// Is it an LP Bond? use `new LPBond`
// Add new bonds to this array!!
export const allBonds = [
    tradfi
];
export const allBondsMap = allBonds.reduce((prevVal, bond) => {
  return { ...prevVal, [bond.name]: bond };
}, {});

// Debug Log
// console.log(allBondsMap);
export default allBonds;
