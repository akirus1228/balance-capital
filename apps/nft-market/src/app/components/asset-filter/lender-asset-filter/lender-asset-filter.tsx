import style from "./lender-asset-filter.module.scss";
import {
  Avatar,
  Box,
  Icon,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

/* eslint-disable-next-line */
export interface LenderAssetFilterProps {}

export const LenderAssetFilter = (props: LenderAssetFilterProps): JSX.Element => {
  return (
    <Box sx={{ maxWidth: "250px", mr: "auto" }}>
      <Select
        labelId="asset-sort-by"
        label="Sort by"
        defaultValue="Unlisted"
        id="asset-sort-select"
        sx={{ width: "100%" }}
      >
        <MenuItem value="Listed">Listed</MenuItem>
        <MenuItem value="Unlisted">Unlisted</MenuItem>
        <MenuItem value="In Escrow">In Escrow</MenuItem>
      </Select>
      <hr />
      <List component="nav" subheader={<ListSubheader>Collections</ListSubheader>}>
        <ListItemButton>
          <Avatar />
          <ListItemText primary="Doodles" />
        </ListItemButton>
        <ListItemButton>
          <Avatar />
          <ListItemText primary="Cool Cats NFT" />
        </ListItemButton>
        <ListItemButton>
          <Avatar />
          <ListItemText primary="CrypToadz by GREMPLIN" />
        </ListItemButton>
      </List>
      <hr />
      <Icon>
        <CancelOutlinedIcon />
      </Icon>
      <Typography>Reset filter</Typography>
    </Box>
  );
};

export default LenderAssetFilter;
