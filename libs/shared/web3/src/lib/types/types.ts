import { JsonRpcProvider } from '@ethersproject/providers';
import Web3Modal from 'web3modal';

type onChainProvider = {
  connect: () => void;
  disconnect: () => void;
  provider: JsonRpcProvider | null;
  address: string;
  connected: boolean;
  web3Modal: Web3Modal;
};

export type Web3ContextData = {
  onChainProvider: onChainProvider;
} | null;
