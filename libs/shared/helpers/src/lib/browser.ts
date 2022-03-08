/**
 * determine if in IFrame for Ledger Live
 */
export const isIframe = () => {
  return window.location !== window.parent.location;
};
