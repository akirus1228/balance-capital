import { StableBond, LPBond, CustomBond, BondAssetType, BondType, PaymentToken, BondAction, RedeemAction } from "../lib/Bond";
import { addresses } from "../constants";
import { NetworkIds } from "../networks";

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
import { getBondCalculator } from "./BondCalculator";
import { getTokenPrice } from "./index";
import { ethers } from "ethers";

// // TODO(zx): Further modularize by splitting up reserveAssets into vendor token definitions
// //   and include that in the definition of a bond

export const dai_v2 = new StableBond({
  name: "dai",
  type: BondType.Bond_11,
  displayName: "DAI",
  bondToken: "DAI",
  decimals: 18,
  isAvailable: { [NetworkIds.Rinkeby]: true },
  isPurchasable: false,
  bondIconSvg: null,
  bondContractABI: BondDepositoryContract,
  networkAddrs: {
    // [NetworkIds.FantomOpera]: {
    //   bondAddress: "0xA6E6e8720C70f4715a34783381d6745a7aC32652",
    //   reserveAddress: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
    // },
    [NetworkIds.Rinkeby]: {
      bondAddress: "0xAA2d73E900ef65D7b6B6D013171301e70f0Fc059",
      reserveAddress: "0xfa1FBb8Ef55A4855E5688C0eE13aC3f202486286",
    },
  },
});

export const mim_DO_NOT_DELETE = new StableBond({
  name: "mim",
  type: BondType.Bond_11,
  displayName: "MIM",
  bondToken: "MIM",
  decimals: 18,
  isAvailable: { [NetworkIds.FantomTestnet]: true },
  isPurchasable: false,
  bondIconSvg: null,
  bondContractABI: DaiBondContract,
  networkAddrs: {
    // [NetworkIds.FantomOpera]: {
    //   bondAddress: "0x3C1a9b5Ff3196C43BcB05Bf1B7467fbA8e07EE61",
    //   reserveAddress: "0x82f0B8B456c1A451378467398982d4834b6829c1",
    // },
    [NetworkIds.FantomTestnet]: {
      bondAddress: "0x6307251Cf95ac2373EDf3838e349c7C25Ccd1204",
      reserveAddress: "0xFE2A3Da01681BD281cc77771c985CD7c4E372755",
    },
  },
});

export const usdcm = new StableBond({
  name: "usdcm",
  type: BondType.Bond_11,
  displayName: "USDC.m",
  bondToken: "USDC.m",
  decimals: 6,
  isAvailable: {  },
  isPurchasable: false,
  bondIconSvg: null,
  bondContractABI: DaiBondContract,
  networkAddrs: {
    // [NetworkIds.Moonriver]: {
    //   bondAddress: "0x25CCF3D5B5B856Bf019ECFb0C1dcC500C6D8E0a9",
    //   reserveAddress: "0x748134b5f553f2bcbd78c6826de99a70274bdeb3",
    // },
  },
});

export const usdcm_44 = new StableBond({
  name: "usdcm44",
  type: BondType.Bond_44,
  displayName: "USDC.m",
  bondToken: "USDC.m",
  decimals: 6,
  isAvailable: { [NetworkIds.Moonriver]: true },
  isPurchasable: true,
  bondIconSvg: null,
  bondContractABI: BondStakingDepositoryContract,
  paymentToken: PaymentToken.sFHM,
  networkAddrs: {
    [NetworkIds.Moonriver]: {
      bondAddress: "0xd7a8CedAAE9426F156CB987F8DFAEC58c0904876",
      reserveAddress: "0x748134b5f553f2bcbd78c6826de99a70274bdeb3",
    },
  },
});


export const usdtm = new StableBond({
  name: "usdtm",
  type: BondType.Bond_11,
  displayName: "USDT.m",
  bondToken: "USDT.m",
  decimals: 6,
  isAvailable: {  },
  isPurchasable: false,
  bondIconSvg: null,
  bondContractABI: DaiBondContract,
  networkAddrs: {
    // [NetworkIds.Moonriver]: {
    //   bondAddress: "0xC0c4209E3a6d227ad9Fe4dd3f064A1A1Ab6a3Ce5",
    //   reserveAddress: "0xE936CAA7f6d9F5C9e907111FCAf7c351c184CDA7",
    // },
  },
});

