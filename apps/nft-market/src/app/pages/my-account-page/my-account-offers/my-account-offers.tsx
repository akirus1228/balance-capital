import { Box } from "@mui/material";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useGetOffersQuery } from "../../../api/backend-api";
import OffersList, {
  OffersListFields,
} from "../../../components/offers-list/offers-list";
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
    return offersAsBorrower.filter((offer: Offer) =>
      [OfferStatus.Ready, OfferStatus.Accepted].includes(offer.status)
    );
  }, [offersAsBorrower]);

  const activeOffersAsLender: Offer[] = useMemo(() => {
    if (isOffersAsLenderLoading) return [];
    if (!offersAsLender) return [];
    return offersAsLender.filter((offer: Offer) =>
      [OfferStatus.Ready, OfferStatus.Accepted].includes(offer.status)
    );
  }, [offersAsLender]);

  const historicalOffersAsBorrower: Offer[] = useMemo(() => {
    if (isOffersAsBorrowerLoading) return [];
    if (!offersAsBorrower) return [];
    return offersAsBorrower.filter((offer: Offer) =>
      [OfferStatus.Cancelled, OfferStatus.Complete, OfferStatus.Expired].includes(
        offer.status
      )
    );
  }, [offersAsBorrower]);

  const historicalOffersAsLender: Offer[] = useMemo(() => {
    if (isOffersAsLenderLoading) return [];
    if (!offersAsLender) return [];
    return offersAsLender.filter((offer: Offer) =>
      [OfferStatus.Cancelled, OfferStatus.Complete, OfferStatus.Expired].includes(
        offer.status
      )
    );
  }, [offersAsLender]);

  const offerListFields = [
    OffersListFields.ASSET,
    OffersListFields.NAME,
    OffersListFields.REPAYMENT_TOTAL,
    OffersListFields.REPAYMENT_AMOUNT,
    OffersListFields.APR,
    OffersListFields.DURATION,
    OffersListFields.EXPIRATION,
    OffersListFields.BORROWER_ADDRESS,
    OffersListFields.LENDER_ADDRESS,
  ];

  return (
    <Box className="flex fc fj-c ai-c">
      <Box>
        <OffersList
          offers={activeOffersAsBorrower}
          fields={offerListFields}
          isLoading={isOffersAsBorrowerLoading}
          title="Current offers as a borrower"
        />
      </Box>
      <Box>
        <OffersList
          offers={activeOffersAsLender}
          fields={offerListFields}
          isLoading={isOffersAsLenderLoading}
          title="Current offers as a lender"
        />
      </Box>
      <Box>
        <OffersList
          offers={historicalOffersAsBorrower}
          fields={offerListFields}
          isLoading={isOffersAsBorrowerLoading}
          title="Previous offers as a borrower"
        />
      </Box>
      <Box>
        <OffersList
          offers={historicalOffersAsLender}
          fields={offerListFields}
          isLoading={isOffersAsLenderLoading}
          title="Previous offers as a lender"
        />
      </Box>
    </Box>
  );
}

export default MyAccountOffers;
