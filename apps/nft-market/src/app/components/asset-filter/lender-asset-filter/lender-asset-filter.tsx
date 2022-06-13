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
  SelectChangeEvent,
  Slider,
  Typography,
} from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { Dispatch, SetStateAction, SyntheticEvent, useCallback, useState } from "react";
import { ListingQueryParam } from "../../../store/reducers/interfaces";
import { ListingStatus } from "../../../types/backend-types";

export interface LenderAssetFilterProps {
  query: ListingQueryParam;
  setQuery: Dispatch<SetStateAction<ListingQueryParam>>;
}

export const LenderAssetFilter = ({
  query,
  setQuery,
}: LenderAssetFilterProps): JSX.Element => {
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000000]);
  const [aprRange, setAprRange] = useState<number[]>([0, 400]);
  const [durationRange, setDurationRange] = useState<number[]>([0, 365]);

  const valuetext = (value: number) => {
    return `$${value}`;
  };

  const aprValuetext = (value: number) => {
    return `${value}%`;
  };

  const durationValuetext = (value: number) => {
    return `${value} days`;
  };

  const handleSortChange = useCallback((event: SelectChangeEvent<string>) => {
    let sort;
    console.log(event);
  }, []);

  const handlePriceRangeChange = useCallback(
    (event: Event, newValue: number | number[]) => {
      if (!event || typeof newValue === "number") return;
      setPriceRange([newValue[0], newValue[1]]);
    },
    []
  );

  const handlePriceRangeChangeCommitted = useCallback(
    (event: Event | SyntheticEvent, newValue: number | number[]) => {
      console.log(event);
      if (!event || typeof newValue === "number") return;
      setPriceRange([newValue[0], newValue[1]]);

      //trigger query update
      setQuery({ ...query, minPrice: newValue[0], maxPrice: newValue[1] });
    },
    []
  );

  const handleAprRangeChange = useCallback(
    (event: Event, newValue: number | number[]) => {
      if (!event || typeof newValue === "number") return;
      setAprRange([newValue[0], newValue[1]]);
    },
    []
  );

  const handleAprRangeChangeCommitted = useCallback(
    (event: Event | SyntheticEvent, newValue: number | number[]) => {
      console.log(event);
      if (!event || typeof newValue === "number") return;
      setAprRange([newValue[0], newValue[1]]);

      //trigger query update
      setQuery({ ...query, minApr: newValue[0], maxApr: newValue[1] });
    },
    []
  );

  const handleDurationRangeChange = useCallback(
    (event: Event, newValue: number | number[]) => {
      if (!event || typeof newValue === "number") return;
      setDurationRange([newValue[0], newValue[1]]);
    },
    []
  );

  const handleDurationRangeChangeCommitted = useCallback(
    (event: Event | SyntheticEvent, newValue: number | number[]) => {
      console.log(event);
      if (!event || typeof newValue === "number") return;
      setDurationRange([newValue[0], newValue[1]]);

      //trigger query update
      setQuery({ ...query, minDuration: newValue[0], maxDuration: newValue[1] });
    },
    []
  );

  return (
    <Box sx={{ maxWidth: "250px", ml: "auto" }}>
      <Select
        labelId="asset-sort-by"
        label="Sort by"
        defaultValue="Recent"
        id="asset-sort-select"
        sx={{ width: "100%" }}
        onChange={handleSortChange}
      >
        <MenuItem value="Recent">Sort By: Recently Listed</MenuItem>
        <MenuItem value="Oldest">Sort By: Oldest Listed</MenuItem>
        <MenuItem value="Highest Price">Sort By: Price Higest</MenuItem>
        <MenuItem value="Lowest Price">Sort By: Price Lowest</MenuItem>
      </Select>
      <Box className="flex fc">
        <span>Price range</span>
        <Slider
          getAriaLabel={() => "Price range"}
          value={priceRange}
          onChange={handlePriceRangeChange}
          onChangeCommitted={handlePriceRangeChangeCommitted}
          valueLabelDisplay="auto"
          getAriaValueText={valuetext}
          min={0}
          max={10000}
        />
        <Box className="flex fj-sb">
          <span style={{ fontSize: "10px" }}>{priceRange[0]} USDB</span>
          <span style={{ fontSize: "10px" }}>{priceRange[1]} USDB</span>
        </Box>
      </Box>
      <Box className="flex fc">
        <span>Apr range</span>
        <Slider
          getAriaLabel={() => "Apr range"}
          value={aprRange}
          onChange={handleAprRangeChange}
          onChangeCommitted={handleAprRangeChangeCommitted}
          valueLabelDisplay="auto"
          getAriaValueText={aprValuetext}
          min={0}
          max={400}
        />
      </Box>
      <Box className="flex fj-sb">
        <span style={{ fontSize: "10px" }}>{aprRange[0]}%</span>
        <span style={{ fontSize: "10px" }}>{aprRange[1]}%</span>
      </Box>
      <Box className="flex fc">
        <span>Duration</span>
        <Slider
          getAriaLabel={() => "Duratioun range"}
          value={durationRange}
          onChange={handleDurationRangeChange}
          onChangeCommitted={handleDurationRangeChangeCommitted}
          valueLabelDisplay="auto"
          getAriaValueText={durationValuetext}
          min={0}
          max={365}
        />
      </Box>
      <Box className="flex fj-sb">
        <span style={{ fontSize: "10px" }}>{durationRange[0]} days</span>
        <span style={{ fontSize: "10px" }}>{durationRange[1]} days</span>
      </Box>
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
