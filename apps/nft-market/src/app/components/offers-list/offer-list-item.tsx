import { formatCurrency } from "@fantohm/shared-helpers";
import { Avatar, Box, Button, Paper, styled, TableCell, TableRow } from "@mui/material";
import { PaperTableRow } from "@fantohm/shared-ui-themes";
import { useTermDetails } from "../../hooks/use-term-details";
import { Offer } from "../../types/backend-types";

export type OfferListItemProps = {
  offer: Offer;
};

export const OfferListItem = ({ offer }: OfferListItemProps): JSX.Element => {
  const { repaymentTotal, repaymentAmount } = useTermDetails(offer.term);

  return (
    <PaperTableRow>
      <TableCell>
        <Avatar />
      </TableCell>
      <TableCell>{formatCurrency(repaymentTotal, 2)}</TableCell>
      <TableCell>{formatCurrency(repaymentAmount, 2)}</TableCell>
      <TableCell>{offer.term.apr}%</TableCell>
      <TableCell>{offer.term.duration} days</TableCell>
      <TableCell>**calc expiration time**</TableCell>
      <TableCell>
        <Button variant="contained" className="offer">
          Accept
        </Button>
      </TableCell>
    </PaperTableRow>
  );
};
