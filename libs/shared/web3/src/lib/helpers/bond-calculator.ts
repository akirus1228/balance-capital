import { abi as BondCalcContract } from "../abi/BondCalcContract.json";
import { ethers } from "ethers";
import { addresses } from "../constants";
import { NetworkID } from "../networks";
import { chains } from "../providers";

export async function getBondCalculator(networkID: NetworkID) {
  return new ethers.Contract(addresses[networkID]["BONDINGCALC_ADDRESS"] as string, BondCalcContract, await chains[networkID].provider);
}
