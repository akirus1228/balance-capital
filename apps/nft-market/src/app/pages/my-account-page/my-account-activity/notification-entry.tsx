import { useCallback, useMemo } from "react";
import { Avatar, Box, Paper } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { prettifySeconds } from "@fantohm/shared-web3";
import { Notification, NotificationStatus } from "../../../types/backend-types";
import userProfilePic from "../../../../assets/images/profile-placeholder.svg";
import { useUpdateUserNotificationMutation } from "../../../api/backend-api";
import NotificationMessage from "../../../components/notification-message/notification-message";

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
    <Paper sx={{ my: "1em", width: "100%", cursor: "pointer" }}>
      <Box className="flex fr">
        <NotificationMessage notification={notification} />
        <Box sx={{ color: "#8991A2", ml: "auto" }}>{createdAgo} ago</Box>
      </Box>
    </Paper>
  );
};
