import { StableBond, LPBond, CustomBond, BondAssetType, BondType, PaymentToken, BondAction, RedeemAction } from "../lib/bond";
import { addresses } from "../constants";
import {NetworkIds} from "../networks";

import { abi as SingleSidedBondDepository } from "../abi/bonds/SingleSidedLPBondDepository.json";
import { abi as TradFiBondDepository } from "../abi/bonds/TradFiBondDepository.json";

// // TODO(zx): Further modularize by splitting up reserveAssets into vendor token definitions
// //   and include that in the definition of a bond

export const tradfi3month = new StableBond({
  name: "tradfi3month",
  type: BondType.TRADFI,
  displayName: "TradFi 3 Month",
  bondToken: "tradfi3month",
  decimals: 18,
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
  type: BondType.SINGLE_SIDED,
  displayName: "singleSided",
  bondToken: "singleSided",
  decimals: 18,
  isAvailable: { [NetworkIds.FantomOpera]: true, [NetworkIds.Rinkeby]: true },
  isPurchasable: true,
  bondIconSvg: null,
  bondContractABI: SingleSidedBondDepository,
  paymentToken: PaymentToken.FHM,
  networkAddrs: {
    [NetworkIds.Rinkeby]: {
      bondAddress: "0x0cbf1879A92143fF25AeFC489457459FE9Bd7DD5",
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