export const usdtm_44 = new StableBond({
  name: "usdtm44",
  type: BondType.Bond_44,
  displayName: "USDT.m",
  bondToken: "USDT.m",
  decimals: 6,
  isAvailable: { [NetworkIds.Moonriver]: true },
  isPurchasable: true,
  bondIconSvg: null,
  bondContractABI: BondStakingDepositoryContract,
  paymentToken: PaymentToken.sFHM,
  networkAddrs: {
    [NetworkIds.Moonriver]: {
      bondAddress: "0x0B75299da2065998Ec9C3139b22036a7e2CFe13E",
      reserveAddress: "0xE936CAA7f6d9F5C9e907111FCAf7c351c184CDA7",
    },
  },
});

export const fhm_dai_lp_44 = new LPBond({
  name: "fhm_dai_lp44",
  type: BondType.Bond_44,
  displayName: "FHM-DAI LP",
  bondToken: "DAI",
  decimals: 18,
  isAvailable: { [NetworkIds.FantomOpera]: true },
  isPurchasable: true,
  bondIconSvg: null,
  bondContractABI: BondStakingDepositoryContract,
  reserveContract: ReserveOhmDaiContract,
  paymentToken: PaymentToken.sFHM,
  networkAddrs: {
    [NetworkIds.FantomOpera]: {
      bondAddress: "0xFe0aEb293a2d297BE699a9f23F75Fd31C864674d",
      reserveAddress: "0xd77fc9c4074b56ecf80009744391942fbfddd88b",
    },
  },
  lpUrl:
    "https://spookyswap.finance/add/0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E/0xfa1FBb8Ef55A4855E5688C0eE13aC3f202486286",
});

export const fhm_usdcm_lp_44 = new LPBond({
  name: "fhm_usdcm_lp44",
  type: BondType.Bond_44,
  displayName: "FHM-USDC.m LP",
  bondToken: "USDC.m",
  decimals: 6, // LP has 18 decimals but asset price is in 6 decimals
  isAvailable: { [NetworkIds.Moonriver]: true },
  isPurchasable: true,
  bondIconSvg: null,
  bondContractABI: BondStakingDepositoryContract,
  reserveContract: ReserveOhmDaiContract,
  paymentToken: PaymentToken.sFHM,
  networkAddrs: {
    [NetworkIds.Moonriver]: {
      bondAddress: "0xdF3697fC8ba5421E79922a279EB62364503fb60C",
      reserveAddress: "0x0b6116bb2926d996cdeba9e1a79e44324b0401c9",
    },
  },
  lpUrl:
    "https://www.huckleberry.finance/#/add/0x748134b5F553F2bcBD78c6826De99a70274bDEb3/0xfa1FBb8Ef55A4855E5688C0eE13aC3f202486286",
});

export const usdb = new StableBond({
  name: "usdb",
  type: BondType.Bond_44,
  displayName: "USDB",
  bondToken: "USDB",
  decimals: 18,
  isAvailable: {  },
  isPurchasable: false,
  bondIconSvg: null,
  bondContractABI: BondStakingDepositoryContract,
  paymentToken: PaymentToken.sFHM,
  networkAddrs: {
    [NetworkIds.FantomOpera]: {
      bondAddress: "0xcF7d038432B7220b44687b13Fbb3001cd1117cD0",
      reserveAddress: "0x6Fc9383486c163fA48becdEC79d6058f984f62cA",
    },
    [NetworkIds.Moonriver]: {
      bondAddress: "0xC6858F8A824d43Acc778d50603528458510D8763",
      reserveAddress: "0x3E193c39626BaFb41eBe8BDd11ec7ccA9b3eC0b2",
    },
  },
});

