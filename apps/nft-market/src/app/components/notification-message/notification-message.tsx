import { Avatar, Box } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetAssetQuery,
  useGetListingQuery,
  useGetLoanQuery,
  useGetOfferQuery,
  useUpdateUserNotificationMutation,
} from "../../api/backend-api";
import { selectAssetByAddress } from "../../store/selectors/asset-selectors";
import {
  Asset,
  Notification,
  NotificationContext,
  NotificationStatus,
  Terms,
  User,
  UserType,
} from "../../types/backend-types";
import "./notification-message.module.scss";
import avatarPlaceholder from "../../../assets/images/profile-placeholder.svg";
import { useTermDetails } from "../../hooks/use-term-details";
import { addressEllipsis, formatCurrency } from "@fantohm/shared-helpers";
import { useNavigate } from "react-router-dom";

export interface NotificationMessageProps {
  notification: Notification;
  short?: boolean;
}

export type MessageProp = {
  notification: Notification;
  asset: Asset;
  short: boolean;
  terms?: Terms;
};

const NewLoanLender = ({
  notification,
  asset,
  short,
  terms,
}: MessageProp): JSX.Element => {
  return <span>New loan lender</span>;
};

const NewLoanBorrower = ({
  notification,
  asset,
  short,
  terms,
}: MessageProp): JSX.Element => {
  const { repaymentTotal } = useTermDetails(terms);
  const shortMsg = (
    <span>
      {addressEllipsis(asset.owner.address, 3)} has funded your loan on {asset.name}
    </span>
  );
  const longMsg = (
    <span>
      {addressEllipsis(asset.owner.address, 3)} has repaid their loan on {asset.name}.
      {formatCurrency(repaymentTotal, 2)} has been transferred to your wallet.
    </span>
  );
  return (
    <Box className="flex fc">
      {shortMsg}
      {!short && longMsg}
    </Box>
  );
};

const LiquidationLender = ({
  notification,
  asset,
  short,
  terms,
}: MessageProp): JSX.Element => {
  const shortMsg = <span>The loan on {asset.name} has been liquidated.</span>;
  const longMsg = (
    <span>
      You liquidated the loan on {asset.name} and the token has been transferred to your
      wallet.
    </span>
  );
  return (
    <Box className="flex fc">
      {shortMsg}
      {!short && longMsg}
    </Box>
  );
};

const LiquidationBorrower = ({
  notification,
  asset,
  short,
}: MessageProp): JSX.Element => {
  const shortMsg = <span>The loan on {asset.name} has been liquidated.</span>;
  const longMsg = (
    <span>
      The loan on {asset.name} has expired without payment and the lender has claimed the
      collateral.
    </span>
  );
  return (
    <Box className="flex fc">
      {shortMsg}
      {!short && longMsg}
    </Box>
  );
};

const RepaymentLender = ({
  notification,
  asset,
  short,
  terms,
}: MessageProp): JSX.Element => {
  const { repaymentTotal } = useTermDetails(terms);
  const shortMsg = (
    <span>
      {addressEllipsis(asset.owner.address, 3)} has repaid their loan on {asset.name}
    </span>
  );
  const longMsg = (
    <span>
      {addressEllipsis(asset.owner.address, 3)} has repaid their loan on {asset.name}.
      {formatCurrency(repaymentTotal, 2)} has been transferred to your wallet.
    </span>
  );
  return (
    <Box className="flex fc">
      {shortMsg}
      {!short && longMsg}
    </Box>
  );
};

const RepaymentBorrower = ({
  notification,
  asset,
  short,
  terms,
}: MessageProp): JSX.Element => {
  const { repaymentTotal } = useTermDetails(terms);
  const shortMsg = <span>You have repaid your loan on {asset.name}</span>;
  const longMsg = (
    <span>
      Your loan has repaid their loan on and {asset.name} has been transferred back to
      your wallet.
    </span>
  );
  return (
    <Box className="flex fc">
      {shortMsg}
      {!short && longMsg}
    </Box>
  );
};

const NewOfferLender = ({
  notification,
  asset,
  short,
  terms,
}: MessageProp): JSX.Element => {
  const { repaymentAmount } = useTermDetails(terms);
  const shortMsg = <span>You gave new offer on {asset.name}</span>;
  const longMsg = (
    <span>
      You have given a new offer on {asset.name} for{" "}
      {formatCurrency(terms?.amount || 0, 2)} over {terms?.duration} days, with a
      repayment of {formatCurrency(repaymentAmount || 0, 2)}.
    </span>
  );
  return (
    <Box className="flex fc">
      {shortMsg}
      {!short && longMsg}
    </Box>
  );
};

const NewOfferBorrower = ({
  notification,
  asset,
  short,
  terms,
}: MessageProp): JSX.Element => {
  const { repaymentAmount } = useTermDetails(terms);
  const shortMsg = <span>You have a new offer on {asset.name}</span>;
  const longMsg = (
    <span>
      You have recieved an offer on {asset.name} for{" "}
      {formatCurrency(terms?.amount || 0, 2)} over {terms?.duration} days, with a
      repayment of {formatCurrency(repaymentAmount || 0, 2)}.
    </span>
  );
  return (
    <Box className="flex fc">
      {shortMsg}
      {!short && longMsg}
    </Box>
  );
};

