import { abi as BondCalcContract } from "../abi/BondCalcContract.json";
import { ethers } from "ethers";
import { addresses } from "../constants";
import { NetworkId } from "../networks";
import { chains } from "../providers";

export async function getBondCalculator(networkId: NetworkId) {
  return new ethers.Contract(addresses[networkId]["BONDINGCALC_ADDRESS"] as string, BondCalcContract, await chains[networkId].provider);
}
