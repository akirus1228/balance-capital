import {JsonRpcSigner} from "@ethersproject/providers";
import {ethers} from "ethers";

import {abi as ierc20Abi} from "../abi/IERC20.json";
import {getBondCalculator} from "../helpers/BondCalculator";
import {addresses} from "../constants";
import {NetworkID} from "../networks";
import React from "react";
import {chains} from "../providers";

export enum PaymentToken {
  FHM = 'FHM',
  sFHM = 'sFHM',
  USDB = 'USDB',
}

export enum BondAssetType {
  StableAsset,
  LP,
}

export enum BondType {
  TRADFI
}

export enum BondAction {
  Bond = 'Bond',
  Mint = 'Mint',
}

export enum RedeemAction {
  Redeem = 'Redeem',
  Collect = 'Collect',
}

export interface BondAddresses {
  reserveAddress: string;
  bondAddress: string;
}

export interface NetworkAddresses {
  [key: string]: BondAddresses
}

export interface Available {
  [key: string]: boolean
}

interface BondOpts {
  name: string; // Internal name used for references
  displayName: string; // Displayname on UI
  isAvailable: Available; // set false to display "Sold Out"
  isPurchaseable: boolean; // set false to hide "Bond" button
  bondIconSvg: React.ReactNode; //  SVG path for icons
  bondContractABI: ethers.ContractInterface; // ABI for contract
  networkAddrs: NetworkAddresses; // Mapping of network --> Addresses
  bondToken: string; // Unused, but native token to buy the bond.
  decimals: number;
  type: BondType;
  paymentToken?: PaymentToken; // The token that is returned by this bond
  bondAction?: BondAction; // What to display in the bond button
  redeemAction?: RedeemAction; // What to displat in the redeeom button
}

// Technically only exporting for the interface
export abstract class Bond {
  // Standard Bond fields regardless of LP bonds or stable bonds.
  readonly name: string;
  readonly displayName: string;
  readonly type: BondType;
  readonly assetType: BondAssetType;
  readonly isAvailable: Available;
  readonly isPurchaseable: boolean;
  readonly bondIconSvg: React.ReactNode;
  readonly bondContractABI: ethers.ContractInterface; // Bond ABI
  readonly networkAddrs: NetworkAddresses;
  readonly bondToken: string;
  readonly decimals: number;
  readonly paymentToken: PaymentToken; // Defaults to FHM
  readonly bondAction: BondAction;
  readonly redeemAction: RedeemAction;

  // The following two fields will differ on how they are set depending on bond type
  abstract isLP: boolean;
  abstract reserveContract: ethers.ContractInterface; // Token ABI
  abstract displayUnits: string;
  abstract isRiskFree: boolean;

  // Async method that returns a Promise
  abstract getTreasuryBalance(networkID: NetworkID): Promise<number>;

  protected constructor(assetType: BondAssetType, bondOpts: BondOpts) {
    this.name = bondOpts.name;
    this.displayName = bondOpts.displayName;
    this.assetType = assetType;
    this.type = bondOpts.type;
    this.isAvailable = bondOpts.isAvailable;
    this.isPurchaseable = bondOpts.isPurchaseable;
    this.bondIconSvg = bondOpts.bondIconSvg;
    this.bondContractABI = bondOpts.bondContractABI;
    this.networkAddrs = bondOpts.networkAddrs;
    this.bondToken = bondOpts.bondToken;
    this.decimals = bondOpts.decimals;
    this.paymentToken = bondOpts.paymentToken || PaymentToken.FHM;
    this.bondAction = bondOpts.bondAction || BondAction.Bond;
    this.redeemAction = bondOpts.redeemAction || RedeemAction.Redeem;
  }

  hasBond(networkID: NetworkID): boolean {
    return this.networkAddrs[networkID] !== undefined;
  }

  getAddressForBond(networkID: NetworkID) {
    return this.networkAddrs[networkID].bondAddress;
  }

  getContractForBondForWrite(networkID: NetworkID, rpcSigner: JsonRpcSigner) {
    const bondAddress = this.getAddressForBond(networkID);
    return new ethers.Contract(bondAddress, this.bondContractABI, rpcSigner);
  }

  async getContractForBond(networkID: NetworkID) {
    const bondAddress = this.getAddressForBond(networkID);
    return new ethers.Contract(bondAddress, this.bondContractABI, await chains[networkID].provider);
  }