const OfferAcceptedLender = ({
  notification,
  asset,
  short,
  terms,
}: MessageProp): JSX.Element => {
  const { repaymentAmount } = useTermDetails(terms);
  const shortMsg = (
    <span>
      {addressEllipsis(asset.owner.address, 3)} has accepted your offer on {asset.name}
    </span>
  );
  const longMsg = (
    <span>
      {addressEllipsis(asset.owner.address, 3)} has accepted your offer on {asset.name}{" "}
      for {formatCurrency(terms?.amount || 0, 2)} over {terms?.duration} days, with a
      repayment of {formatCurrency(repaymentAmount || 0, 2)}.
    </span>
  );
  return (
    <Box className="flex fc">
      {shortMsg}
      {!short && longMsg}
    </Box>
  );
};

const OfferAcceptedBorrower = ({
  notification,
  asset,
  short,
  terms,
}: MessageProp): JSX.Element => {
  const { repaymentAmount } = useTermDetails(terms);
  const shortMsg = <span>You have accepted an offer on {asset.name}</span>;
  const longMsg = (
    <span>
      You have accepted an offer on {asset.name}
      for {formatCurrency(terms?.amount || 0, 2)} over {terms?.duration} days, with a
      repayment of {formatCurrency(repaymentAmount || 0, 2)}.
    </span>
  );
  return (
    <Box className="flex fc">
      {shortMsg}
      {!short && longMsg}
    </Box>
  );
};

export const NotificationMessage = ({
  notification,
  short,
}: NotificationMessageProps): JSX.Element => {
  const [assetListingId, setAssetListingId] = useState<string>();
  const [loanId, setLoanId] = useState<string>();
  const [offerId, setOfferId] = useState<string>();
  const [asset, setAsset] = useState<Asset>();
  const [terms, setTerms] = useState<Terms>();
  const [contextType, setContextType] = useState<"loan" | "listing" | "offer">();
  const [lender, setLender] = useState<User>();
  const [borrower, setBorrower] = useState<User>();
  const navigate = useNavigate();
  const [updateNotification, { isLoading: isUpdateLoading }] =
    useUpdateUserNotificationMutation();

  const { data: listing, isLoading: isListingLoading } = useGetListingQuery(
    assetListingId,
    {
      skip: !assetListingId,
    }
  );
  const { data: loan, isLoading: isLoanLoading } = useGetLoanQuery(loanId, {
    skip: !loanId,
  });
  const { data: offer, isLoading: isOfferLoading } = useGetOfferQuery(offerId, {
    skip: !offerId,
  });

  const context = "";

  // set the ID for the correct object to trigger get query
  useEffect(() => {
    switch (notification.context) {
      case NotificationContext.NewLoan:
      case NotificationContext.Liquidation:
      case NotificationContext.Repayment:
        setLoanId(notification.contextId);
        setContextType("loan");
        break;
      case NotificationContext.NewOffer:
        setAssetListingId(notification.contextId);
        setContextType("listing");
        break;
      case NotificationContext.OfferAccepted:
        setOfferId(notification.contextId);
        setContextType("loan");
        break;
    }
  }, [notification.context]);

  // loan is loaded
  const avatarSrc = useMemo(() => {
    switch (contextType) {
      case "loan":
        setAsset(loan?.assetListing.asset);
        setTerms(loan?.term);
        setLender(loan?.lender);
        setBorrower(loan?.borrower);
        return loan && loan.assetListing.asset.imageUrl
          ? loan.assetListing.asset.imageUrl
          : avatarPlaceholder;
        break;
      case "listing":
        setAsset(listing?.asset);
        setTerms(listing?.term);
        setLender({} as User);
        setBorrower(listing?.asset.owner);
        return listing && listing.asset.imageUrl
          ? listing.asset.imageUrl
          : avatarPlaceholder;
        break;
      case "offer":
        setAsset(offer?.assetListing.asset);
        setTerms(offer?.term);
        setLender(offer?.lender);
        setBorrower(offer?.assetListing.asset.owner);
        return offer && offer.assetListing.asset.imageUrl
          ? offer.assetListing.asset.imageUrl
          : avatarPlaceholder;
        break;
      default:
        return avatarPlaceholder;
    }
  }, [contextType, loan, offer, listing]);

  const message = useMemo(() => {
    if (!asset) return <></>;
    const msgParams = {
      notification,
      short: !!short,
      asset,
      terms,
      borrower,
      lender,
    };
    let MsgType;
    switch (notification.context) {
      case NotificationContext.NewLoan:
        MsgType =
          notification.userType === UserType.Lender ? NewLoanLender : NewLoanBorrower;
        break;
      case NotificationContext.Liquidation:
        MsgType =
          notification.userType === UserType.Lender
            ? LiquidationLender
            : LiquidationBorrower;
        break;
      case NotificationContext.Repayment:
        MsgType =
          notification.userType === UserType.Lender ? RepaymentLender : RepaymentBorrower;
        break;
      case NotificationContext.NewOffer:
        MsgType =
          notification.userType === UserType.Lender ? NewOfferLender : NewOfferBorrower;
        break;
      case NotificationContext.OfferAccepted:
        MsgType =
          notification.userType === UserType.Lender
            ? OfferAcceptedLender
            : OfferAcceptedBorrower;
        break;
    }
    return <MsgType {...msgParams} />;
  }, [notification.context, asset, borrower, lender, terms, short]);

  const handleRecordClick = useCallback(() => {
    if (notification?.status !== NotificationStatus.Read) {
      updateNotification({ ...notification, status: NotificationStatus.Read });
    }
    navigate(`/asset/${asset?.assetContractAddress}/${asset?.tokenId}`);
  }, [notification, asset]);

  return (
    <Box className="flex fr ai-c" onClick={handleRecordClick}>
      <Avatar src={avatarSrc} sx={{ mr: "1em" }} />
      {message}
    </Box>
  );
};

export default NotificationMessage;
