import { PaperTable, PaperTableCell, PaperTableHead } from "@fantohm/shared-ui-themes";
import { CircularProgress, Container, TableBody, TableRow } from "@mui/material";
import { useGetOffersQuery } from "../../api/backend-api";
import { BackendOfferQueryParams, Offer } from "../../types/backend-types";
import { OfferListItem } from "./offer-list-item";
import style from "./offers-list.module.scss";

/* eslint-disable-next-line */
export interface OffersListProps {
  queryParams?: Partial<BackendOfferQueryParams>;
}

export const OffersList = ({ queryParams }: OffersListProps): JSX.Element => {
  const { data: offers, isLoading } = useGetOffersQuery(queryParams || {});

  if (isLoading) {
    return <CircularProgress />;
  }
  if ((!offers || offers.length < 1) && !isLoading) {
    return <></>;
  }
  return (
    <Container sx={{ pt: "4em" }}>
      <h2 className={style["title"]}>Offers receved</h2>
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
