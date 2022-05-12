import {
  checkNftPermission,
  requestNftPermission,
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
import store, { RootState } from "../../../../store";
import { BaseSyntheticEvent, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import style from "./terms-form.module.scss";
import { Asset, AssetStatus, Terms } from "../../../../types/backend-types";
import { createListing } from "../../../../store/reducers/listing-slice";
import { selectNftPermFromAsset } from "../../../../store/selectors/wallet-selectors";

export interface TermsFormProps {
  asset: Asset;
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
  const [pending, setPending] = useState(false);
  const [duration, setDuration] = useState(1);
  const [durationType, setDurationType] = useState("days");
  const [apr, setApr] = useState(25);
  const [amount, setAmount] = useState(10000);
  const [repaymentAmount, setRepaymentAmount] = useState(2500);
  const [repaymentTotal, setRepaymentTotal] = useState(12500);

  const { checkPermStatus, requestPermStatus } = useSelector(
    (state: RootState) => state.wallet
  );
  const hasPermission = selectNftPermFromAsset(store.getState().wallet, props.asset);

  // request permission to access the NFT from the contract
  const handlePermissionRequest = useCallback(() => {
    console.log("request permissions");
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
    console.log(`chainId ${chainId}`);
    console.log(`address ${address}`);
    console.log(`props.asset.assetContractAddress ${props.asset.assetContractAddress}`);
    console.log(`provider ${provider}`);
    if (chainId && address && props.asset.assetContractAddress && provider) {
      console.log(`Check perms`);
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
    if (checkPermStatus !== "loading" && requestPermStatus !== "loading") {
      setPending(false);
    } else {
      setPending(true);
    }
  }, [checkPermStatus, requestPermStatus]);

  const handleCreateListing = () => {
    console.log("create listing");
    // send listing data to backend
    setPending(true);
    let asset: Asset;
    if (props.asset.status === AssetStatus.New) {
      asset = { ...props.asset, owner: { address } };
    } else {
      asset = props.asset;
    }
    const expirationAt = new Date();
    expirationAt.setDate(expirationAt.getDate() + 1);
    const terms: Terms = {
      amount,
      apr,
      duration,
      expirationAt,
    };
    dispatch(createListing({ terms, asset: asset }));
  };

  const handleDurationChange = (event: BaseSyntheticEvent) => {
    console.log(event);
    setDuration(event.target.value);
  };

  const handleDurationTypeChange = (event: SelectChangeEvent) => {
    console.log(event);
    if (!["days", "weeks", "months"].includes(event.target.value)) {
      console.warn("invalid duration type");
      return;
    }
    setDurationType(event.target.value);
  };

  const handleAprChange = (event: BaseSyntheticEvent) => {
    console.log(event);
    setApr(event.target.value);
  };

  const handleAmountChange = (event: BaseSyntheticEvent) => {
    console.log(event);
    setAmount(event.target.value);
  };

  // calculate repayment totals
  useEffect(() => {
    const wholePercent = ((termTypes[durationType] * duration) / 365) * apr;
    const realPercent = wholePercent / 100;
    const _repaymentAmount = amount * realPercent;
    setRepaymentAmount(_repaymentAmount);
    setRepaymentTotal(_repaymentAmount + amount);
  }, [durationType, duration, amount, apr]);

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
      {!hasPermission && !pending && (
        <Button variant="contained" onClick={handlePermissionRequest}>
          Allow [name] to Access your NFT
        </Button>
      )}
      {hasPermission && !pending && (
        <Button variant="contained" onClick={handleCreateListing}>
          List as collateral
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
