import { Box, Button, Grid } from "@mui/material";
import { useNavigate, useHref } from "react-router-dom";
import style from "./balance-about-page.module.scss";
import { useCallback } from "react";
import { AboutDivider } from "@fantohm/shared/images";

/* eslint-disable-next-line */
export interface IconLinkProps {
  icon: string | typeof import("*.png");
  title: string;
  text: string;
  link?: string | undefined;
  docsLink?: string | undefined;
}

export function BalanceAboutTile({
  icon,
  title,
  link = undefined,
  text = "",
  docsLink = undefined,
}: IconLinkProps) {
  const navigate = useNavigate();

  const handleOnClick = useCallback(() => {
    const isHttpLink = link?.startsWith("http");
    if (isHttpLink) window.open(link, "_blank");
    else if (link) navigate(link);
  }, [navigate, link]);
  const setOpacity = link ? {} : { opacity: "0.4" };
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
          justifyContent: "center",
          alignItems: "center",
          paddingLeft: { sm: "0%", md: "10%" },
          paddingRight: { sm: "0%", md: "10%" },
          width: { sm: "300px", md: "100%" },
        }}
      >
        <img src={icon as string} style={{ width: "100%" }} className={style["image"]} />
      </Grid>
      <Grid
        item
        sm={12}
        md={6}
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
          className={style["iconLinkContainer"]}
        >
          <Grid item xs={12}>
            <h1 className={style["title"]}>{title}</h1>
          </Grid>

          <Grid item xs={12}>
            <h1 className={style["text"]}>{text}</h1>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: "30px",
            }}
          >
            {link === undefined ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleOnClick}
                sx={{ px: "4em", display: { md: "flex" } }}
                className={style["link"]}
                disabled={link === undefined}
              >
                Coming Soon
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleOnClick}
                sx={{ px: "4em", display: { md: "flex" } }}
                className={style["link"]}
                disabled={link === undefined}
              >
                Enter App
              </Button>
            )}
            {docsLink !== undefined ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleOnClick}
                sx={{ px: "4em", display: { md: "flex" }, marginLeft: "20px" }}
                className={style["link"]}
              >
                Documentation
              </Button>
            ) : (
              <></>
            )}
          </Grid>
        </Box>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "30px",
        }}
      >
        <img src={AboutDivider as string} style={{ width: "100%" }} />
      </Grid>
    </Grid>
  );
}

export default BalanceAboutTile;
