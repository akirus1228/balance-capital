import { PaperTable, PaperTableCell, PaperTableHead } from "@fantohm/shared-ui-themes";
import { Box, CircularProgress, Container, TableBody, TableRow } from "@mui/material";
import { Offer } from "../../types/backend-types";
import { OfferListItem } from "./offer-list-item";
import style from "./offers-list.module.scss";

export enum OffersListFields {
  LENDER_PROFILE = "Offered by",
  LENDER_ADDRESS = "Lender",
  BORROWER_ADDRESS = "Borrower",
  OWNER_PROFILE = "Owner",
  REPAYMENT_TOTAL = "Loan value",
  REPAYMENT_AMOUNT = "Repayment",
  INTEREST_DUE = "Interest due",
  APR = "APR",
  DURATION = "Duration",
  EXPIRATION = "Expires",
  ASSET = "Asset",
  NAME = "Name",
  STATUS = "Status",
}
export interface OffersListProps {
  offers: Offer[] | undefined;
  fields: OffersListFields[];
  isLoading?: boolean;
  title?: string;
}

export const OffersList = ({
  offers,
  fields,
  isLoading,
  title,
}: OffersListProps): JSX.Element => {
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
    <Container sx={{ pt: "4em", mt: "5em" }} maxWidth="xl">
      <h2 className={style["title"]}>
        {title || "Offers"} ({!!offers && offers.length})
      </h2>
      <PaperTable>
        <PaperTableHead>
          <TableRow>
            {fields.map((field: OffersListFields, index: number) => (
              <PaperTableCell key={`offer-table-header-${index}`}>{field}</PaperTableCell>
            ))}
            <PaperTableCell></PaperTableCell>
          </TableRow>
        </PaperTableHead>
        <TableBody>
          {offers &&
            !isLoading &&
            offers.map((offer: Offer, index: number) => (
              <OfferListItem key={`offer-${index}`} offer={offer} fields={fields} />
            ))}
        </TableBody>
      </PaperTable>
    </Container>
  );
};

export default OffersList;
