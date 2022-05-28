import { Box, Dialog, IconButton } from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import TermsForm from "../terms-form/terms-form";
import style from "./make-offer.module.scss";
import { Listing } from "../../types/backend-types";

export interface MakeOfferProps {
  listing: Listing;
  onClose: (value: boolean) => void;
  open: boolean;
}

export const MakeOffer = (props: MakeOfferProps): JSX.Element => {
  const { onClose, open } = props;

  const handleClose = () => {
    onClose(false);
  };

  return (
    <Dialog onClose={handleClose} open={open} sx={{ padding: "1.5em" }}>
      <Box className="flex fr fj-c">
        <h1 style={{ margin: "0 0 0.5em 0" }}>Make Offer</h1>
      </Box>
      <Box
        className={`flex fr fj-e ${style["header"]}`}
        sx={{ position: "absolute", right: "16px" }}
      >
        <IconButton onClick={handleClose}>
          <CancelOutlinedIcon />
        </IconButton>
      </Box>
      <Box
        className={`flex fc ${style["body"]}`}
        sx={{ borderTop: "1px solid #aaaaaa", paddingTop: "1em" }}
      >
        <TermsForm
          asset={props.listing.asset}
          listing={props.listing}
          onClose={onClose}
        />
      </Box>
    </Dialog>
  );
};

export default MakeOffer;
