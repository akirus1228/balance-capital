import { Box, CircularProgress, Container } from "@mui/material";
import { useSelector } from "react-redux";
import { useGetUserNotificationsQuery } from "../../../api/backend-api";
import { RootState } from "../../../store";
import { Notification } from "../../../types/backend-types";
import "./my-account-activity.module.scss";
import { NotificationEntry } from "./notification-entry";

export const MyAccountActivity = (): JSX.Element => {
  const { user } = useSelector((state: RootState) => state.backend);
  const { data: notifications, isLoading: isNotificationsLoading } =
    useGetUserNotificationsQuery({ userAddress: user.address });

  if (isNotificationsLoading)
    return (
      <Box className="flex fr fj-c ai-c">
        <CircularProgress />
      </Box>
    );
  return (
    <Container maxWidth="lg">
      <Box className="flex fc fj-c ai-c">
        {notifications?.map((notification: Notification) => (
          <NotificationEntry notification={notification} />
        ))}
      </Box>
    </Container>
  );
};

export default MyAccountActivity;
