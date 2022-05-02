import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { Badge, IconButton, Menu, MenuItem } from "@mui/material";
import { MouseEvent, useState } from "react";

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
        <MenuItem>Something</MenuItem>
      </Menu>
    </>
  );
};

export default NotificationMenu;
