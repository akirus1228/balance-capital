import { Box, Button, Grid, OutlinedInput, Typography } from "@mui/material";
import IconLink from "../../../components/icon-link/icon-link";
import style from "./define-grid.module.scss";
import { BalanceDefine1, BalanceDefine2 } from "@fantohm/shared/images";

export const DefineGrid = (): JSX.Element => {
  return (
    <Grid
      container
      rowSpacing={6}
      className={style["productGrid"]}
      style={{ marginTop: "50px" }}
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "start",
            paddingTop: { xs: "32px", md: "62px" },
          }}
          className={style["hero"]}
        >
          <Grid item xs={8}>
            <h1 className={style["text"]}>01 &#8212;</h1>
          </Grid>
          <Grid item xs={12}>
            <h1 className={style["title"]}>Defining the Balance Ecosystem</h1>
          </Grid>
          <Grid item xs={12}>
            <h1 className={style["text"]}>
              The Balance Ecosystem depends on USDB as the formal vehicle of engagement
              with businesses which feed value directly into FHM buybacks through the
              profits of successful venture capital.
            </h1>
          </Grid>
        </Box>
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
        <img src={BalanceDefine2} style={{ width: "100%" }} />
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
        <img src={BalanceDefine1} style={{ width: "100%" }} />
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "start",
            paddingTop: { xs: "32px", md: "62px" },
          }}
          className={style["hero"]}
        >
          <Grid item xs={8}>
            <h1 className={style["text"]}>02 &#8212;</h1>
          </Grid>
          <Grid item xs={12}>
            <h1 className={style["title"]}>Owned By Long Term Interests</h1>
          </Grid>
          <Grid item xs={12}>
            <h1 className={style["text"]}>
              Through the systems in place, new financial interests are welcome to take
              part in both the continued success of the Balance Ecosystem as well as they
              are invited to join in the continued governance and maintenance of FHM’s
              treasury when assistance is necessary.
            </h1>
          </Grid>
        </Box>
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
          className={style["hero"]}
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
        </Box>
      </Grid>

      <Grid
        item
        md={3}
        sm={12}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "start",
          paddingTop: "30px",
        }}
        id="partner-form"
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
          placeholder="What’s your website url?"
        />
      </Grid>
      <Grid
        item
        md={3}
        sm={12}
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
        md={6}
        sm={12}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "start",
          paddingTop: "30px",
        }}
      />
      <Grid
        item
        md={6}
        sm={12}
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
          sx={{ px: "6em", display: { md: "flex" } }}
          className={style["link"]}
        >
          Submit
        </Button>
      </Grid>
    </Grid>
  );
};

export default DefineGrid;
