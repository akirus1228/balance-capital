import { Box, Icon } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import style from "./status-info.module.scss";
import {
  Asset,
  Listing,
  ListingStatus,
  Loan,
  LoanStatus,
} from "../../../types/backend-types";
import { useTermDetails } from "../../../hooks/use-term-details";
import { formatCurrency } from "@fantohm/shared-helpers";

export interface StatusInfoProps {
  asset: Asset;
  listing?: Listing;
  loan?: Loan;
}

const ListedInfo = ({
  listing,
  repaymentTotal,
}: {
  listing: Listing;
  repaymentTotal: number;
}): JSX.Element => {
  return (
    <Box className={style["mainContainer"]}>
      <Icon>
        <InfoOutlinedIcon />
      </Icon>
      <Box className={style["textContainer"]}>
        <span className={style["strong"]}>{listing.asset.name} </span>
        <span>is currently listed seeking a loan amount of &nbsp;</span>
        <span className={style["strong"]}>
          of {formatCurrency(listing.term.amount)} in USDB.{" "}
        </span>
        <span>Listing expires </span>
        <span className={style["strong"]}>11:53 PM, 20 July 2022 (GMT +1)</span>
      </Box>
    </Box>
  );
};

const LockedInfo = ({
  loan,
  repaymentTotal,
}: {
  loan: Loan;
  repaymentTotal: number;
}): JSX.Element => {
  return (
    <Box className={style["mainContainer"]}>
      <Icon>
        <InfoOutlinedIcon />
      </Icon>
      <Box className={style["textContainer"]}>
        <span className={style["strong"]}>{loan.assetListing.asset.name} </span>
        <span>
          is currently being held in escrow in a smart contract and will be released back
          to its borrower if a repayment amount&nbsp;
        </span>
        <span className={style["strong"]}>
          of {formatCurrency(repaymentTotal)} in USDB{" "}
        </span>
        <span>is made before </span>
        <span className={style["strong"]}>11:53 PM, 20 July 2022 (GMT +1)</span>
      </Box>
    </Box>
  );
};

export const StatusInfo = ({ asset, listing, loan }: StatusInfoProps): JSX.Element => {
  const { repaymentTotal } = useTermDetails(listing?.term);

  console.log(loan);

  if (loan && loan.status === LoanStatus.Active) {
    return <LockedInfo loan={loan} repaymentTotal={repaymentTotal} />;
  } else if (!loan && listing) {
    return <ListedInfo listing={listing} repaymentTotal={repaymentTotal} />;
  } else {
    return <></>;
  }
};

export default StatusInfo;
