import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import style from "./preview-image.module.scss";

export interface PreviewImageProps {
  url: string;
  name: string;
  contractAddress: string;
  tokenId: string;
}

export const PreviewImage = (props: PreviewImageProps): JSX.Element => {
  return (
    <Box
      sx={{ height: "300px", width: "300px", borderRadius: "28px", overflow: "hidden" }}
    >
      <img
        className={style["assetImg"]}
        src={props.url}
        alt={props.name}
        style={{ height: "100%", width: "auto" }}
      />
    </Box>
  );
};

export default PreviewImage;
