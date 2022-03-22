import { JsonRpcSigner } from "@ethersproject/providers";
import { NetworkID, networks } from "@fantohm/shared-web3";
import { ethers } from "ethers";

import { chains } from "../providers";
import { NetworkIDs } from "../../lib/networks";
import { abi as XfhmAbi } from "../abi/xFhm.json";
import { abi as LqdrAbi } from "../abi/Lqdr.json";
import { ReactComponent as OhmImg } from "../../../../assets/tokens/token_OHM.svg";
import React from "react";

export interface AssetTokenAddress {
  [key: string]: string
}

interface AssetTokenOpts {
  name: string; // Internal name used for references
  displayName: string; // Display name on UI
  contractABI: ethers.ContractInterface; // ABI for contract
  networkAddrs: AssetTokenAddress; // Mapping of network --> Address
  decimals: number;
  iconSvg: any;
}

export abstract class AssetToken {
  // Standard Bond fields regardless of LP bonds or stable bonds.
  readonly name: string;
  readonly displayName: string;
  readonly contractABI: ethers.ContractInterface; // Bond ABI
  readonly networkAddrs: AssetTokenAddress;
  readonly decimals: number;
  readonly iconSvg: any;
  balance: number | null;

  protected constructor(tokenOpts: AssetTokenOpts) {
    this.name = tokenOpts.name;
    this.displayName = tokenOpts.displayName;
    this.contractABI = tokenOpts.contractABI;
    this.networkAddrs = tokenOpts.networkAddrs;
    this.decimals = tokenOpts.decimals;
    this.iconSvg = tokenOpts.iconSvg;
    this.balance = null;
  }

  setBalance(balance: number) {
    this.balance = balance;
  }

  getContractForWrite(networkID: NetworkID, rpcSigner: JsonRpcSigner) {
    const address = this.networkAddrs[networkID];
    return new ethers.Contract(address, this.contractABI, rpcSigner);
  }

  async getContract(networkID: NetworkID) {
    const address = this.networkAddrs[networkID];
    return new ethers.Contract(address, this.contractABI, await chains[networkID].provider);
  }

}

// @ts-ignore
export const xFhmToken = new AssetToken({
  name: "xFhm",
  displayName: "xFhm",
  contractABI: XfhmAbi,
  iconSvg: OhmImg,
  networkAddrs: {
    [NetworkIDs.FantomOpera]: "",
    [NetworkIDs.FantomTestnet]: "",
    [NetworkIDs.Rinkeby]: networks[NetworkIDs.Rinkeby].addresses["XFHM_ADDRESS"]
  },
  decimals: 18
});

// @ts-ignore
export const lqdrToken = new AssetToken({
  name: "LQDR",
  displayName: "LQDR",
  contractABI: LqdrAbi,
  iconSvg: OhmImg,
  networkAddrs: {
    [NetworkIDs.FantomOpera]: "",
    [NetworkIDs.FantomTestnet]: "",
    [NetworkIDs.Rinkeby]: networks[NetworkIDs.Rinkeby].addresses["LQDR_ADDRESS"]
  },
  decimals: 9
});


export const allAssetTokens = [
  xFhmToken,
  lqdrToken
];
