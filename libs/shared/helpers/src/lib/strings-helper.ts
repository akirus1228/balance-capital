export const addressEllipsis = (address: string): string => {
  return `${address.slice(0, 8)}...${address.slice(address.length - 6)}`;
};
