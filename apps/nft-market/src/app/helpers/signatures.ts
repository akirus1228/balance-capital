import { JsonRpcProvider } from "@ethersproject/providers";
import { addresses } from "@fantohm/shared-web3";
import { ethers } from "ethers";
import { Terms } from "../types/backend-types";
import { nftTokenType } from "../types/contract-types";

export const signTerms = async (
  provider: JsonRpcProvider,
  address: string,
  chainId: number,
  nftContractAddress: string,
  tokenId: string,
  terms: Terms
): Promise<string> => {
  const signer = provider.getSigner();
  const payload = ethers.utils.defaultAbiCoder.encode(
    [
      "address",
      "address",
      "address",
      "uint256",
      "uint256",
      "uint256",
      "uint256",
      "uint8",
    ],
    [
      address,
      nftContractAddress,
      addresses[chainId]["USDB_ADDRESS"],
      tokenId,
      terms.duration,
      ethers.utils.parseEther(terms.amount.toString()),
      terms.apr * 100,
      nftTokenType.ERC721,
    ]
  );
  console.log(payload);
  const payloadHash = ethers.utils.keccak256(payload);
  const signature = await provider
    .getSigner()
    .signMessage(ethers.utils.arrayify(payloadHash));
  return signature;
};
