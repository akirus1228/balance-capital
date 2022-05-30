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
import { isDev } from "@fantohm/shared-web3";
import { CircleGraph } from "@fantohm/shared/ui-charts";
import { useGetWalletQuery } from "../../api/backend-api";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { formatCurrency } from "@fantohm/shared-helpers";

export interface OwnerInfoProps {
  owner: User | undefined;
  sx?: SxProps<Theme>;
}

export const OwnerInfo = ({ owner, sx }: OwnerInfoProps): JSX.Element => {
  const { user } = useSelector((state: RootState) => state.backend);
  const { data: ownerInfo, isLoading: isOwnerInfoLoading } = useGetWalletQuery(
    user.address,
    { skip: !user.address }
  );

  if (!owner || isOwnerInfoLoading) {
    return (
      <Box className="flex fr fj-c">
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Box className="flex fc fj-fs" sx={{ mb: "5em", ...sx }}>
      <h2>Owner information</h2>
      <Paper className="flex fr fw ai-c" sx={{ minHeight: "180px" }}>
        <Box className="flex fc fw ai-c" sx={{ mr: "2em" }}>
          <SimpleProfile user={owner} />
          <Button
            className="slim lowContrast"
            variant="contained"
            sx={{ fontSize: "10px", mt: "1em" }}
            href={`https://${isDev() ? "rinkeby" : "www"}.etherscan.io/address/${
              owner.address
            }`}
            target="_blank"
          >
            View on Etherscan
            <img
              src={ArrowRightUp}
              style={{ height: "10px", width: "10px", marginLeft: "1em" }}
              alt="arrow pointing up and to the right"
            />
          </Button>
        </Box>
        <Box className="flex fc">
          <Typography>
            Overview <Icon component={InfoOutlinedIcon} />
          </Typography>
          <Box className="flex fr fj-sb" sx={{ mt: "2em" }}>
            <Box className="flex fc" sx={{ mr: "2em" }}>
              <span style={{ color: "#8991A2" }}>Total borrowed</span>
              <span>{formatCurrency(ownerInfo?.totalBorrowed || 0)}</span>
            </Box>
            <Box className="flex fc">
              <span style={{ color: "#8991A2" }}>Total lent</span>
              <span>{formatCurrency(ownerInfo?.totalLent || 0)}</span>
            </Box>
          </Box>
        </Box>
      </Paper>
      <Paper className="flex fr fw ai-c" sx={{ minHeight: "180px", mt: "1em" }}>
        {ownerInfo && (
          <Box className="flex fr fw ai-c" sx={{ mr: "2em" }}>
            <CircleGraph
              progress={(ownerInfo.loansRepaid / ownerInfo.loansDefaulted) * 100}
              sx={{ mr: "2em" }}
            />
            <Box className="flex fc">
              <span>
                Default rate <Icon component={InfoOutlinedIcon} />
              </span>
              <Box className="flex fr">
                <Box className="flex fc">
                  <span>Loans repaid</span>
                  <span>{ownerInfo?.loansRepaid}</span>
                </Box>
                <Box className="flex fc">
                  <span>Loans defaulted</span>
                  <span>{ownerInfo?.loansDefaulted}</span>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </Paper>
      <Paper className="flex fr fw ai-c" sx={{ minHeight: "180px", mt: "1em" }}>
        {ownerInfo && (
          <Box className="flex fr fw ai-c" sx={{ mr: "2em" }}>
            <CircleGraph
              progress={(ownerInfo.loansBorrowed / ownerInfo.loansGiven) * 100}
              sx={{ mr: "2em" }}
            />
            <Box className="flex fc">
              <span>
                Loan Activity <Icon component={InfoOutlinedIcon} />
              </span>
              <Box className="flex fr">
                <Box className="flex fc">
                  <span>Loans borrowed</span>
                  <span>{ownerInfo?.totalBorrowed}</span>
                </Box>
                <Box className="flex fc">
                  <span>Loans given</span>
                  <span>{ownerInfo?.loansGiven}</span>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default OwnerInfo;
