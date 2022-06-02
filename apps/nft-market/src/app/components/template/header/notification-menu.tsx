import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import {
  Avatar,
  Badge,
  Box,
  CircularProgress,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { MouseEvent, useState } from "react";
import { useSelector } from "react-redux";
import { useGetUserNotificationsQuery } from "../../../api/backend-api";
import { RootState } from "../../../store";
import {
  Importance,
  Notification,
  NotificationStatus,
} from "../../../types/backend-types";

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
  // user data
  const { user } = useSelector((state: RootState) => state.backend);
  const { data: notifications, isLoading } = useGetUserNotificationsQuery(
    { userAddress: user.address, status: NotificationStatus.Unread },
    { skip: !user || !user.address }
  );

  if (isLoading)
    return (
      <Box className="flex fr fj-c ai-c">
        <CircularProgress />
      </Box>
    );
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
        <a href={"/my-account#4"}>view all</a>
        {notifications?.map((notification, i: number) => (
          <MenuItem key={`not-men-${i}`}>
            <Avatar />
            <ListItemText primary={notification.message} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default NotificationMenu;
