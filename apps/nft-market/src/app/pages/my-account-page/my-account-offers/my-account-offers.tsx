import { Box } from "@mui/material";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useGetOffersQuery } from "../../../api/backend-api";
import OffersList from "../../../components/offers-list/offers-list";
import { RootState } from "../../../store";
import { Offer, OfferStatus } from "../../../types/backend-types";
import "./my-account-offers.module.scss";

/* eslint-disable-next-line */
export type MyAccountOffersProps = {};

export function MyAccountOffers(props: MyAccountOffersProps) {
  const { user } = useSelector((state: RootState) => state.backend);

  const { data: offersAsBorrower, isLoading: isOffersAsBorrowerLoading } =
    useGetOffersQuery(
      {
        borrowerAddress: user.address,
      },
      { skip: !user }
    );

  const { data: offersAsLender, isLoading: isOffersAsLenderLoading } = useGetOffersQuery(
    {
      lenderAddress: user.address,
    },
    { skip: !user }
  );

  const activeOffersAsBorrower: Offer[] = useMemo(() => {
    if (isOffersAsBorrowerLoading) return [];
    if (!offersAsBorrower) return [];
    return offersAsBorrower.filter((offer: Offer) => offer.status === OfferStatus.Ready);
  }, [offersAsBorrower]);

  const activeOffersAsLender: Offer[] = useMemo(() => {
    if (isOffersAsLenderLoading) return [];
    if (!offersAsLender) return [];
    return offersAsLender.filter((offer: Offer) => offer.status === OfferStatus.Ready);
  }, [offersAsLender]);

  return (
    <Box className="flex fc fj-c ai-c">
      <Box>
        <h2>Previous offers as a borrower ({activeOffersAsBorrower.length})</h2>
        <OffersList offers={activeOffersAsBorrower} />
      </Box>
    </Box>
  );
}

export default MyAccountOffers;
