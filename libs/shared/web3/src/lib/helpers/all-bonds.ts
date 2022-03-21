import { StableBond, LPBond, CustomBond, BondAssetType, BondType, PaymentToken, BondAction, RedeemAction } from "../lib/bond";
import { addresses } from "../constants";
import {NetworkIDs, NetworkIds} from "../networks";

import { abi as BondOhmDaiContract } from "../abi/bonds/OhmDaiContract.json";
import { abi as BondOhmLusdContract } from "../abi/bonds/OhmLusdContract.json";
import { abi as BondOhmEthContract } from "../abi/bonds/OhmEthContract.json";
import { abi as TradFiBondDepository } from "../abi/bonds/TradFiBondDepository.json";

import { abi as DaiBondContract } from "../abi/bonds/DaiContract.json";
import { abi as ReserveOhmLusdContract } from "../abi/reserves/OhmLusd.json";
import { abi as ReserveOhmDaiContract } from "../abi/reserves/OhmDai.json";
import { abi as ReserveOhmEthContract } from "../abi/reserves/OhmEth.json";

import { abi as LusdBondContract } from "../abi/bonds/LusdContract.json";
import { abi as EthBondContract } from "../abi/bonds/EthContract.json";

import { abi as BondDepositoryContract } from "../abi/bonds/BondDepository.json";
import { abi as BondStakingDepositoryContract } from "../abi/bonds/BondStakingDepository.json";
import { abi as FhudABondDepositoryContract } from "../abi/bonds/FhudABondDepository.json";
import { abi as FhudBBondDepositoryContract } from "../abi/bonds/FhudBBondDepository.json";

import { abi as ierc20Abi } from "../abi/IERC20.json";
import { getBondCalculator } from "./bond-calculator";
import { getTokenPrice } from "./index";
import { ethers } from "ethers";

// // TODO(zx): Further modularize by splitting up reserveAssets into vendor token definitions
// //   and include that in the definition of a bond

export const tradfi3month = new StableBond({
  name: "tradfi3month",
  type: BondType.TRADFI,
  displayName: "tradfi3month",
  bondToken: "tradfi3month",
  decimals: 18,
  roi: "21.5",
  isAvailable: { [NetworkIds.Rinkeby]: true, [NetworkIds.FantomTestnet]: true },
  isPurchasable: true,
  bondIconSvg: null,
  bondContractABI: TradFiBondDepository,
  paymentToken: PaymentToken.USDB,
  networkAddrs: {
    [NetworkIds.FantomTestnet]: {
      bondAddress: "0x38F0e4B286127AEbA6eC76B8466628030301Fb84",
      reserveAddress: "0x05db87C4Cbb198717F590AabA613cdD2180483Ce",
    },
    [NetworkIds.Rinkeby]: {
      bondAddress: "0x52b27846dd773C8E16Fc8e75E2d1D6abd4e8C48A",
      reserveAddress: "0xfa1FBb8Ef55A4855E5688C0eE13aC3f202486286",
    },
  },
});

export const singleSided = new StableBond({
  name: "singleSided",
  type: BondType.TRADFI,
  displayName: "singleSided",
  bondToken: "singleSided",
  decimals: 18,
  roi: "32.5",
  isAvailable: { [NetworkIds.FantomOpera]: true, [NetworkIds.Rinkeby]: true },
  isPurchasable: true,
  bondIconSvg: null,
  bondContractABI: TradFiBondDepository,
  paymentToken: PaymentToken.USDB,
  networkAddrs: {
    [NetworkIds.Rinkeby]: {
      bondAddress: "0xaB5EBc2C378973477a61947954a9A02362f31382",
      reserveAddress: "0xfa1FBb8Ef55A4855E5688C0eE13aC3f202486286",
    },
  },
});

// HOW TO ADD A NEW BOND:
// Is it a stableCoin bond? use `new StableBond`
// Is it an LP Bond? use `new LPBond`
// Add new bonds to this array!!
export const allBonds = [
  /// 1,1 stablecoin bonds
  // FTM
  tradfi3month,
  singleSided
];
export const allBondsMap = allBonds.reduce((prevVal, bond) => {
  return { ...prevVal, [bond.name]: bond };
}, {});

// Debug Log
// console.log(allBondsMap);
export default allBonds;
