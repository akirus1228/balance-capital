import { PaperTable, PaperTableCell, PaperTableHead } from "@fantohm/shared-ui-themes";
import { Box, CircularProgress, Container, TableBody, TableRow } from "@mui/material";
import { useSelector } from "react-redux";
import { useGetOffersQuery } from "../../api/backend-api";
import { RootState } from "../../store";
import { BackendOfferQueryParams, Offer } from "../../types/backend-types";
import { OfferListItem } from "./offer-list-item";
import style from "./offers-list.module.scss";

/* eslint-disable-next-line */
export interface OffersListProps {
  queryParams?: Partial<BackendOfferQueryParams>;
}

export const OffersList = ({ queryParams }: OffersListProps): JSX.Element => {
  const { authSignature } = useSelector((state: RootState) => state.backend);
  const { data: offers, isLoading } = useGetOffersQuery(queryParams || {}, {
    skip: !authSignature,
  });

  if (isLoading) {
    return (
      <Box className="flex fr fj-c">
        <CircularProgress />
      </Box>
    );
  }
  if ((!offers || offers.length < 1) && !isLoading) {
    return <></>;
  }
  return (
    <Container sx={{ pt: "4em" }} maxWidth="xl">
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
            offers.map((offer: Offer, index: number) => (
              <OfferListItem key={`offer-${index}`} offer={offer} />
            ))}
        </TableBody>
      </PaperTable>
    </Container>
  );
};

export default OffersList;
