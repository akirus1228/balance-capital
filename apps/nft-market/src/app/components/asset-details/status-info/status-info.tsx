import { Asset, AssetStatus } from "@fantohm/shared-web3";
import { Box, Icon, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import style from "./status-info.module.scss";

export interface StatusInfoProps {
  asset: Asset;
}

export const StatusInfo = (props: StatusInfoProps): JSX.Element => {
  return (
    <Box className={style["mainContainer"]}>
      <Icon>
        <InfoOutlinedIcon />
      </Icon>
      <Box className={style["textContainer"]}>
        <span className={style["strong"]}>{props.asset.name} </span>
        <span>
          is currently being held in escrow in a smart contract and will be released back
          to its borrower if a repayment amount&nbsp;
        </span>
        <span className={style["strong"]}>of $35,150 in USDB </span>
        <span>is made before </span>
        <span className={style["strong"]}>11:53 PM, 20 July 2022 (GMT +1)</span>
      </Box>
    </Box>
  );
};

export default StatusInfo;
