import { CustomInnerSwitch, setTheme } from "@fantohm/shared-ui-themes";
import { isDev, NetworkIds, useWeb3Context } from "@fantohm/shared-web3";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Icon,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { MouseEvent, MouseEventHandler, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { addressEllipsis } from "@fantohm/shared-helpers";
import { RootState } from "../../../store";
import AvatarPlaceholder from "../../../../assets/images/temp-avatar.png";
import { logout } from "../../../store/reducers/backend-slice";

export const UserMenu = (): JSX.Element => {
  const dispatch = useDispatch();
  // menu controls
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // web3 wallet
  const { connect, disconnect, connected, address, hasCachedProvider, chainId } =
    useWeb3Context();

  const onClickConnect = (event: MouseEvent<HTMLButtonElement>) => {
    connect(false, isDev() ? NetworkIds.Rinkeby : NetworkIds.Ethereum);
  };

  const onClickDisconnect = () => {
    disconnect();
    dispatch(logout());
  };

  // theme control
  const themeType = useSelector((state: RootState) => state.theme.mode);
  const toggleTheme = () => {
    dispatch(setTheme(themeType === "light" ? "dark" : "light"));
  };

  return connected ? (
    <>
      <Button
        id="user-menu-button"
        aria-controls={open ? "user-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{ background: "#FFF", minWidth: "300px", py: "0.5em", fontSize: "16px" }}
      >
        <Avatar sx={{ mr: "1em" }} src={AvatarPlaceholder}></Avatar>
        {addressEllipsis(address)}
        <Icon sx={{ ml: "1em" }} component={ArrowDropDownIcon}></Icon>
      </Button>
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
        <MenuItem>
          <Box key="address-box">{addressEllipsis(address)}</Box>
        </MenuItem>
        <MenuItem>
          <Button href="#">
            Buy USDB on Exchanges
            <Icon component={ArrowForwardOutlinedIcon} />
          </Button>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <PermIdentityOutlinedIcon />
          </ListItemIcon>
          <ListItemText>
            <Link to="/my-account">My profile</Link>
          </ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <ImageOutlinedIcon />
          </ListItemIcon>
          <ListItemText>
            <Link to="/my-account#assets">My assets</Link>
          </ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <CreditCardOutlinedIcon />
          </ListItemIcon>
          <ListItemText>
            <Link to="/my-account#loans">My loans</Link>
          </ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <WbSunnyOutlinedIcon />
          </ListItemIcon>
          <ListItemText>
            {themeType === "dark" ? "Dark theme" : "Light theme"}
          </ListItemText>
          <CustomInnerSwitch onClick={toggleTheme} />
        </MenuItem>
        <Divider />
        <MenuItem onClick={onClickDisconnect}>
          <Icon component={LogoutOutlinedIcon} />
          Disconnect
        </MenuItem>
      </Menu>
    </>
  ) : (
    <Box>
      <Button
        onClick={onClickConnect}
        sx={{
          backgroundColor: "#FFF",
          color: "#000",
          padding: "0.9em",
          minWidth: "300px",
          fontSize: "16px",
        }}
      >
        Connect
      </Button>
    </Box>
  );
};

export default UserMenu;
