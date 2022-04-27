import axios, { AxiosResponse } from "axios";
import { Asset, AssetStatus } from "../nft-marketplace-backend";

export interface OpenSeaAsset {
  id: number;
  contract: OpenSeaContract; // Dictionary of data on the contract itself
  token_id: number; // The token ID of the NFT
  image_url: string; // An image for the item. Note that this is the cached URL we store on our end.
  background_color: string; // The background color to be displayed with the item
  name: string; // Name of the item
  external_link: string; // External link to the original website for the item
  owner: OpenSeaOwner; // Dictionary of data on the owner
  traits: OpenSeaTrait[]; // A list of traits associated with the item
  last_sale: string | null; // When this item was last sold (null if there was no last sale)
  collection: OpenSeaCollection; // Dictionary of collection information
  descripton?: string;
  animation_original_url?: string;
  animation_url?: string;
  is_nsfw: boolean;
  
}

export interface OpenSeaContract {
  name: string; // Name of the asset contract
  symbol: string; // Symbol, such as CKITTY
  image_url: string; // Image associated with the asset contract
  description: string; // Description of the asset contract
  external_link: string; // Link to the original website for this contract
}

export interface OpenSeaTrait {
  value: string; //The name of the trait (for example color)
  display_type: "number" | "boost_percentage" | "boost_number" | "boost_number" | "date"; // How this trait will be displayed (options are number, boost_percentage, boost_number, and date).
}

export interface OpenSeaOwner {
  address: string;
  username: string;
}

export type OpenSeaGetAssetsResponse = {
  assets: OpenSeaAsset[];
};

export type OpenSeaCollection = {
  banner_image_url?: string;
  chat_url?: string;
  created_date: string;
  default_to_fiat: boolean;
  description?: string;
  dev_buyer_fee_basis_points: string;
  dev_seller_fee_basis_points: string;
  discord_url?: string;
  display_data: OpenSeaDisplayData;
  external_url?: string;
  featured: boolean;
  featured_image_url?: string;
  hidden: boolean;
  image_url?: string;
  instagram_username?: string;
  is_nsfw: boolean;
  is_subject_to_whitelist: boolean;
  large_image_url?: string;
  medium_username?: string;
  name: string;
  only_proxied_transfers: boolean;
  opensea_buyer_fee_basis_points: string;
  opensea_seller_fee_basis_points: string;
  payout_address?: string;
  require_email: boolean;
  safelist_request_status: string;
  short_description?: string;
  slug: string;
  telegram_url?: string;
  twitter_username?: string;
  wiki_url?: string;
};

export type OpenSeaDisplayData = {
  card_display_style: string;
  images: [];
};

// TODO: use production env to determine correct endpoint
// TODO: Add api token after OpenSea provides it.
export const getWalletAssets = (address: string): Promise<OpenSeaAsset[]> => {
  console.log(address);
  const url = `https://testnets-api.opensea.io/api/v1/assets?owner=${address}&order_direction=desc&offset=0&limit=20`;
  console.log(url);
  return axios.get(url).then((resp: AxiosResponse<OpenSeaGetAssetsResponse>) => {
    console.log(resp);
    return resp.data.assets;
  });
};

export const openSeaToInternalAsset = (asset: OpenSeaAsset): Asset => {
  return {
    ...asset,
    status: AssetStatus.READY,
    openseaId: asset.id.toString(),
    tokenId: asset.token_id.toString(),
    description: asset.description || "",
    imageUrl: asset.image_url || "",
    videoUrl:
    threeDUrl: 

  }
};

export default getWalletAssets;
