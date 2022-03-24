import { JsonRpcSigner } from "@ethersproject/providers";
import { ethers } from "ethers";

import { getTokenPrice} from "./index";
import { chains } from "../providers";
import { NetworkId, NetworkIds, networks } from "../networks";
import { truncateDecimals } from "../../../../helpers/src/lib/base";
import { 
  xFhmAbi as XfhmAbi,
  lqdrAbi as LqdrAbi,
  ierc20Abi
} from "../abi";
import { ReactComponent as OhmImg } from "../../../../assets/tokens/token_OHM.svg";

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

  getContractForWrite(networkId: NetworkId, rpcSigner: JsonRpcSigner) {
    const address = this.networkAddrs[networkId];
    return new ethers.Contract(address, this.contractABI, rpcSigner);
  }

  async getContract(networkId: NetworkId) {
    const address = this.networkAddrs[networkId];
    return new ethers.Contract(address, this.contractABI, await chains[networkId].provider);
  }

}

// @ts-ignore
export const xFhmToken = new AssetToken({
  name: "xFhm",
  displayName: "xFhm",
  contractABI: XfhmAbi,
  iconSvg: OhmImg,
  networkAddrs: {
    [NetworkIds.FantomOpera]: "",
    [NetworkIds.FantomTestnet]: "",
    [NetworkIds.Rinkeby]: networks[NetworkIds.Rinkeby].addresses["XFHM_ADDRESS"]
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
    [NetworkIds.FantomOpera]: "",
    [NetworkIds.FantomTestnet]: "",
    [NetworkIds.Rinkeby]: networks[NetworkIds.Rinkeby].addresses["LQDR_ADDRESS"]
  },
  decimals: 9
});

export const getAssetTokenPriceInUsd = async (token: string, networkId: NetworkId): Promise<number> => {
  let lqdrPrice = await getTokenPrice('liquiddriver');
  console.log('lqdrPrice: ', lqdrPrice);
  if (!lqdrPrice) {
    return 0;
  }
  lqdrPrice = Number(lqdrPrice);
  if (token === lqdrToken.name) {
    return lqdrPrice;
  }
  if (token === 'usdb') {
    const lpAddress = networks[networkId].addresses["LQDR_USDB_LP_ADDRESS"];
    if (!lpAddress) {
      return 0;
    }
    const provider = await chains[networkId].provider;
    const lqdrContract = new ethers.Contract(networks[networkId].addresses["LQDR_ADDRESS"], ierc20Abi, provider);
    const usdbContract = new ethers.Contract(networks[networkId].addresses["USDB_ADDRESS"], ierc20Abi, provider);
    const [lqdrBalance, usdbBalance] = await Promise.all([
      lqdrContract["balanceOf"](lpAddress),
      usdbContract["balanceOf"](lpAddress),
    ]);
    console.log('lqdrBalance: ', lqdrBalance);
    console.log('usdbBalance: ', usdbBalance);
    const rate = usdbBalance / lqdrBalance;

    console.log('usdb price: ', lqdrPrice * rate);
    return truncateDecimals(lqdrPrice * rate, 2);
  }
  return 0;
};


export const allAssetTokens = [
  xFhmToken,
  lqdrToken
];
