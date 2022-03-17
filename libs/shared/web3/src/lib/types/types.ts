import { JsonRpcProvider } from '@ethersproject/providers';
import Web3Modal from 'web3modal';
import { NetworkID } from '../networks';

type onChainProvider = {
  connect: () => void;
  disconnect: () => void;
  provider: JsonRpcProvider | null;
  address: string;
  connected: boolean;
  web3Modal: Web3Modal;
  hasCachedProvider?: () => boolean;
  chainID?: number
  switchEthereumChain?: (networkID: NetworkID, forceSwitch?: boolean) => Promise<boolean>
};

export type Web3ContextData = {
  onChainProvider: onChainProvider;
} | null;

