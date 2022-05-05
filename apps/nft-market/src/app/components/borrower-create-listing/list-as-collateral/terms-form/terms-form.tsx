import {
  Box,
  Button,
  Icon,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import style from "./terms-form.module.scss";

export interface InputItemProps {
  values: any;
}

export const TermsForm = (props: InputItemProps): JSX.Element => {
  const [hasApproval, setHasApproval] = useState(false);
  const [pending, setPending] = useState(false);

  const handleChange = () => {
    console.log("change");
  };

  const handlePermissionRequest = () => {
    console.log("request permissions");
  };

  const handleCreateListing = () => {
    console.log("create listing");
  };

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
            <TextField />
          </Box>
        </Box>
      </Box>
      <Box className="flex fc">
        <Typography>Set loan duration</Typography>
        <Box className={`flex fr fj-sb ${style["valueContainer"]}`}>
          <Select value="days" className={`flex fr ${style["leftSide"]}`}>
            <MenuItem value="days">Days</MenuItem>
            <MenuItem value="weeks">Weeks</MenuItem>
            <MenuItem value="months">Months</MenuItem>
          </Select>
          <Box className={`flex fr ${style["rightSide"]}`}>
            <TextField />
          </Box>
        </Box>
      </Box>
      <Box className="flex fc">
        <Typography>Set repayment APY</Typography>
        <Box className={`flex fr fj-sb ${style["valueContainer"]}`}>
          <Select value="apy" className={`flex fr ${style["leftSide"]}`}>
            <MenuItem value="apy">APY</MenuItem>
          </Select>
          <Box className={`flex fr ${style["rightSide"]}`}>
            <TextField />
          </Box>
        </Box>
      </Box>
      {!hasApproval && (
        <Button variant="contained" onClick={handlePermissionRequest}>
          Allow [name] to Access your NFT
        </Button>
      )}
      {hasApproval && (
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
