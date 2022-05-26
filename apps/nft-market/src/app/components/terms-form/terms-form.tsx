import {
  addresses,
  checkNftPermission,
  isDev,
  NetworkIds,
  requestErc20Allowance,
  requestNftPermission,
  selectErc20AllowanceByAddress,
  useWeb3Context,
} from "@fantohm/shared-web3";
import {
  Box,
  Button,
  Icon,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { RootState } from "../../store";
import { BaseSyntheticEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import style from "./terms-form.module.scss";
import {
  Asset,
  AssetStatus,
  BackendLoadingStatus,
  Listing,
  Offer,
  OfferStatus,
  Terms,
} from "../../types/backend-types";
import { createListing, updateListing } from "../../store/reducers/listing-slice";
import { selectNftPermFromAsset } from "../../store/selectors/wallet-selectors";
import { signTerms } from "../../helpers/signatures";
import { useCreateOfferMutation, useUpdateTermsMutation } from "../../api/backend-api";

export interface TermsFormProps {
  asset: Asset;
  listing?: Listing;
  onClose: (value: boolean) => void;
}

export type TermTypes = {
  [key: string]: number;
};

export const termTypes: TermTypes = {
  days: 1,
  weeks: 7,
  months: 30,
};

export const TermsForm = (props: TermsFormProps): JSX.Element => {
  const dispatch = useDispatch();
  const { address, chainId, provider } = useWeb3Context();
  // update term backend api call
  const [updateTerms, { isLoading: isTermsUpdateLoading, data: updateTermsResponse }] =
    useUpdateTermsMutation();
  // primary form pending state
  const [pending, setPending] = useState(false);
  // primary term variables
  const [duration, setDuration] = useState(props?.listing?.term.duration || 1);
  const [durationType, setDurationType] = useState("days");
  const [apr, setApr] = useState(props?.listing?.term.apr || 25);
  const [amount, setAmount] = useState(props?.listing?.term.amount || 10000);
  const [repaymentAmount, setRepaymentAmount] = useState(2500);
  //const [repaymentTotal, setRepaymentTotal] = useState(12500);
  // create offer api call
  const [createOffer, { isLoading: isCreateOfferLoading, data: createOfferResponse }] =
    useCreateOfferMutation();
  // select logged in user
  const { user } = useSelector((state: RootState) => state.backend);
  // nft permission status updates from state
  const {
    checkPermStatus,
    requestPermStatus,
    checkErc20AllowanceStatus,
    requestErc20AllowanceStatus,
    platformFee,
  } = useSelector((state: RootState) => state.wallet);
  // select perm status for this asset from state
  const hasPermission = useSelector((state: RootState) =>
    selectNftPermFromAsset(state, props.asset)
  );
  // status of createListing
  const { createListingStatus } = useSelector((state: RootState) => state.listings);
  // select the USDB allowance provided to lending contract for this address
  const usdbAllowance = useSelector((state: RootState) =>
    selectErc20AllowanceByAddress(state, {
      walletAddress: address,
      erc20TokenAddress: addresses[chainId || NetworkIds.Ethereum]["USDB_ADDRESS"],
    })
  );

  // request permission to access the NFT from the contract
  const handlePermissionRequest = useCallback(() => {
    if (chainId && address && props.asset.assetContractAddress && provider) {
      setPending(true);
      dispatch(
        requestNftPermission({
          networkId: chainId,
          provider,
          walletAddress: address,
          assetAddress: props.asset.assetContractAddress,
          tokenId: props.asset.tokenId,
        })
      );
    } else {
      console.warn("unable to process permission request");
    }
  }, [chainId, address, props.asset.assetContractAddress]);

  // check the contract to see if we have perms already
  useEffect(() => {
    if (chainId && address && props.asset.assetContractAddress && provider && isOwner) {
      dispatch(
        checkNftPermission({
          networkId: chainId,
          provider,
          walletAddress: address,
          assetAddress: props.asset.assetContractAddress,
          tokenId: props.asset.tokenId,
        })
      );
    }
  }, [chainId, address, props.asset.assetContractAddress]);

  // watch the status of the wallet for pending txns to clear
  useEffect(() => {
    if (
      checkPermStatus !== "loading" &&
      requestPermStatus !== "loading" &&
      requestErc20AllowanceStatus !== "loading" &&
      checkErc20AllowanceStatus !== "loading"
    ) {
      setPending(false);
    } else {
      setPending(true);
    }
  }, [
    checkPermStatus,
    requestPermStatus,
    requestErc20AllowanceStatus,
    checkErc20AllowanceStatus,
  ]);

  const isOwner = useMemo(() => {
    return address.toLowerCase() === props.asset?.owner?.address.toLowerCase();
  }, [props.asset, address]);

  const handleCreateListing = async () => {
    if (!provider || !chainId) return;
    // send listing data to backend
    setPending(true);
    let asset: Asset;
    if (props.asset.status === AssetStatus.New) {
      asset = { ...props.asset, owner: user };
    } else {
      asset = props.asset;
    }
    const expirationAt = new Date();
    expirationAt.setDate(expirationAt.getDate() + 1);
    const term: Terms = {
      amount,
      apr,
      duration,
      expirationAt,
      signature: "",
    };
    const termSignature = await signTerms(
      provider,
      asset.owner?.address || "",
      chainId,
      asset.assetContractAddress,
      asset.tokenId,
      term
    );
    term.signature = termSignature;
    dispatch(createListing({ term, asset }));
    return;
  };

  const handleUpdateTerms = async () => {
    if (!provider || !chainId || !props.listing) return;
    // send listing data to backend
    setPending(true);
    let asset: Asset;
    if (props.asset.status === AssetStatus.New) {
      asset = { ...props.asset, owner: user };
    } else {
      asset = props.asset;
    }
    const expirationAt = new Date();
    expirationAt.setDate(expirationAt.getDate() + 1);
    const term: Terms = {
      ...props?.listing?.term,
      amount,
      apr,
      duration: termTypes[durationType] * duration,
      expirationAt,
      signature: "",
    };
    const termSignature = await signTerms(
      provider,
      asset.owner?.address || "",
      chainId,
      asset.assetContractAddress,
      asset.tokenId,
      term
    );
    term.signature = termSignature;
    updateTerms(term);
    return;
  };

  useEffect(() => {
    if (
      !isTermsUpdateLoading &&
      typeof updateTermsResponse !== "undefined" &&
      props.listing
    ) {
      dispatch(updateListing({ ...props.listing, term: updateTermsResponse }));
    }
    if (!isTermsUpdateLoading && updateTermsResponse) {
      props.onClose(true);
    }
  }, [isTermsUpdateLoading, updateTermsResponse, props.listing]);

  const handleDurationChange = (event: BaseSyntheticEvent) => {
    setDuration(+event.target.value);
  };

  const handleDurationTypeChange = (event: SelectChangeEvent) => {
    if (!["days", "weeks", "months"].includes(event.target.value)) {
      console.warn("invalid duration type");
      return;
    }
    setDurationType(event.target.value);
  };

  const handleAprChange = (event: BaseSyntheticEvent) => {
    setApr(+event.target.value);
  };

  const handleAmountChange = (event: BaseSyntheticEvent) => {
    setAmount(+event.target.value);
  };

  // calculate repayment totals
  useEffect(() => {
    const wholePercent = ((termTypes[durationType] * duration) / 365) * apr;
    const realPercent = wholePercent / 100;
    const _repaymentAmount = amount * realPercent;
    setRepaymentAmount(_repaymentAmount);
    //setRepaymentTotal(_repaymentAmount + amount);
  }, [durationType, duration, amount, apr]);

  useEffect(() => {
    if (createListingStatus === BackendLoadingStatus.succeeded) {
      props.onClose(true);
    }
  }, [createListingStatus]);

  // make offer logic
  const handleMakeOffer = useCallback(async () => {
    if (!props.listing || !provider || !props.asset.owner) return;
    const expirationAt = new Date();
    expirationAt.setDate(expirationAt.getDate() + 1);
    const { id, ...listingTerm } = props.listing.term;
    const preSigTerm: Terms = {
      ...listingTerm,
      amount: amount,
      duration: termTypes[durationType] * duration,
      apr: apr,
      expirationAt,
      signature: "",
    };

    const signature = await signTerms(
      provider,
      props.listing.asset.wallet || "",
      chainId || isDev() ? NetworkIds.Rinkeby : NetworkIds.Ethereum,
      props.asset.assetContractAddress,
      props.asset.tokenId,
      preSigTerm
    );

    const term = {
      ...preSigTerm,
      signature,
    };

    const offer: Offer = {
      lender: user,
      assetListing: props.listing,
      term,
      status: OfferStatus.Ready,
    };
    createOffer(offer);
  }, [props.listing, provider, props.asset, amount, duration, apr]);

  useEffect(() => {
    if (!isCreateOfferLoading && !!createOfferResponse) {
      props.onClose(true);
    }
  }, [isCreateOfferLoading, createOfferResponse]);

  // request allowance necessary to create loan with these term
  const handleRequestAllowance = useCallback(() => {
    if (provider && address && props.listing) {
      setPending(true);
      dispatch(
        requestErc20Allowance({
          networkId: chainId || (isDev() ? NetworkIds.Rinkeby : NetworkIds.Ethereum),
          provider,
          walletAddress: address,
          assetAddress: addresses[chainId || NetworkIds.Ethereum]["USDB_ADDRESS"],
          amount: amount * (1 + platformFee),
        })
      );
    }
  }, [chainId, address, amount, provider]);

  return (
    <Box className="flex fc">
      <Box className="flex fc">
        <Typography>How much would you like to borrow?</Typography>
        <Box className={`flex fr fj-sb ${style["valueContainer"]}`}>
          <Box className={`flex fr ${style["leftSide"]}`}>
            <Icon>USDB</Icon>
            USDB
          </Box>
          <Box className={`flex fr ${style["rightSide"]}`}>
            <TextField type="number" value={amount} onChange={handleAmountChange} />
            <Typography>{amount}</Typography>
          </Box>
        </Box>
      </Box>
      <Box className="flex fc">
        <Typography>Set loan duration</Typography>
        <Box className={`flex fr fj-sb ${style["valueContainer"]}`}>
          <Select
            value={durationType}
            className={`flex fr ${style["leftSide"]}`}
            onChange={handleDurationTypeChange}
          >
            <MenuItem value="days">Days</MenuItem>
            <MenuItem value="weeks">Weeks</MenuItem>
            <MenuItem value="months">Months</MenuItem>
          </Select>
          <Box className={`flex fr ${style["rightSide"]}`}>
            <TextField value={duration} type="number" onChange={handleDurationChange} />
          </Box>
        </Box>
      </Box>
      <Box className="flex fc">
        <Typography>Set repayment APR</Typography>
        <Box className={`flex fr fj-sb ${style["valueContainer"]}`}>
          <Select value="apr" className={`flex fr ${style["leftSide"]}`}>
            <MenuItem value="apr">APR</MenuItem>
          </Select>
          <Box className={`flex fr ${style["rightSide"]}`}>
            <TextField value={apr} type="number" onChange={handleAprChange} />
            <Typography>{repaymentAmount}</Typography>
          </Box>
        </Box>
      </Box>
      {isOwner && !hasPermission && !pending && (
        <Button variant="contained" onClick={handlePermissionRequest}>
          Allow [name] to Access your NFT
        </Button>
      )}
      {isOwner && hasPermission && !pending && !props.listing && (
        <Button variant="contained" onClick={handleCreateListing}>
          List as collateral
        </Button>
      )}
      {isOwner && hasPermission && !pending && props.listing && (
        <Button variant="contained" onClick={handleUpdateTerms}>
          Update Terms
        </Button>
      )}
      {!isOwner &&
        !pending &&
        props.listing &&
        usdbAllowance >= amount * (1 + platformFee) && (
          <Button variant="contained" onClick={handleMakeOffer}>
            Make Offer
          </Button>
        )}
      {!isOwner &&
        !pending &&
        props.listing &&
        usdbAllowance < amount * (1 + platformFee) && (
          <Button variant="contained" onClick={handleRequestAllowance}>
            Allow [name] to Access your USDB
          </Button>
        )}
      {pending && (
        <Button variant="contained" disabled>
          Pending...
        </Button>
      )}
    </Box>
  );
};

export default TermsForm;
