import { formatCurrency } from "@fantohm/shared-helpers";
import { Avatar, Button } from "@mui/material";
import { PaperTableCell, PaperTableRow } from "@fantohm/shared-ui-themes";
import { useTermDetails } from "../../hooks/use-term-details";
import {
  AssetStatus,
  ListingStatus,
  Loan,
  LoanStatus,
  Offer,
  OfferStatus,
} from "../../types/backend-types";
import { useCallback, useEffect, useState } from "react";
import {
  useCreateLoanMutation,
  useGetAssetsQuery,
  useUpdateOfferMutation,
} from "../../api/backend-api";
import { useDispatch, useSelector } from "react-redux";
import store, { RootState } from "../../store";
import { selectNftPermFromAsset } from "../../store/selectors/wallet-selectors";
import { selectAssetById } from "../../store/selectors/asset-selectors";
import { contractCreateLoan } from "../../store/reducers/loan-slice";
import {
  isDev,
  NetworkIds,
  requestNftPermission,
  useWeb3Context,
  checkNftPermission,
} from "@fantohm/shared-web3";

export type OfferListItemProps = {
  offer: Offer;
};

type AppDispatch = typeof store.dispatch;

export const OfferListItem = ({ offer }: OfferListItemProps): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const [isPending, setIsPending] = useState(false);
  const [isRequestingPerms, setIsRequestingPerms] = useState(false);
  const { user, authSignature } = useSelector((state: RootState) => state.backend);
  const { loanCreationStatus } = useSelector((state: RootState) => state.loans);
  const { address: walletAddress, provider } = useWeb3Context();
  const { repaymentTotal, repaymentAmount } = useTermDetails(offer.term);

  // createloan backend api call
  const [
    createLoan,
    { isLoading: isCreating, error: createLoanError, data: createLoanData },
  ] = useCreateLoanMutation();

  const [updateOffer, { isLoading: isUpdatingOffer }] = useUpdateOfferMutation();

  // nft permission status updates from state
  const { requestPermStatus } = useSelector((state: RootState) => state.wallet);

  const asset = useSelector((state: RootState) =>
    selectAssetById(state, offer.assetListing.asset.id || "")
  );

  // getAssets backend api call
  useGetAssetsQuery(
    {
      openseaIds: [asset.openseaId || ""],
    },
    {
      skip: !asset || !!asset.id || !authSignature,
    }
  );

  // select perm status for this asset from state
  const hasPermission = useSelector((state: RootState) =>
    selectNftPermFromAsset(state, offer.assetListing.asset)
  );

  useEffect(() => {
    if (
      (isUpdatingOffer ||
        isCreating ||
        requestPermStatus === "loading" ||
        loanCreationStatus === "loading") &&
      isPending
    ) {
      setIsPending(true);
    } else {
      setIsPending(false);
    }
  }, [isUpdatingOffer, isCreating, requestPermStatus, loanCreationStatus, isPending]);

  // check the contract to see if we have perms already
  useEffect(() => {
    if (offer.assetListing.asset.assetContractAddress && provider) {
      console.log(`Check perms`);
      dispatch(
        checkNftPermission({
          networkId: isDev() ? NetworkIds.Rinkeby : NetworkIds.Ethereum,
          provider,
          walletAddress: user.address,
          assetAddress: offer.assetListing.asset.assetContractAddress,
          tokenId: offer.assetListing.asset.tokenId,
        })
      );
    }
  }, [offer]);

  const handleRequestPermission = useCallback(async () => {
    // create the loan
    if (!hasPermission && provider) {
      setIsRequestingPerms(true);
      setIsPending(true);
      const response = await dispatch(
        requestNftPermission({
          networkId: isDev() ? NetworkIds.Rinkeby : NetworkIds.Ethereum,
          provider,
          assetAddress: offer.assetListing.asset.assetContractAddress,
          walletAddress,
          tokenId: offer.assetListing.asset.tokenId,
        })
      );
      console.log(response);
    }
  }, [offer.id, provider, hasPermission]);

  // automatically trigger accept offer after setting up perms
  useEffect(() => {
    if (isRequestingPerms && requestPermStatus !== "loading") {
      handleAcceptOffer();
    }
  }, [requestPermStatus, isRequestingPerms]);

  const handleAcceptOffer = useCallback(async () => {
    // create the loan
    if (!hasPermission || !provider || !asset.owner) {
      console.warn("You must first provide permission to your NFT");
      return;
    }
    setIsPending(true);

    const createLoanRequest: Loan = {
      lender: offer.lender,
      borrower: asset.owner,
      assetListing: {
        ...offer.assetListing,
        status: ListingStatus.Completed,
        asset: { ...asset, status: AssetStatus.Locked },
      },
      term: offer.term,
      status: LoanStatus.Active,
    };

    const createLoanParams = {
      loan: createLoanRequest,
      provider,
      networkId: isDev() ? NetworkIds.Rinkeby : NetworkIds.Ethereum,
    };

    const createLoanResult = await dispatch(
      contractCreateLoan(createLoanParams)
    ).unwrap();

    console.log(createLoanResult);
    if (createLoanResult) {
      createLoanRequest.contractLoanId = createLoanResult;
      createLoan(createLoanRequest);
    }

    // update offer as accepted
    const updateOfferRequest = { ...offer, status: OfferStatus.Accepted };
    updateOffer(updateOfferRequest);
  }, [offer.id, offer.term, offer.assetListing, provider, hasPermission]);

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
        {!hasPermission && !isPending && offer.status === OfferStatus.Ready && (
          <Button variant="contained" className="offer" onClick={handleRequestPermission}>
            Accept
          </Button>
        )}
        {hasPermission && !isPending && offer.status === OfferStatus.Ready && (
          <Button variant="contained" className="offer" onClick={handleAcceptOffer}>
            Accept
          </Button>
        )}
        {isPending && (
          <Button variant="contained" className="offer">
            Pending...
          </Button>
        )}
        {offer.status !== OfferStatus.Ready && (
          <Button variant="contained" className="offer">
            {offer.status}
          </Button>
        )}
      </PaperTableCell>
    </PaperTableRow>
  );
};
