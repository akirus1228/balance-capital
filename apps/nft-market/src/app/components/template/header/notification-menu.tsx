import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { Avatar, Badge, IconButton, ListItemText, Menu, MenuItem } from "@mui/material";
import { MouseEvent, useState } from "react";
import {
  Notification,
  LoginResponse,
  Importance,
  NotificationStatus,
} from "@fantohm/shared-web3";

export const NotificationMenu = (): JSX.Element => {
  // menu controls
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
    <>
      <IconButton
        onClick={handleClick}
        sx={{ background: "#FFF", mr: "10px", padding: "12px" }}
      >
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          variant="dot"
          color="success"
        >
          <NotificationsNoneOutlinedIcon sx={{ fontSize: "32px", color: "#000" }} />
        </Badge>
      </IconButton>

      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "user-menu-button",
        }}
        sx={{ display: "flex", flexDirection: "column" }}
      >
        <p>Notifications</p>
        <a href={"/notifications"}>view all</a>
        {notifications.map((bond, i) => (
          <MenuItem>
            <Avatar />
            <ListItemText primary={notification.message} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default NotificationMenu;
