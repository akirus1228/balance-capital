import {
  Box,
  Container,
  Grid,
  Paper,
  SxProps,
  Theme,
  ThemeProvider,
} from "@mui/material";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { USDBLight, USDBDark } from "@fantohm/shared-ui-themes";
import { RootState } from "../../store";
import style from "./blog-post.module.scss";
import {
  BalanceHeroImage,
  BalanceLogoDark,
  BalanceTwitter,
} from "@fantohm/shared/images";
import { withDeps } from "@nrwl/workspace/src/core/project-graph";
import css from "../../pages/trad-fi/deposit-choice/deposit-choice.module.scss";
import { useParams } from "react-router-dom";
import BlogPost from "./blog-post";

/* eslint-disable-next-line */
export interface BlogPostProps {
  className?: string;
  invertTheme?: boolean;
  setTheme?: "light" | "dark";
  tokenImage?: string;
  sx?: SxProps<Theme>;
  imageLink?: string;
  blogTitle?: string;
  product?: string;
  date?: string;
}

export const BlogPostPage = (props: BlogPostProps): JSX.Element => {
  const themeType = useSelector((state: RootState) => state.app.theme);
  const { name } = useParams();

  const theme = useCallback(() => {
    if (props.invertTheme) {
      return themeType === "light" ? USDBDark : USDBLight;
    } else if (props.setTheme) {
      return props.setTheme === "light" ? USDBLight : USDBDark;
    } else {
      return themeType === "light" ? USDBLight : USDBDark;
    }
  }, [themeType, props.invertTheme, props.setTheme]);

  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth="xl"
        className={style["heroContainer"]}
        sx={{
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          className={css["titleWrapper"]}
          style={{
            height: "2em",
            marginLeft: "45%",
            marginRight: "45%",
            maxWidth: "10%",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <h3
            style={{
              paddingTop: "8px",
              fontSize: "12px",
            }}
          >
            Product
          </h3>
        </Box>
        <Box>
          <Grid
            container
            columnSpacing={2}
            rowSpacing={{ xs: 4, md: 0 }}
            style={{
              width: "100%",
              marginLeft: "20%",
              marginRight: "20%",
              maxWidth: "60%",
            }}
          >
            <Grid
              item
              md={12}
              order={{ lg: 1 }}
              className={style["iconsElement"]}
              style={{ textAlign: "center", maxWidth: "100%" }}
            >
              <h1>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h1>
            </Grid>
            <Grid item md={12} order={{ lg: 1 }} className={style["iconsElement"]}>
              <img
                src={BalanceHeroImage}
                style={{
                  maxWidth: "100%",
                  borderRadius: "2em",
                }}
              />
            </Grid>
            <Grid
              item
              className="email-div"
              md={1}
              order={{ lg: 1 }}
              style={{ width: "30px", justifyContent: "center" }}
            >
              <img src={BalanceTwitter} style={{ width: "60px" }} />
            </Grid>
            <Grid
              item
              className="email-div"
              md={6}
              order={{ lg: 1 }}
              style={{ height: "100%", overflow: "hidden", textAlign: "start" }}
            >
              <h2 style={{ fontSize: "12px", marginLeft: "10px" }}>
                {props.blogTitle || "title"}
              </h2>
              <h2 style={{ fontSize: "12px", marginLeft: "10px" }}>
                {props.blogTitle || "date"}
              </h2>
            </Grid>
            <Grid item md={12} order={{ lg: 1 }} className={style["iconsElement"]}>
              <h2 style={{ fontSize: "13px", marginLeft: "10px" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </h2>
            </Grid>
            <Grid item md={12} order={{ lg: 1 }} className={style["iconsElement"]}>
              <h2 style={{ fontSize: "12px", marginLeft: "10px" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus egestas
                enim sed sem suscipit malesuada. Aenean sed nunc et erat ornare lobortis.
                Sed odio dolor, ultrices sit amet consectetur ac, suscipit sit amet
                tellus. Mauris sapien nulla, imperdiet quis augue ut, consectetur
                porttitor nisl. Vivamus ut faucibus diam, eget porta mi. Donec quis
                tincidunt metus, ut ultrices nulla. Aenean porta mi non nisl tincidunt
                condimentum. Sed eget sodales nisi, id elementum nisl. Proin hendrerit
                aliquet arcu, sit amet sollicitudin dui iaculis ut. Ut dapibus
                pellentesque arcu, non gravida turpis. Curabitur a varius urna. Vestibulum
                at erat vitae purus sollicitudin molestie vel in massa. Sed facilisis
                pulvinar egestas. Nunc dolor ipsum, lobortis eu urna a, placerat mattis
                odio. Sed scelerisque viverra orci quis finibus. Sed dapibus orci non
                cursus facilisis. Fusce eu nibh sapien. Sed a dolor nisi. Nam vitae magna
                hendrerit erat sollicitudin laoreet. Proin purus orci, tincidunt non leo
                ut, sodales condimentum eros. Pellentesque ut sodales odio. Donec
                efficitur, augue eu posuere finibus, elit diam lacinia leo, id tempus quam
                lacus eu ex. Nam non velit vel augue pellentesque euismod eu ac erat.
                Aenean commodo, est id elementum interdum, quam mi dapibus ligula, et
                aliquet mi justo ac risus. Nullam quis augue id justo volutpat porta ut at
                orci. In sit amet lectus ut velit rutrum posuere nec feugiat tortor.
              </h2>
            </Grid>
          </Grid>
          <Grid
            item
            md={12}
            order={{ lg: 1 }}
            className={style["iconsElement"]}
            style={{ textAlign: "center", maxWidth: "100%", marginTop: "100px" }}
          >
            <h1>More from the balance blog</h1>
          </Grid>
          <Grid
            item
            md={12}
            order={{ lg: 1 }}
            sx={{
              width: { xs: "80%", md: "100%" },
              marginLeft: { xs: "10%", md: "12.5%" },
              alignItems: "center",
            }}
          >
            <Grid container columnSpacing={2} rowSpacing={{ xs: 4, md: 0 }}>
              {/*<Grid*/}
              {/*  item*/}
              {/*  className="email-div"*/}
              {/*  xs={12}*/}
              {/*  md={3}*/}
              {/*  order={{ lg: 1 }}*/}
              {/*  style={{ width: "100%" }}*/}
              {/*>*/}
              {/*  <BlogPost>*/}
              {/*    <h2 className={style["daiAPR"]}>Blog posts</h2>*/}
              {/*  </BlogPost>*/}
              {/*</Grid>*/}
              {/*<Grid*/}
              {/*  item*/}
              {/*  className="email-div"*/}
              {/*  xs={12}*/}
              {/*  md={3}*/}
              {/*  order={{ lg: 1 }}*/}
              {/*  style={{ width: "100%" }}*/}
              {/*>*/}
              {/*  <BlogPost>*/}
              {/*    <h2 className={style["daiAPR"]}>Blog posts</h2>*/}
              {/*  </BlogPost>*/}
              {/*</Grid>*/}
              {/*<Grid*/}
              {/*  item*/}
              {/*  className="email-div"*/}
              {/*  xs={12}*/}
              {/*  md={3}*/}
              {/*  order={{ lg: 1 }}*/}
              {/*  style={{ width: "100%" }}*/}
              {/*>*/}
              {/*  <BlogPost>*/}
              {/*    <h2 className={style["daiAPR"]}>Blog posts</h2>*/}
              {/*  </BlogPost>*/}
              {/*</Grid>*/}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default BlogPostPage;
