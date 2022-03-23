import React, {
  useState,
  ReactElement,
  useContext,
  useMemo,
  useCallback,
} from 'react';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { IFrameEthereumProvider } from '@ledgerhq/iframe-provider';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { Web3ContextData } from './types/types';
import { NetworkId, NetworkIds, enabledNetworkIds } from '../lib/networks';
import { chains } from './providers';
import {isIframe} from "@fantohm/shared-helpers";

export const getURI = (networkId: NetworkId): string => {
  console.log(chains[networkId].rpcUrls[0]);
  return chains[networkId].rpcUrls[0];
};

const Web3Context = React.createContext<Web3ContextData>(null);

export const useWeb3Context = () => {
  const web3Context = useContext(Web3Context);
  if (!web3Context) {
    throw new Error(
      'useWeb3Context() can only be used inside of <Web3ContextProvider />, ' +
        'please declare it at a higher level.'
    );
  }
  const { onChainProvider } = web3Context;
  return useMemo(() => {
    return { ...onChainProvider };
  }, [web3Context]);
};

const saveNetworkId = (NetworkId: NetworkId) => {
  if (window.localStorage) {
    window.localStorage.setItem('defaultNetworkId', NetworkId.toString());
  }
};

const getSavedNetworkId = () => {
  const savedNetworkId =
    window.localStorage && window.localStorage.getItem('defaultNetworkId');
  if (savedNetworkId) {
    const parsedNetworkId = parseInt(savedNetworkId);
    if (enabledNetworkIds.includes(parsedNetworkId)) {
      return parsedNetworkId;
    }
  }
  return null;
};

export const Web3ContextProvider: React.FC<{ children: ReactElement }> = ({
  children,
}) => {
  const [connected, setConnected] = useState(false);

  const defaultNetworkId = getSavedNetworkId() || NetworkIds.FantomOpera;
  const [chainId, setChainID] = useState(defaultNetworkId);
  const [address, setAddress] = useState('');
  const [provider, setProvider] = useState<JsonRpcProvider | null>(null);

  const rpcUris = enabledNetworkIds.reduce(
    (rpcUris: { [key: string]: string }, NetworkId: NetworkId) => (
      (rpcUris[NetworkId] = getURI(NetworkId)), rpcUris
    ),
    {}
  );

  const [web3Modal, setWeb3Modal] = useState<Web3Modal>(
    new Web3Modal({
      cacheProvider: true, // optional
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            rpc: rpcUris,
          },
        },
      },
    })
  );

  const hasCachedProvider = (): boolean => {
    if (!web3Modal) return false;
    if (!web3Modal.cachedProvider) return false;
    return true;
  };

  // NOTE (appleseed): none of these listeners are needed for Backend API Providers
  // ... so I changed these listeners so that they only apply to walletProviders, eliminating
  // ... polling to the backend providers for network changes
  const _initListeners = useCallback(
    (rawProvider) => {
      if (!rawProvider.on) {
        return;
      }
      rawProvider.on('accountsChanged', async (accounts: string[]) => {
        setTimeout(() => window.location.reload(), 1);
      });

      rawProvider.on('chainChanged', async (chain: string) => {
        let chainId;
        // On mobile chain comes in as a number but on web it comes in as a hex string
        if (typeof chain === 'number') {
          chainId = chain;
        } else {
          chainId = parseInt(chain, 16);
        }
        setChainID(chainId);
        if (!_checkNetwork(chainId)) {
          disconnect();
        }
        setTimeout(() => window.location.reload(), 1);
      });

      rawProvider.on('network', (_newNetwork: any, oldNetwork: any) => {
        if (!oldNetwork) return;
        window.location.reload();
      });
    },
    [provider]
  );

  /**
   * throws an error if NetworkId is not supported
   */
  const _checkNetwork = (otherChainID: number): boolean => {
    if (chainId !== otherChainID) {
      console.warn('You are switching networks');
      if (enabledNetworkIds.includes(otherChainID)) {
        setChainID(otherChainID);
        saveNetworkId(otherChainID);
        return true;
      }
      return false;
    }
    return true;
  };

  const switchEthereumChain = async (
    NetworkId: NetworkId,
    forceSwitch = false
  ) => {
    const chainId = `0x${NetworkId.toString(16)}`;
    if (connected || forceSwitch) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainId }],
        });
        return true;
      } catch (e: any) {
        if (e.code === 4902) {
          if (!(NetworkId in chains)) {
            console.warn(
              `Details of network with chainId: ${chainId} not known`
            );
            return false;
          }
          const chainDetails = chains[NetworkId];
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId,
                  chainName: chainDetails.networkName,
                  nativeCurrency: {
                    symbol: chainDetails.symbol,
                    decimals: chainDetails.decimals,
                  },
                  blockExplorerUrls: chainDetails.blockExplorerUrls,
                  rpcUrls: chainDetails.rpcUrls,
                },
              ],
            });
            return true;
          } catch (addError) {
            console.error(addError);
            return false;
          }
        } else {
          console.error(e);
          return false;
        }
      }
    } else {
      // Wallet not connected, just switch network for static providers
      saveNetworkId(NetworkId);
      window.location.reload();
      return true;
    }
  };

  // connect - only runs for WalletProviders
  const connect = useCallback(async () => {
    // handling Ledger Live;
    let rawProvider;
    if (isIframe()) {
      rawProvider = new IFrameEthereumProvider();
    } else {
      rawProvider = await web3Modal.connect();
    }

    // new _initListeners implementation matches Web3Modal Docs
    // ... see here: https://github.com/Web3Modal/web3modal/blob/2ff929d0e99df5edf6bb9e88cff338ba6d8a3991/example/../App.tsx#L185
    _initListeners(rawProvider);
    const connectedProvider = new Web3Provider(rawProvider, 'any');
    const chainId = await connectedProvider
      .getNetwork()
      .then((network) => network.chainId);
    const connectedAddress = await connectedProvider.getSigner().getAddress();
    const validNetwork = _checkNetwork(chainId);
    if (!validNetwork) {
      const switched = await switchEthereumChain(defaultNetworkId, true);
      if (!switched) {
        web3Modal.clearCachedProvider();
        const errorMessage =
          'Unable to connect. Please change network using provider.';
        console.error(errorMessage);
        //store.dispatch(error(errorMessage));
      }
      return;
    }
    // Save everything after we've validated the right network.
    // Eventually we'll be fine without doing network validations.
    setAddress(connectedAddress);
    setProvider(connectedProvider);

    // Keep this at the bottom of the method, to ensure any repaints have the data we need
    setConnected(true);

    return connectedProvider;
  }, [provider, web3Modal, connected]);

  const disconnect = useCallback(async () => {
    web3Modal.clearCachedProvider();
    setConnected(false);

    setTimeout(() => {
      window.location.reload();
    }, 1);
  }, [provider, web3Modal, connected]);

  const onChainProvider = useMemo(
    () => ({
      connect,
      disconnect,
      hasCachedProvider,
      switchEthereumChain,
      provider,
      connected,
      address,
      chainId,
      web3Modal,
    }),
    [
      connect,
      disconnect,
      hasCachedProvider,
      provider,
      connected,
      address,
      chainId,
      web3Modal,
    ]
  );

  return (
    <Web3Context.Provider value={{ onChainProvider }}>
      {children}
    </Web3Context.Provider>
  );
};
