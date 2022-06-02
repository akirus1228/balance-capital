import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import {
  Avatar,
  Badge,
  Box,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Paper,
} from "@mui/material";
import { Link } from "react-router-dom";
import { MouseEvent, useState } from "react";
import { useSelector } from "react-redux";
import { useGetUserNotificationsQuery } from "../../../api/backend-api";
import { RootState } from "../../../store";
import { NotificationStatus } from "../../../types/backend-types";
import arrowUpRight from "../../../../assets/icons/arrow-right-up.svg";
import profilePlaceholder from "../../../../assets/images/profile-placeholder.svg";

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
    { userAddress: user.address, status: NotificationStatus.Unread, skip: 0, take: 4 },
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
          sx: {
            "& .MuiMenuItem-root": {
              whiteSpace: "normal",
            },
          },
        }}
        PaperProps={{
          style: {
            padding: "0em 1.5em 0.5em 1.5em",
            margin: "1em 0 0 0",
            borderRadius: "24px",
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box className="flex fr fj-sb" sx={{ mt: "1em" }}>
          <span>Notifications</span>
          <Link to={"/my-account#4"} style={{ color: "#8991A2" }} onClick={handleClose}>
            view all{" "}
            <img
              src={arrowUpRight}
              alt="arrow pointing up and to the right"
              style={{ height: "12px", width: "12px" }}
            />
          </Link>
        </Box>
        {notifications?.map((notification, i: number) => (
          <MenuItem key={`not-men-${i}`} sx={{ maxWidth: "400px" }}>
            <Paper className="w100" sx={{ height: "5em", padding: "1em" }}>
              <Box className="flex fr ai-c w100">
                <Avatar
                  sx={{ mr: "1em" }}
                  src={user.profileImageUrl || profilePlaceholder}
                />
                <span>{notification.message}</span>
              </Box>
            </Paper>
          </MenuItem>
        ))}
        <Box className="flex fr fj-c" sx={{ mt: "1em" }}>
          <span style={{ color: "#8991A2" }}>End of recent activity</span>
        </Box>
      </Menu>
    </>
  );
};

export default NotificationMenu;
