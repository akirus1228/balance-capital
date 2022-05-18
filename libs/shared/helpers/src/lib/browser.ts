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

export const objectToQueryParams = (o: any) =>
  Object.entries(o)
    .map((p: any) => `${encodeURIComponent(p[0])}=${encodeURIComponent(p[1])}`)
    .join("&");
