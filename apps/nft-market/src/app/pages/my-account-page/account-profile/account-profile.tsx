import { Box, Button, Icon, IconButton } from "@mui/material";
import { User } from "../../../types/backend-types";
import profileImagePlaceholder from "../../../../assets/images/profile-placeholder.svg";
import style from "./account-profile.module.scss";
import { addressEllipsis } from "@fantohm/shared-helpers";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import IosShareIcon from "@mui/icons-material/IosShare";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import bluechip from "../../../../assets/icons/blue-chip.svg";
import openseaIcon from "../../../../assets/icons/opensea-icon.svg";
import raribleIcon from "../../../../assets/icons/rarible-icon.svg";

export type AccountProfileProps = {
  user: User;
};

export const AccountProfile = ({ user }: AccountProfileProps): JSX.Element => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(user.address).then(
      function () {
        console.log("Async: Copying to clipboard was successful!");
      },
      function (err) {
        console.error("Async: Could not copy text: ", err);
      }
    );
  };

  return (
    <Box sx={{ mb: "5em" }}>
      <Box className="flex fr fj-sb ai-c">
        <Box className="flex fr fj-sb ai-c">
          <Box className={`${style["profileImageContainer"]} flex fr ai-c`}>
            <img
              src={profileImagePlaceholder}
              style={{ marginLeft: "5px" }}
              alt="User's profile avatar"
            />
          </Box>
          <Box className="flex fc" sx={{ ml: "2em" }}>
            <h1>
              {addressEllipsis(user.address)}
              <img src={bluechip} alt="bluechip" />
            </h1>
            <Button
              className="lowContrast slim"
              variant="contained"
              onClick={copyToClipboard}
            >
              {addressEllipsis(user.address)}{" "}
              <Icon component={ContentCopyIcon} sx={{ ml: "1em" }} />
            </Button>
          </Box>
        </Box>
        <Box className="flex fr ai-c">
          <a href={`https://opensea.io/${user.address}`} target="_blank" rel="noreferrer">
            <img src={openseaIcon} alt="opensea icon" className={style["iconWrapper"]} />
          </a>
          <a
            href={`https://rarible.com/user/${user.address}/owned`}
            target="_blank"
            rel="noreferrer"
          >
            <img src={raribleIcon} alt="opensea icon" className={style["iconWrapper"]} />
          </a>
          <Button className="lowContrast slim" variant="contained" sx={{ ml: "7px" }}>
            <Icon component={OpenInNewIcon} /> View on Etherscan
          </Button>
          <Button className="slim lowContrast" variant="contained" sx={{ ml: "7px" }}>
            <Icon component={IosShareIcon} /> Share
          </Button>
          <IconButton className="lowContrast" sx={{ ml: "7px" }}>
            <Icon component={MoreHorizOutlinedIcon} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};
