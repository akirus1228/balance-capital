import { Asset } from "@fantohm/shared-web3";
import { Avatar, Box, SxProps, Theme, Typography } from "@mui/material";
import style from "./asset-owner-tag.module.scss";
import tmpAvatar from "../../../assets/images/temp-avatar.png";

export interface AssetOwnerTagProps {
  asset: Asset;
  sx: SxProps<Theme>;
}

export const AssetOwnerTag = (props: AssetOwnerTagProps): JSX.Element => {
  return (
    <Box className={style["aotContainer"]} sx={props.sx}>
      <Avatar src={tmpAvatar} />
      <Box />
      <Box className={style["aotOwnerTitle"]}>
        <Typography className={style["label"]}>Owner</Typography>
        <Typography className={style["name"]}>You</Typography>
      </Box>
    </Box>
  );
};

export default AssetOwnerTag;
