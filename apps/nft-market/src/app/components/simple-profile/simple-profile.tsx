import { addressEllipsis } from "@fantohm/shared-helpers";
import { Avatar, Box, CircularProgress, SxProps, Theme } from "@mui/material";
import { User } from "../../types/backend-types";
import tmpAvatar from "../../../assets/images/temp-avatar.png";
import style from "./simple-profile.module.scss";

export interface SimpleProfileProps {
  user: User;
  sx?: SxProps<Theme>;
}

export const SimpleProfile = ({ user, sx }: SimpleProfileProps): JSX.Element => {
  if (!user) {
    return (
      <Box className="flex fr fj-c">
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Box className="flex fr ai-c" sx={sx}>
      <Avatar src={user.profileImageUrl || tmpAvatar} />
      <Box className="flex fc" sx={{ ml: "1em" }}>
        <span className={style["ownerName"]}>
          {user.name || addressEllipsis(user.address, 3)}
        </span>
        <span className={style["ownerAddress"]}>{addressEllipsis(user.address, 3)}</span>
      </Box>
    </Box>
  );
};

export default SimpleProfile;
