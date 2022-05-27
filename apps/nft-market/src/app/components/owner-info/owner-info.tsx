import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Icon,
  Paper,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { User } from "../../types/backend-types";
import SimpleProfile from "../simple-profile/simple-profile";
import "./owner-info.module.scss";
import ArrowRightUp from "../../../assets/icons/arrow-right-up.svg";

export interface OwnerInfoProps {
  owner: User | undefined;
  sx?: SxProps<Theme>;
}

export const OwnerInfo = ({ owner, sx }: OwnerInfoProps): JSX.Element => {
  if (!owner) {
    return (
      <Box className="flex fr fj-c">
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Box className="flex fc fj-fs" sx={{ ...sx }}>
      <h2>Owner information</h2>
      <Paper>
        <Grid container>
          <Grid item xs={12} md={5}>
            <Box className="flex fc fj-fe">
              <SimpleProfile user={owner} />
              <Button
                className="slim lowContrast"
                variant="contained"
                sx={{ fontSize: "10px", alignSelf: "end" }}
              >
                View on Etherscan
                <img
                  src={ArrowRightUp}
                  style={{ height: "10px", width: "10px", marginLeft: "1em" }}
                  alt="arrow pointing up and to the right"
                />
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={7}>
            <Box className="flex fc">
              <Typography>
                Overview <Icon component={InfoOutlinedIcon} />
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default OwnerInfo;
