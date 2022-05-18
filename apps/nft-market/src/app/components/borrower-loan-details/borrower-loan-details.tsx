import {
  Box,
  Button,
  Container,
  LinearProgress,
  Paper,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import { Asset } from "../../types/backend-types";
import style from "./borrower-loan-details.module.scss";

export interface BorrowerLoanDetailsProps {
  asset: Asset;
  sx?: SxProps<Theme>;
}

export const BorrowerLoanDetails = (props: BorrowerLoanDetailsProps): JSX.Element => {
  return (
    <Container sx={props.sx}>
      <Paper>
        <Box className="flex fr fj-sa fw">
          <Box className="flex fc">
            <Typography className={style["label"]}>Total repayment</Typography>
            <Typography className={`${style["data"]} ${style["primary"]}`}>
              $35,150
            </Typography>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>Principal</Typography>
            <Typography className={`${style["data"]}`}>$32,500</Typography>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>APY</Typography>
            <Typography className={`${style["data"]}`}>10%</Typography>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>Time until loan expires</Typography>
            <Box className="flex fr w100">
              <Typography className={`${style["data"]}`}>55/60 days</Typography>
              <LinearProgress variant="determinate" value={10} />
            </Box>
          </Box>
          <Box className="flex fc">
            <Button variant="contained">Repay loan</Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default BorrowerLoanDetails;
