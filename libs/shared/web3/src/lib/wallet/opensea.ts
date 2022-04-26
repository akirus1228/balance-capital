import axios, { AxiosResponse } from "axios";

export interface Asset {
  contract: Contract; // Dictionary of data on the contract itself
  token_id: number; // The token ID of the NFT
  image_url: string; // An image for the item. Note that this is the cached URL we store on our end.
  background_color: string; // The background color to be displayed with the item
  name: string; // Name of the item
  external_link: string; // External link to the original website for the item
  owner: Owner; // Dictionary of data on the owner
  traits: Trait[]; // A list of traits associated with the item
  last_sale: string | null; // When this item was last sold (null if there was no last sale)
}

export interface Contract {
  name: string; // Name of the asset contract
  symbol: string; // Symbol, such as CKITTY
  image_url: string; // Image associated with the asset contract
  description: string; // Description of the asset contract
  external_link: string; // Link to the original website for this contract
}

export interface Trait {
  value: string; //The name of the trait (for example color)
  display_type: "number" | "boost_percentage" | "boost_number" | "boost_number" | "date"; // How this trait will be displayed (options are number, boost_percentage, boost_number, and date).
}

export interface Owner {
  address: string;
  username: string;
}

export type OpenSeaGetAssetsResponse = {
  assets: Asset[];
};

export const getWalletAssets = (address: string): Promise<Asset[]> => {
  console.log(address);
  const url = `https://testnets-api.opensea.io/api/v1/assets?owner=${address}&order_direction=desc&offset=0&limit=20`;
  console.log(url);
  return axios.get(url).then((resp: AxiosResponse<OpenSeaGetAssetsResponse>) => {
    console.log(resp);
    return resp.data.assets;
  });
};

export default getWalletAssets;
