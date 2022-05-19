import { formatCurrency } from "@fantohm/shared-helpers";
import { Avatar, Button } from "@mui/material";
import { PaperTableCell, PaperTableRow } from "@fantohm/shared-ui-themes";
import { useTermDetails } from "../../hooks/use-term-details";
import { Offer } from "../../types/backend-types";

export type OfferListItemProps = {
  offer: Offer;
};

export const OfferListItem = ({ offer }: OfferListItemProps): JSX.Element => {
  const { repaymentTotal, repaymentAmount } = useTermDetails(offer.term);

  return (
    <PaperTableRow>
      <PaperTableCell>
        <Avatar />
      </PaperTableCell>
      <PaperTableCell>{formatCurrency(repaymentTotal, 2)}</PaperTableCell>
      <PaperTableCell>{formatCurrency(repaymentAmount, 2)}</PaperTableCell>
      <PaperTableCell>{offer.term.apr}%</PaperTableCell>
      <PaperTableCell>{offer.term.duration} days</PaperTableCell>
      <PaperTableCell>**calc expiration time**</PaperTableCell>
      <PaperTableCell>
        <Button variant="contained" className="offer">
          Accept
        </Button>
      </PaperTableCell>
    </PaperTableRow>
  );
};
