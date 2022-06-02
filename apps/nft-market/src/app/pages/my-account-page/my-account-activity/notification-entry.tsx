import { useMemo } from "react";
import { Avatar, Box, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import { prettifySeconds } from "@fantohm/shared-web3";
import { Notification } from "../../../types/backend-types";
import userProfilePic from "../../../../assets/images/profile-placeholder.svg";

export type NotificationEntryProps = {
  notification: Notification;
};

export const NotificationEntry = ({
  notification,
}: NotificationEntryProps): JSX.Element => {
  const createdAgo = useMemo(() => {
    if (!notification || !notification.createdAt) return "";
    const createdAtTimestamp = Date.parse(notification?.createdAt);
    return prettifySeconds((Date.now() - createdAtTimestamp) / 1000);
  }, [notification.createdAt]);

  return (
    <Link to={``}>
      <Paper sx={{ my: "1em", width: "100%" }}>
        <Box className="flex fr">
          <Avatar src={notification.user.profileImageUrl || userProfilePic} />
          <Box className="flex fc" sx={{ ml: "2em" }}>
            {notification.message}
          </Box>
          <Box sx={{ color: "#8991A2", ml: "auto" }}>{createdAgo} ago</Box>
        </Box>
      </Paper>
    </Link>
  );
};
