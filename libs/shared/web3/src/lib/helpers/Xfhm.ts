import { JsonRpcSigner } from '@ethersproject/providers';
import { NetworkID } from '@fantohm/shared-web3';
import { ethers } from 'ethers';

import { chains } from '../providers';
import { NetworkIDs } from '../../lib/networks';
import { abi as XfhmAbi } from '../abi/xFhm.json';


export interface XfhmAddresses {
  [key: string]: string
}

interface XfhmOpts {
  name: string; // Internal name used for references
  displayName: string; // Display name on UI
  contractABI: ethers.ContractInterface; // ABI for contract
  networkAddrs: XfhmAddresses; // Mapping of network --> Address
  decimals: number;
}

export abstract class Xfhm {
  // Standard Bond fields regardless of LP bonds or stable bonds.
  readonly name: string;
  readonly displayName: string;
  readonly contractABI: ethers.ContractInterface; // Bond ABI
  readonly networkAddrs: XfhmAddresses;
  readonly decimals: number;

  protected constructor(xfhmOpts: XfhmOpts) {
    this.name = xfhmOpts.name;
    this.displayName = xfhmOpts.displayName;
    this.contractABI = xfhmOpts.contractABI;
    this.networkAddrs = xfhmOpts.networkAddrs;
    this.decimals = xfhmOpts.decimals;
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
export const xFhmToken = new Xfhm({
  name: 'xFhm',
  displayName: 'xFhm',
  contractABI: XfhmAbi,
  networkAddrs: {
    [NetworkIDs.FantomOpera]: "",
    [NetworkIDs.FantomTestnet]: "",
    [NetworkIDs.Rinkeby]: "0x8ABf6F83F636C9DB306E1Ab473E083f3bdcA4268",
  },
  decimals: 18
});