  getAddressForReserve(networkID: NetworkID) {
    return this.networkAddrs[networkID].reserveAddress;
  }

  getContractForReserveForWrite(networkID: NetworkID, rpcSigner: JsonRpcSigner) {
    const bondAddress = this.getAddressForReserve(networkID);
    return new ethers.Contract(bondAddress, this.reserveContract, rpcSigner);
  }

  async getContractForReserve(networkID: NetworkID) {
    const bondAddress = this.getAddressForReserve(networkID);
    return new ethers.Contract(bondAddress, this.reserveContract, await chains[networkID].provider);
  }

  async getBondReservePrice(networkID: NetworkID) {
    const pairContract = await this.getContractForReserve(networkID);
    const reserves = await pairContract["getReserves"]();
    return reserves[1] / reserves[0] / Math.pow(10, 9);
  }
}

// Keep all LP specific fields/logic within the LPBond class
export interface LPBondOpts extends BondOpts {
  reserveContract: ethers.ContractInterface;
  lpUrl: string;
}

export class LPBond extends Bond {
  readonly isLP = true;
  readonly isRiskFree = false;
  readonly lpUrl: string;
  readonly reserveContract: ethers.ContractInterface;
  readonly displayUnits: string;

  constructor(lpBondOpts: LPBondOpts) {
    super(BondAssetType.LP, lpBondOpts);

    this.lpUrl = lpBondOpts.lpUrl;
    this.reserveContract = lpBondOpts.reserveContract;
    this.displayUnits = "LP";
  }
  async getTreasuryBalance(networkID: NetworkID) {
    const token = await this.getContractForReserve(networkID);
    const tokenAddress = this.getAddressForReserve(networkID);
    const bondCalculator = await getBondCalculator(networkID);
    const [tokenAmount, markdown] = await Promise.all([
      token["balanceOf"](addresses[networkID]["TREASURY_ADDRESS"]),
      bondCalculator["markdown"](tokenAddress),
    ]).then(([tokenAmount, markdown]) => [
      tokenAmount,
      markdown / Math.pow(10, this.decimals),
    ]);
    const valuation = await bondCalculator["valuation"](tokenAddress, tokenAmount) / Math.pow(10, 9);
    return valuation * markdown;
  }
}

// Generic BondClass we should be using everywhere
// Assumes the token being deposited follows the standard ERC20 spec
export type StableBondOpts = BondOpts
export class StableBond extends Bond {
  readonly isLP = false;
  readonly isRiskFree = true;
  readonly reserveContract: ethers.ContractInterface;
  readonly displayUnits: string;

  constructor(stableBondOpts: StableBondOpts) {
    super(BondAssetType.StableAsset, stableBondOpts);
    // For stable bonds the display units are the same as the actual token
    this.displayUnits = stableBondOpts.bondToken;
    this.reserveContract = ierc20Abi; // The Standard ierc20Abi since they're normal tokens
  }

  async getTreasuryBalance(networkID: NetworkID) {
    const token = await this.getContractForReserve(networkID);
    const tokenAmount = await token["balanceOf"](addresses[networkID]["TREASURY_ADDRESS"]);
    return tokenAmount / Math.pow(10, this.decimals);
  }
}

// These are special bonds that have different valuation methods
export interface CustomBondOpts extends BondOpts {
  reserveContract: ethers.ContractInterface;
  assetType: number;
  lpUrl: string;
  isRiskFree: boolean;
  customTreasuryBalanceFunc: (
    this: CustomBond,
    networkID: NetworkID,
  ) => Promise<number>;
}
export class CustomBond extends Bond {
  readonly isLP: boolean;
  getTreasuryBalance(networkID: NetworkID): Promise<number> {
    throw new Error("Method not implemented.");
  }
  readonly reserveContract: ethers.ContractInterface;
  readonly displayUnits: string;
  readonly lpUrl: string;
  readonly isRiskFree: boolean;

  constructor(customBondOpts: CustomBondOpts) {
    super(customBondOpts.assetType, customBondOpts);

    this.isLP = customBondOpts.assetType === BondAssetType.LP;
    this.isRiskFree = customBondOpts.isRiskFree;
    this.lpUrl = customBondOpts.lpUrl;
    // For stable bonds the display units are the same as the actual token
    this.displayUnits = customBondOpts.displayName;
    this.reserveContract = customBondOpts.reserveContract;
    this.getTreasuryBalance = customBondOpts.customTreasuryBalanceFunc.bind(this);
  }
}
