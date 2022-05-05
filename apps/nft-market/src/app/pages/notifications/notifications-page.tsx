import style from "./notifications.module.scss";
import { Importance, Notification, NotificationStatus } from "@fantohm/shared-web3";
import { Avatar, ListItemText, MenuItem } from "@mui/material";

export const NotificationsPage = (): JSX.Element => {
  const notification: Notification = {
    user: {
      address: "",
      createdAt: "",
      description: "",
      email: "",
      id: "",
      name: "",
      profileImageUrl: "",
      updatedAt: "",
    },
    importance: Importance.High,
    message: "Your loan for CyptoPunk #1234 is due in 24 hours",
    status: NotificationStatus.Unread,
  };
  const notifications: Notification[] = [notification, notification];
  return (
    <div className={style["imgContainer"]}>
      {notifications.map((bond, i) => (
        <div style={{ outline: "solid", outlineColor: "black", borderRadius: "10px" }}>
          <Avatar />
          <ListItemText primary={notification.message} />
        </div>
      ))}
    </div>
  );
};

export default NotificationsPage;
