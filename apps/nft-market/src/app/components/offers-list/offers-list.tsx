import {
  Box,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
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
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Offered by</TableCell>
              <TableCell>Offered value</TableCell>
              <TableCell>Repayment</TableCell>
              <TableCell>Apr</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Expires</TableCell>
              <TableCell>Offer made</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {offers &&
              !isLoading &&
              offers.map((offer: Offer) => <OfferListItem offer={offer} />)}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default OffersList;
