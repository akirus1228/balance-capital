import {
  Box,
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
    <Box className="flex fc jc-c ai-c" sx={sx}>
      <h2>Owner information</h2>
      <Paper>
        <Grid container>
          <Grid item xs={12} md={4}>
            <SimpleProfile user={owner} />
          </Grid>
          <Grid item xs={12} md={8}>
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
