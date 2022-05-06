import { JsonRpcProvider } from "@ethersproject/providers";

/**
 * determine if in IFrame for Ledger Live
 */
export const isIframe = () => {
  return window.location !== window.parent.location;
};

export const sign = async (provider: JsonRpcProvider) => {
  return await provider.getSigner().signMessage("message");
};
