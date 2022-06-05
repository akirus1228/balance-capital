import { capitalizeFirstLetter } from "@fantohm/shared-helpers";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { ListingQueryParam } from "../../store/reducers/interfaces";
import { CollectibleMediaType } from "../../types/backend-types";
import "./asset-type-filter.module.scss";

export interface AssetTypeFilterProps {
  query: ListingQueryParam;
  setQuery: Dispatch<SetStateAction<ListingQueryParam>>;
}

type FilterState = {
  all: boolean;
  image: boolean;
  video: boolean;
  gif: boolean;
  three_d: boolean;
};

const initialState = {
  all: true,
  image: false,
  video: false,
  gif: false,
  three_d: false,
};

export const AssetTypeFilter = ({
  query,
  setQuery,
}: AssetTypeFilterProps): JSX.Element => {
  const [buttonState, setButtonState] = useState<FilterState>(initialState);

  const getMediaType = (mediaString: string): CollectibleMediaType => {
    switch (mediaString) {
      case "image":
        return CollectibleMediaType.Image;
      case "video":
        return CollectibleMediaType.Video;
      case "gif":
        return CollectibleMediaType.Gif;
      case "three_d":
        return CollectibleMediaType.ThreeD;
      default:
        return CollectibleMediaType.Image;
    }
  };

  useEffect(() => {
    const queryConditions = Object.entries(buttonState).find(
      ([key, value]) => value === true
    );
    if (!queryConditions) return;
    if (queryConditions[0] === "all") {
      const { mediaType, ...newQuery } = query;
      setQuery(newQuery);
      return;
    }
    const mediaType: CollectibleMediaType = getMediaType(queryConditions[0]);
    setQuery({ ...query, mediaType });
    console.log(queryConditions);
  }, [buttonState]);

  const handleStateChange = useCallback(
    (key: string, value: boolean) => {
      if (key === "all" && value === false) {
        setButtonState({ ...initialState });
      } else {
        setButtonState({ ...initialState, all: false, [key]: !value });
      }
    },
    [buttonState]
  );

  console.log(Object.entries(buttonState));
  return (
    <Box className="flex fr">
      {Object.entries(buttonState).map(([key, value]) => (
        <ToggleButton
          sx={{ mr: "2em" }}
          value="check"
          selected={value}
          onChange={() => {
            handleStateChange(key, value);
          }}
          key={`filter-btn-${key}`}
          className="highContrast"
        >
          {capitalizeFirstLetter(key)}
        </ToggleButton>
      ))}
    </Box>
  );
};

export default AssetTypeFilter;
