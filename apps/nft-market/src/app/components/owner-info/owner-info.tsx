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
import { useMemo } from "react";
import ColorLabel from "./color-label";

export interface OwnerInfoProps {
  owner: User | undefined;
  sx?: SxProps<Theme>;
}

export const OwnerInfo = ({ owner, sx }: OwnerInfoProps): JSX.Element => {
  const { data: ownerInfo, isLoading: isOwnerInfoLoading } = useGetWalletQuery(
    owner?.address || "",
    { skip: !owner || !owner.address }
  );

  const defaultRate = useMemo(() => {
    if (!ownerInfo) return 0;
    if (ownerInfo?.loansRepaid === 0 && ownerInfo?.loansDefaulted === 0) return 0;
    const totalLoans = ownerInfo.loansDefaulted + ownerInfo.loansRepaid;
    return (ownerInfo.loansDefaulted / totalLoans) * 100;
  }, [ownerInfo?.loansRepaid, ownerInfo?.loansDefaulted]);

  const lendToBorrowRatio = useMemo(() => {
    if (!ownerInfo) return 0;
    if (ownerInfo?.loansBorrowed === 0 && ownerInfo?.loansGiven === 0) return 0;
    const totalLoans = ownerInfo?.loansBorrowed + ownerInfo?.loansGiven;
    return (ownerInfo.loansGiven / totalLoans) * 100;
  }, [ownerInfo?.loansBorrowed, ownerInfo?.loansGiven]);

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
            <CircleGraph progress={defaultRate} sx={{ mr: "2em" }} />
            <Box className="flex fc">
              <span>
                Default rate <Icon component={InfoOutlinedIcon} />
              </span>
              <Box className="flex fr">
                <Box className="flex fc" sx={{ mr: "2em" }}>
                  <ColorLabel color="#1B9385" label="Loans reapid" />
                  <span>{ownerInfo?.loansRepaid}</span>
                </Box>
                <Box className="flex fc">
                  <ColorLabel color="#5731C3" label="Loans defaulted" />
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
            <CircleGraph progress={lendToBorrowRatio} sx={{ mr: "2em" }} />
            <Box className="flex fc">
              <span>
                Loan Activity <Icon component={InfoOutlinedIcon} />
              </span>
              <Box className="flex fr">
                <Box className="flex fc" sx={{ mr: "2em" }}>
                  <ColorLabel color="#1B9385" label="Loans borrowed" />
                  <span>{ownerInfo?.loansBorrowed}</span>
                </Box>
                <Box className="flex fc">
                  <ColorLabel color="#5731C3" label="Loans given" />
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