export const usdb_dai_lp = new StableBond({
  name: "udsb_dai_lp",
  type: BondType.Bond_44,
  displayName: "USDB-DAI LP",
  bondToken: "USDB-DAI LP",
  decimals: 18,
  isAvailable: {  },
  isPurchasable: false,
  bondIconSvg: null,
  bondContractABI: BondStakingDepositoryContract,
  paymentToken: PaymentToken.sFHM,
  networkAddrs: {
    [NetworkIds.FantomOpera]: {
      bondAddress: "0x955e91c5a7a05E5C790449cc43b1d1519965517C",
      reserveAddress: "0x7799f423534c319781b1b370B69Aaf2C75Ca16A3",
    }
  },
});

export const dai44 = new StableBond({
  name: "dai44",
  type: BondType.Bond_44,
  displayName: "DAI",
  bondToken: "DAI",
  decimals: 18,
  isAvailable: { [NetworkIds.FantomOpera]: true, [NetworkIds.FantomTestnet]: true },
  isPurchasable: true,
  bondIconSvg: null,
  bondContractABI: BondStakingDepositoryContract,
  paymentToken: PaymentToken.sFHM,
  networkAddrs: {
    [NetworkIds.FantomOpera]: {
      bondAddress: "0xC2B356342D191E2E068B3c9876Fc0440b4d5Ed25",
      reserveAddress: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
    },
    [NetworkIds.FantomTestnet]: {
      bondAddress: "0xc7C64C8A27F1c52C0EecAF4542d3b100f5e27a27",
      reserveAddress: "0x05db87C4Cbb198717F590AabA613cdD2180483Ce",
    },
  },
});

export const usdbBuy = new StableBond({
  name: "usdbBuy",
  type: BondType.Bond_USDB,
  displayName: "DAI ➜ USDB",
  bondToken: "DAI",
  decimals: 18,
  isAvailable: { [NetworkIds.FantomOpera]: true },
  isPurchasable: true,
  bondIconSvg: null,
  bondContractABI: FhudABondDepositoryContract,
  paymentToken: PaymentToken.USDB,
  bondAction: BondAction.Mint,
  redeemAction: RedeemAction.Collect,
  networkAddrs: {
    [NetworkIds.FantomOpera]: {
      bondAddress: "0x299f15b527fdBf76A7CA6087a521e60c18F80529",
      reserveAddress: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
    },
  },
});


export const usdbSell = new StableBond({
  name: "usdbSell",
  type: BondType.Bond_USDB,
  displayName: "USDB ➜ FHM",
  bondToken: "USDB",
  decimals: 18,
  isAvailable: { [NetworkIds.FantomOpera]: true },
  isPurchasable: true,
  bondIconSvg: null,
  bondContractABI: FhudBBondDepositoryContract,
  paymentToken: PaymentToken.FHM,
  bondAction: BondAction.Mint,
  redeemAction: RedeemAction.Collect,
  networkAddrs: {
    [NetworkIds.FantomOpera]: {
      bondAddress: "0x8dC59734b753e465dda2ea908A00F46f06522481",
      reserveAddress: "0x6Fc9383486c163fA48becdEC79d6058f984f62cA",
    },
  },
});

export const tradfi3month = new StableBond({
  name: "tradfi3month",
  type: BondType.TRADFI,
  displayName: "tradfi3month",
  bondToken: "tradfi3month",
  decimals: 6,
  isAvailable: { [NetworkIds.FantomOpera]: true, [NetworkIds.FantomTestnet]: true },
  isPurchasable: true,
  bondIconSvg: null,
  bondContractABI: TradFiBondDepository,
  paymentToken: PaymentToken.USDB,
  networkAddrs: {
    [NetworkIds.FantomTestnet]: {
      bondAddress: "0x38F0e4B286127AEbA6eC76B8466628030301Fb84",
      reserveAddress: "0x05db87C4Cbb198717F590AabA613cdD2180483Ce",
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
  tradfi3month
];
export const allBondsMap = allBonds.reduce((prevVal, bond) => {
  return { ...prevVal, [bond.name]: bond };
}, {});

// Debug Log
// console.log(allBondsMap);
export default allBonds;
