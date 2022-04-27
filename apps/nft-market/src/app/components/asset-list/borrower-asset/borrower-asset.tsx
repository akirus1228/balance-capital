import { Asset, createListing, Terms } from "@fantohm/shared-web3";
import { Box, Button, Input } from "@mui/material";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import style from "./borrower-asset.module.scss";

export const NoImg = (): JSX.Element => {
  return (
    <Box
      sx={{
        height: "200px",
        width: "200px",
        border: "1px solid #000",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <span>No Preview Available</span>
    </Box>
  );
};

export interface PreviewImageProps {
  url: string;
  name: string;
}

export const PreviewImg = (props: PreviewImageProps): JSX.Element => {
  return (
    <Box sx={{ height: "200px", width: "200px" }}>
      <img src={props.url} alt={props.name} style={{ height: "100%", width: "auto" }} />
    </Box>
  );
};

enum BorrowerAssetStatus {
  IDLE,
  LOADING,
  PENDING_USER,
  PENDING_TXN,
  TXN_SUCCESS,
  TXN_REJECTED,
}

type BorrowerAssetState = {
  amount: number;
  apr: number;
  duration: number;
  status: BorrowerAssetStatus;
};

export interface BorrowerAssetProps {
  asset: Asset;
}

export const BorrowerAsset = (props: BorrowerAssetProps): JSX.Element => {
  const dispatch = useDispatch();
  const initialState: BorrowerAssetState = {
    amount: 100,
    apr: 20,
    duration: 100,
    status: BorrowerAssetStatus.IDLE,
  };
  const [state, setState] = useState<BorrowerAssetState>(initialState);

  const onCreateListingClick = useCallback(() => {
    console.log("create listing");
    console.log(props.asset);
    dispatch(
      createListing({
        asset: props.asset,
        terms: {
          amount: state.amount,
          apr: state.apr,
          duration: state.duration,
        } as Terms,
      })
    );
  }, [props.asset, state.duration, state.apr, state.amount]);

  return (
    <div style={{ borderBottom: "1px solid #000" }}>
      <span>Collection</span>: <span>{props.asset.collection.name}</span>
      <br />
      <span>Token id</span>: <span>{props.asset.token_id}</span>
      {props.asset.image_url && (
        <PreviewImg url={props.asset.image_url} name={props.asset.name} />
      )}
      {!props.asset.image_url && <NoImg />}
      <Input
        type="number"
        placeholder="amount"
        name="amount"
        defaultValue="100"
        onChange={(e) => setState({ ...state, amount: parseInt(e.target.value) })}
      />
      <Input
        type="number"
        placeholder="apr"
        name="apr"
        defaultValue="20"
        onChange={(e) => setState({ ...state, apr: parseInt(e.target.value) })}
      />
      <Input
        type="number"
        placeholder="duration"
        name="duration"
        defaultValue="100"
        onChange={(e) => setState({ ...state, duration: parseInt(e.target.value) })}
      />
      <Button onClick={onCreateListingClick}>Create listing</Button>
    </div>
  );
};

export default BorrowerAsset;
