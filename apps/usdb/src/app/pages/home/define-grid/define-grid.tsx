import { Box, Button, Grid, OutlinedInput, Typography } from "@mui/material";
import IconLink from "../../../components/icon-link/icon-link";
import style from "./define-grid.module.scss";
import { TradFiIcon, BridgeIcon } from "@fantohm/shared/images";

export const DefineGrid = (): JSX.Element => {
  return (
    <Grid
      container
      rowSpacing={6}
      className={style["productGrid"]}
      style={{ marginTop: "150px" }}
    >
      <Grid
        item
        xs={6}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "start",
          paddingTop: "30px",
        }}
      >
        <Grid item xs={8}>
          <h1 className={style["text"]}>01 &#8212;</h1>
        </Grid>
        <Grid item xs={12}>
          <h1 className={style["title"]}>Defining the Balance Ecosystem</h1>
        </Grid>
        <Grid item xs={12}>
          <h1 className={style["text"]}>
            The Balance Ecosystem depends on USDB as the formal vehicle of engagement with
            businesses which feed value directly into FHM buybacks through the profits of
            successful venture capital.
          </h1>
        </Grid>
      </Grid>
      <Grid
        item
        xs={6}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "start",
          paddingTop: "30px",
        }}
      >
        <h1>Image</h1>
      </Grid>

      <Grid
        item
        xs={6}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "start",
          paddingTop: "30px",
        }}
      >
        <h1>Image</h1>
      </Grid>
      <Grid
        item
        xs={6}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "start",
          paddingTop: "30px",
        }}
      >
        <Grid item xs={8}>
          <h1 className={style["text"]}>02 &#8212;</h1>
        </Grid>
        <Grid item xs={12}>
          <h1 className={style["title"]}>Owned By Long Term Interests</h1>
        </Grid>
        <Grid item xs={12}>
          <h1 className={style["text"]}>
            Through the systems in place, new financial interests are welcome to take part
            in both the continued success of the Balance Ecosystem as well as they are
            invited to join in the continued governance and maintenance of FHM’s treasury
            when assistance is necessary.
          </h1>
        </Grid>
      </Grid>

      <Grid
        item
        xs={6}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "start",
          paddingTop: "30px",
        }}
      >
        <Grid item xs={8}>
          <h1 className={style["text"]}>03 &#8212;</h1>
        </Grid>
        <Grid item xs={12}>
          <h1 className={style["title"]}>Join our partner program</h1>
        </Grid>
        <Grid item xs={12}>
          <h1 className={style["text"]}>
            Are you part of a financial institutions or a DeFi protocol? Get in touch to
            discuss how Balance and your organisation can work together.
          </h1>
        </Grid>
      </Grid>

      <Grid
        item
        xs={3}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "start",
          paddingTop: "30px",
        }}
      >
        <OutlinedInput
          className={`${style["styledInput"]}`}
          placeholder="What’s your name? *"
        />
        <OutlinedInput
          className={`${style["styledInput"]}`}
          placeholder="What’s the name of your organization?"
        />
        <OutlinedInput
          className={`${style["styledInput"]}`}
          placeholder="What’s your website url? "
        />
      </Grid>
      <Grid
        item
        xs={3}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "start",
          paddingTop: "30px",
        }}
      >
        <OutlinedInput
          className={`${style["styledInput"]}`}
          placeholder="What’s your email address? *"
        />
        <OutlinedInput
          className={`${style["styledInput"]}`}
          placeholder="What sector do you operate within?"
        />
        <OutlinedInput
          className={`${style["styledInput"]}`}
          placeholder="What product are you interested in?"
        />
      </Grid>
      <Grid
        item
        xs={6}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "start",
          paddingTop: "30px",
        }}
      ></Grid>
      <Grid
        item
        xs={6}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "30px",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          sx={{ px: "3em", display: { xs: "none", md: "flex" } }}
          className={style["link"]}
        >
          Submit
        </Button>
      </Grid>
    </Grid>
  );
};

export default DefineGrid;
