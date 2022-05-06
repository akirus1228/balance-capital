import { Box, Button, Dialog, Icon, IconButton, Select, Typography } from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import style from "./list-as-collateral.module.scss";
import { useState } from "react";
import { TermsForm } from "./terms-form/terms-form";
import { Asset } from "@fantohm/shared-web3";

/* eslint-disable-next-line */
export interface ListAsCollateralProps {
  open: boolean;
  asset: Asset;
  onClose: (value: boolean) => void;
}

enum DialogState {
  DISCLAIMER,
  TERMS,
}

export const ListAsCollateral = (props: ListAsCollateralProps): JSX.Element => {
  const [dialogState, setDialogState] = useState<DialogState>(DialogState.DISCLAIMER);
  const { onClose, open } = props;

  const handleClose = () => {
    onClose(false);
    // resetting state displays content before the window rerenders.
    // Adding timeout so user doesn't see it.
    setTimeout(() => {
      setDialogState(DialogState.DISCLAIMER);
    }, 300);
  };

  const DisclaimerComponent = (): JSX.Element => {
    return (
      <>
        <Typography>
          Here are a few things you must acknowledge before you continue.
        </Typography>
        <Typography>
          Posting an NFT as collateral means you are granting [name] access to manage your
          NFT.
        </Typography>
        <Typography>
          You can repay a loan at any time within the agreed terms, but you must still pay
          the full interest amount.
        </Typography>
        <Typography>
          You can only repay the loan with the wallet you started it with.
        </Typography>
        <Typography>
          Once a loan has been defaulted on, it cannot be repaid any longer and the lender
          becomes the sole owner.
        </Typography>
        <Button onClick={onAcceptTerms} variant="contained">
          Accept & continue
        </Button>
      </>
    );
  };

  const onAcceptTerms = () => {
    setDialogState(DialogState.TERMS);
  };

  return (
    <Dialog onClose={handleClose} open={open} sx={{ padding: "1.5em" }}>
      <Box className={`flex fr fj-e ${style["header"]}`}>
        <IconButton onClick={handleClose}>
          <CancelOutlinedIcon />
        </IconButton>
      </Box>
      <Box className={`flex fc ${style["body"]}`}>
        {dialogState === DialogState.DISCLAIMER && <DisclaimerComponent />}
        {dialogState === DialogState.TERMS && <TermsForm asset={props.asset} />}
      </Box>
    </Dialog>
  );
};

export default ListAsCollateral;
