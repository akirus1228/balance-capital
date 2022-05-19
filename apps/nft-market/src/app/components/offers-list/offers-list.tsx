import { PaperTable, PaperTableCell, PaperTableHead } from "@fantohm/shared-ui-themes";
import { Container, TableBody, TableCell, TableRow } from "@mui/material";
import { useGetOffersQuery } from "../../api/backend-api";
import { Offer } from "../../types/backend-types";
import { OfferListItem } from "./offer-list-item";
import style from "./offers-list.module.scss";

/* eslint-disable-next-line */
export interface OffersListProps {}

export const OffersList = (props: OffersListProps): JSX.Element => {
  const { data: offers, isLoading } = useGetOffersQuery({ skip: 0, take: 50 });

  return (
    <Container>
      <PaperTable>
        <PaperTableHead>
          <TableRow>
            <PaperTableCell>Offered by</PaperTableCell>
            <PaperTableCell>Offered value</PaperTableCell>
            <PaperTableCell>Repayment</PaperTableCell>
            <PaperTableCell>Apr</PaperTableCell>
            <PaperTableCell>Duration</PaperTableCell>
            <PaperTableCell>Expires</PaperTableCell>
            <PaperTableCell>Offer made</PaperTableCell>
            <PaperTableCell></PaperTableCell>
          </TableRow>
        </PaperTableHead>
        <TableBody>
          {offers &&
            !isLoading &&
            offers.map((offer: Offer) => <OfferListItem offer={offer} />)}
        </TableBody>
      </PaperTable>
    </Container>
  );
};

export default OffersList;
