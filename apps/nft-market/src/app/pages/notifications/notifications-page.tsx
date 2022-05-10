import style from "./notifications.module.scss";
import {
  BackendApi,
  Importance,
  Notification,
  NotificationStatus,
  useWeb3Context,
} from "@fantohm/shared-web3";
import { Avatar, ListItemText, MenuItem } from "@mui/material";
import store from "../../store";

export const NotificationsPage = (): JSX.Element => {
  const { address } = useWeb3Context();
  const thisState: any = store.getState().app;

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
  const onDelete = async (id: string | undefined) => {
    if (id) {
      const response = await BackendApi.deleteNotification(
        address,
        thisState.nftMarketplace.authSignature,
        id
      );
      if (response && response.success) {
        removeNotification(id);
      }
    }
    return;
  };

  const onRead = async (notification: Notification) => {
    if (notification) {
      await BackendApi.markAsRead(
        address,
        thisState.nftMarketplace.authSignature,
        notification
      );
    }
    return;
  };

  function removeNotification(id: string) {
    notifications.forEach((value, index) => {
      if (value.id === id) notifications.splice(index, 1);
    });
  }

  return (
    <div className={style["notificationContainer"]}>
      {notifications.map((bond, i) => (
        <div style={{ outline: "solid", outlineColor: "black", borderRadius: "10px" }}>
          <Avatar />
          <ListItemText primary={notification.message} />
          <a style={{ color: "red" }} onClick={() => onRead(notification)}>
            Mark as read
          </a>
          <a style={{ color: "red" }} onClick={() => onDelete(notification.id)}>
            Delete
          </a>
        </div>
      ))}
    </div>
  );
};

export default NotificationsPage;
