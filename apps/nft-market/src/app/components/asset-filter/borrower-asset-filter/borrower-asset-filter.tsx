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
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { AssetStatus, BackendAssetQueryParams } from "../../../types/backend-types";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
// import style from "./borrower-asset-filter.module.scss";

export interface BorrowerAssetFilterProps {
  query: BackendAssetQueryParams;
  setQuery: Dispatch<SetStateAction<BackendAssetQueryParams>>;
}

export const BorrowerAssetFilter = ({
  query,
  setQuery,
}: BorrowerAssetFilterProps): JSX.Element => {
  const [status, setStatus] = useState<string>("Unlisted");

  const getStatusType = (status: string): AssetStatus => {
    switch (status) {
      case "Listed":
        return AssetStatus.Listed;
      case "Unlisted":
        return AssetStatus.Ready;
      case "In Escrow":
        return AssetStatus.Locked;
      default:
        return AssetStatus.New;
    }
  };

  const handleStatusChange = useCallback((event: SelectChangeEvent<string>) => {
    if (!["Unlisted", "Listed", "In Escrow"].includes(event.target.value)) return;
    setStatus(event.target.value);
    const updatedQuery: BackendAssetQueryParams = {
      ...query,
      status: getStatusType(event.target.value),
    };
    setQuery(updatedQuery);
  }, []);
  return (
    <Box sx={{ maxWidth: "250px", ml: "auto" }}>
      <Select
        labelId="asset-sort-by"
        label="Sort by"
        defaultValue="Unlisted"
        id="asset-sort-select"
        sx={{ width: "100%" }}
        onChange={handleStatusChange}
        value={status}
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

export default BorrowerAssetFilter;
