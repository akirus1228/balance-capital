import { Box } from "@mui/material";
import { Nullable } from "../../types/backend-types";

export interface HeaderBlurryImageProps {
  url: Nullable<string> | undefined;
  height?: string;
}

export const HeaderBlurryImage = ({
  url,
  height,
}: HeaderBlurryImageProps): JSX.Element => {
  if (!url) {
    return <></>;
  }

  return (
    <Box
      sx={{
        position: "absolute",
        width: "100vw",
        height: height || "251px",
        top: "0",
        left: "0",
        zIndex: "-1",
        opacity: "0.23",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          backgroundImage: `url("${url}")`,
          height: "100%",
          width: "100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "100vw",
          position: "relative",
          filter: "blur(8px)",
        }}
      ></Box>
    </Box>
  );
};

export default HeaderBlurryImage;
