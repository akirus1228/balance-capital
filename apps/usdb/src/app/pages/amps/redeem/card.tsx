import {
  Box,
  Grid,
  Button,
  Paper,
  OutlinedInput,
  InputAdornment,
  Typography,
  Icon,
  useMediaQuery,
  Divider,
  ThemeProvider,
} from "@mui/material";
import { USDBLight } from "@fantohm/shared-ui-themes";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import style from "../amps.module.scss";

const percentage = 66;

export default function RedeemCard(props: any) {
  const { use, title, image, cost, description } = props;

  const onRedeem = () => {
    if (!props.onRedeem) return;
    props.onRedeem();
  };

  return (
    <Grid xs={3}>
      <ThemeProvider theme={USDBLight}>
        <Box className={`${style["redeemCard"]} flexCenterCol`}>
          <Box className={style["header"]}>
            <div className={`${style["textWrapper"]}`}>
              {use ? "Multiple use" : "Single use"}
            </div>
            <Typography
              variant="subtitle1"
              color="primary"
              textAlign="center"
              paddingTop={1}
              paddingBottom={2}
            >
              {title}
            </Typography>
          </Box>

          <Grid container>
            <Grid item xs={12} className={style["imageBox"]}>
              <img src={image} className={style["image"]} />
            </Grid>

            <Grid item xs={12}>
              <Typography
                variant="body2"
                color="primary"
                className={style["description"]}
              >
                Cost
              </Typography>
              <Typography variant="subtitle1" color="primary" marginBottom={1}>
                {cost === -1 ? "Highest Holder" : `${cost} AMPS`}
              </Typography>
              <Box className={style["descBox"]}>
                <Typography
                  variant="body2"
                  color="primary"
                  className={style["description"]}
                >
                  {description}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={1}></Grid>
            <Grid item xs={10}>
              <Button
                variant="contained"
                color="primary"
                id="bond-btn"
                className="paperButton transaction-button"
                onClick={() => onRedeem()}
              >
                Redeem
              </Button>
            </Grid>
          </Grid>
        </Box>
      </ThemeProvider>
    </Grid>
  );
}
