import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Listing } from "../types/backend-types";

export const useListing = (listingId: string): Listing | null => {
  console.log("useListing");
  const listing = useSelector((state: RootState) => state.listings.listings[listingId]);

  return listing || ({} as Listing);
};
