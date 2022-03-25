import { StableBond, BondType, PaymentToken } from "../lib/bond";
import {NetworkIds} from "../networks";

import { singleSidedLPBondDepositoryAbi, tradFiBondDepositoryAbi, lqdrUsdbPolBondDepositoryAbi } from "../abi";

// // TODO(zx): Further modularize by splitting up reserveAssets into vendor token definitions
// //   and include that in the definition of a bond

export const TRADFI_3M:string = "tradfi3month";

export const tradfi3month = new StableBond({
  name: TRADFI_3M,
  type: BondType.TRADFI,
  displayName: "TradFi 3 Month",
  bondToken: "tradfi3month",
  decimals: 18,
  apr: 21.5,
  roi: 5,
  days: 90,
  isAvailable: { [NetworkIds.FantomOpera]: true, [NetworkIds.Rinkeby]: true },
  isPurchasable: true,
  bondIconSvg: null,
  bondContractABI: tradFiBondDepositoryAbi,
  paymentToken: PaymentToken.USDB,
  networkAddrs: {
    [NetworkIds.FantomOpera]: {
      bondAddress: "0x3D107C1d16a2c0C3c5AAc3Eb54D05B5d6209152E",
      reserveAddress: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
    },
    [NetworkIds.Rinkeby]: {
      bondAddress: "0x65C0cA99697E1746A55DE416f7642234FCcDF778",
      reserveAddress: "0xfa1FBb8Ef55A4855E5688C0eE13aC3f202486286",
    },
  },
});

export const tradfi6month = new StableBond({
  name: "tradfi6month",
  type: BondType.TRADFI,
  displayName: "TradFi 6 Month",
  bondToken: "tradfi6month",
  decimals: 18,
  apr: 32.5,
  roi: 15,
  days: 180,
  isAvailable: { [NetworkIds.FantomOpera]: true, [NetworkIds.Rinkeby]: true },
  isPurchasable: true,
  bondIconSvg: null,
  bondContractABI: tradFiBondDepositoryAbi,
  paymentToken: PaymentToken.USDB,
  networkAddrs: {
    [NetworkIds.FantomOpera]: {
      bondAddress: "0x055eFae609a05b92F6793b81bD489ab9C8a49d4B",
      reserveAddress: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
    },
    [NetworkIds.Rinkeby]: {
      bondAddress: "0xE12f6082D3137521a6098A9114309FA9Fd95C4dF",
      reserveAddress: "0xfa1FBb8Ef55A4855E5688C0eE13aC3f202486286",
    },
  },
});

export const singleSided = new StableBond({
  name: "singleSided",
  type: BondType.SINGLE_SIDED,
  displayName: "Staking",
  bondToken: "singleSided",
  decimals: 18,
  apr: 0,
  roi: 0,
  days: 0,
  isAvailable: { [NetworkIds.Rinkeby]: true },
  isPurchasable: true,
  bondIconSvg: null,
  bondContractABI: singleSidedLPBondDepositoryAbi,
  paymentToken: PaymentToken.FHM,
  networkAddrs: {
    [NetworkIds.Rinkeby]: {
      bondAddress: "0x98B853A6310EB136532E2B99f327b16F8730a978",
      reserveAddress: "0xfa1FBb8Ef55A4855E5688C0eE13aC3f202486286",
    },
  },
});

export const lqdrUsdbPol = new StableBond({
  name: "lqdrUsdbPol",
  type: BondType.LQDR_USDB_POL,
  displayName: "LQDR USDB Pol",
  bondToken: "lqdrUsdbPol",
  decimals: 18,
  apr: 0,
  roi: 0,
  days: 0,
  isAvailable: { [NetworkIds.Rinkeby]: true },
  isPurchasable: true,
  bondIconSvg: null,
  bondContractABI: lqdrUsdbPolBondDepositoryAbi,
  networkAddrs: {
    [NetworkIds.Rinkeby]: {
      bondAddress: "0x4f06EC6079BB6F6B39aF11010d764f1B4747E3eC",
      reserveAddress: "0xf03b216dfc70008442e6f56ac085c18210b740f5",
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
  tradfi6month,
  singleSided,
  lqdrUsdbPol
];
export const allBondsMap = allBonds.reduce((prevVal, bond) => {
  return { ...prevVal, [bond.name]: bond };
}, {});

// Debug Log
// console.log(allBondsMap);
export default allBonds;
