import { abi as BondCalcContract } from "src/abi/BondCalcContract.json";
import { ethers } from "ethers";
import { addresses } from "src/constants";
import { NetworkID } from "src/networks";
import { chains } from "src/providers";

export async function getBondCalculator(networkID: NetworkID) {
  return new ethers.Contract(addresses[networkID].BONDINGCALC_ADDRESS as string, BondCalcContract, await chains[networkID].provider);
}
