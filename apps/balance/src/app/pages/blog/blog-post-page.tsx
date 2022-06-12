import {
  Box,
  Container,
  Grid,
  Paper,
  SxProps,
  Theme,
  ThemeProvider,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
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
import { useLocation, useParams } from "react-router-dom";
import BlogPost from "./blog-post";
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { BlogPostDTO } from "../../../../../nft-market/src/app/types/backend-types";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

/* eslint-disable-next-line */
export interface BlogPostProps  {
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
  const [post, setPost] = useState<BlogPostDTO | undefined>();

  const blogPosts = useSelector((state: RootState) => state.app.blogPosts);
  const location = useLocation();
  const id = location.pathname.substring(location.pathname.indexOf("blog/") + 5);
  const theme = useCallback(() => {
    if (props.invertTheme) {
      return themeType === "light" ? USDBDark : USDBLight;
    } else if (props.setTheme) {
      return props.setTheme === "light" ? USDBLight : USDBDark;
    } else {
      return themeType === "light" ? USDBLight : USDBDark;
    }
  }, [themeType, props.invertTheme, props.setTheme]);

  useEffect(() => {
    console.log(blogPosts);

    if (blogPosts && blogPosts.blogPosts) {
      setPost(blogPosts.blogPosts.find((post: BlogPostDTO) => post.id === id));
      console.log(post);
    }
  }, [blogPosts]);

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
              <h1>
                {" "}
                {blogPosts && blogPosts.blogPosts
                  ? blogPosts.blogPosts.find((post: BlogPostDTO) => post.id === id)
                      .blogTitle
                  : ""}
              </h1>
            </Grid>
            <Grid item md={12} order={{ lg: 1 }} className={style["iconsElement"]}>
              <img
                src={post && post.image ? post.image : BalanceHeroImage}
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
                {blogPosts && blogPosts.blogPosts
                  ? blogPosts.blogPosts.find((post: BlogPostDTO) => post.id === id)
                      .blogTitle
                  : ""}
              </h2>
              <h2 style={{ fontSize: "12px", marginLeft: "10px" }}>
                {post && post.date ? new Date(post.date.slice(0, 10)).toDateString() : ""}
              </h2>
            </Grid>
            <Grid item md={12} order={{ lg: 1 }} className={style["iconsElement"]}>
              {blogPosts && blogPosts.blogPosts
                ? documentToReactComponents(
                    blogPosts.blogPosts.find((post: BlogPostDTO) => post.id === id)
                      .content
                  )
                : ""}
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
            sx={{ width: { xs: "80%", md: "100%" }, marginLeft: { xs: "10%", md: "0%" } }}
          >
            <Grid container columnSpacing={2} rowSpacing={{ xs: 4, md: 0 }}>
              {blogPosts &&
                blogPosts.blogPosts &&
                blogPosts.blogPosts.slice(0, 3).map((post: BlogPostDTO) => (
                  <Grid
                    item
                    className="email-div"
                    md={4}
                    order={{ lg: 1 }}
                    style={{ width: "100%" }}
                  >
                    <BlogPost post={post}>
                      <h2 className={style["daiAPR"]}>{post.blogTitle}</h2>
                    </BlogPost>
                  </Grid>
                ))}
            </Grid>
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
