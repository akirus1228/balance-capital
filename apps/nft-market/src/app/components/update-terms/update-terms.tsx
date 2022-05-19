import { Box, Dialog, IconButton } from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { Listing } from "../../types/backend-types";
import TermsForm from "../terms-form/terms-form";
import style from "./update-terms.module.scss";

export interface UpdateTermsProps {
  listing: Listing;
  onClose: (value: boolean) => void;
  open: boolean;
}

export const UpdateTerms = (props: UpdateTermsProps): JSX.Element => {
  const { onClose, open } = props;

  const handleClose = () => {
    onClose(false);
  };

  return (
    <Dialog onClose={handleClose} open={open} sx={{ padding: "1.5em" }}>
      <Box className={`flex fr fj-e ${style["header"]}`}>
        <IconButton onClick={handleClose}>
          <CancelOutlinedIcon />
        </IconButton>
      </Box>
      <TermsForm asset={props.listing.asset} listing={props.listing} onClose={onClose} />
    </Dialog>
  );
};

export default UpdateTerms;
