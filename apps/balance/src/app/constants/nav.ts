import { SxProps, Theme } from "@mui/material";

export type PageParams = {
  sx?: SxProps<Theme> | undefined;
  comingSoon?: boolean;
};

export type Page = {
  title: string;
  params?: PageParams;
  href?: string;
};

export type FooterItem = {
  label: string;
  pages: Page[];
};

export const headerPages: Page[] = [
  { title: "Traditional Finance", href: "/trad-fi", params: { comingSoon: false } },
  { title: "Stablecoin Farming", href: "/staking", params: { comingSoon: false } },
  { title: "Mint USDB", href: "/mint", params: { comingSoon: false } },
  { title: "xFHM", href: "/xfhm?enable-testnet=true", params: { comingSoon: true } },
  { title: "USDB Bank", href: "", params: { comingSoon: true } },
  {
    title: "Bridge",
    href: "https://synapseprotocol.com/?inputCurrency=USDB&outputCurrency=USDB&outputChain=1",
    params: { comingSoon: false },
  },
];

export const balanceheaderPages: Page[] = [
  { title: "FHM", href: "/fhm", params: { comingSoon: false } },
  { title: "USDB", href: "/about#usdb", params: { comingSoon: false } },
  { title: "Liqd NFTs", href: "https://www.liqdnft.com/", params: { comingSoon: false } },
  { title: "Dex", href: "https://app.fantohm.com/#/dex", params: { comingSoon: false } },
];

export const footerItems: FooterItem[] = [
  {
    label: "Products",
    pages: [
      { title: "FHM", href: "/fhm", params: { comingSoon: false } },
      { title: "USDB", href: "/about#usdb", params: { comingSoon: false } },
      {
        title: "Liqd NFTs",
        href: "https://www.liqdnft.com/",
        params: { comingSoon: false },
      },
      {
        title: "Dex",
        href: "https://app.fantohm.com/#/dex",
        params: { comingSoon: false },
      },
    ],
  },
  {
    label: "Useful Links",
    pages: [
      { title: "Documentation", href: "https://fantohm.gitbook.io/documentation" },
      {
        title: "Audits",
        href: "https://github.com/fantohm-dev/fantohm-contracts/tree/main/audit",
      },
      { title: "FantOHM", href: "https://app.fantohm.com/" },
    ],
  },
  {
    label: "Community",
    pages: [
      { title: "Twitter", href: "https://twitter.com/usdb_" },
      { title: "Discord", href: "https://discord.com/invite/8wAQWZgjCv" },
      {
        title: "Youtube",
        href: "https://www.youtube.com/channel/UCa1eJEgcVnFhfLNdjw3yr4g",
      },
      { title: "Reddit", href: "https://www.reddit.com/r/USDB_OFFICIAL/" },
    ],
  },
];
