import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Icon,
  OutlinedInput,
  Paper,
  Radio,
  RadioGroup,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import style from "./blog-page.module.scss";
import { BalanceEmailBanner, BlogBanner } from "@fantohm/shared/images";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { error, info } from "@fantohm/shared-web3";
import { useEffect, useState } from "react";
import BlogPost from "../../components/blog-page/blog-post";
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { BlogPostDTO } from "../../../../../nft-market/src/app/types/backend-types";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const contentful = require("contentful");

export const BlogPage = (): JSX.Element => {
  const [email, setEmail] = useState("");
  const blogPosts = useSelector((state: RootState) => state.app.blogPosts);
  const themeType = useSelector((state: RootState) => state.app.theme);
  const dispatch = useDispatch();
  async function createContact() {
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key":
          "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",
      },
      body: JSON.stringify({ updateEnabled: true, email: email }),
    };

    await fetch("https://api.sendinblue.com/v3/contacts", options)
      .then((response) => response.json())
      .then((response) => console.log(response))
      .catch((err) => console.error(err));
  }

  const onSubmitEmail = async () => {
    if (!email.includes("@") && !email.includes(".")) {
      // eslint-disable-next-line no-alert
      return dispatch(error("Please enter a valid email!"));
    }
    await createContact();
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key":
          "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",
      },
      body: JSON.stringify({ emails: [email] }),
    };

    await fetch("https://api.sendinblue.com/v3/contacts/lists/2/contacts/add", options)
      .then((response) => response.json())
      .then((response) => console.log(response))
      .catch((err) => console.error(err));
    setEmail("");
    dispatch(info("Success!"));
    return;
  };

  return (
    <Container
      maxWidth="xl"
      className={style["heroContainer"]}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: { xs: "52px", md: "112px" },
          width: "100%",
        }}
        className={style["hero"]}
      >
        <Grid container columnSpacing={2} rowSpacing={{ xs: 4, md: 0 }}>
          <Grid
            item
            className="email-div"
            md={12}
            order={{ lg: 1 }}
            sx={{ width: { xs: "80%", md: "100%" }, marginLeft: { xs: "10%", md: "0%" } }}
          >
            <Paper
              className="email-box"
              style={{
                width: "100%",
                borderRadius: "40px",
                background: `url(${BlogBanner})`,
                backgroundSize: "cover",
              }}
            >
              <Grid
                container
                style={{ width: "100%" }}
                columnSpacing={2}
                rowSpacing={{ xs: 4, md: 0 }}
              >
                <Grid
                  item
                  md={12}
                  order={{ lg: 1 }}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: "30px",
                    textAlign: "center",
                  }}
                >
                  <Box style={{ textAlign: "center" }}>
                    <Typography
                      sx={{
                        fontSize: { xs: "24px", md: "36px" },
                        fontWeight: "500",
                        color: "#000000",
                      }}
                    >
                      The Balance Blog
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid
            item
            md={3}
            order={{ lg: 1 }}
            style={{ width: "100%" }}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            <h2 className={style["daiAPR"]}>Filters</h2>
          </Grid>
          <Grid
            item
            md={9}
            order={{ lg: 1 }}
            sx={{ width: { xs: "80%", md: "100%" }, marginLeft: { xs: "10%", md: "0%" } }}
          >
            <h2 className={style["daiAPR"]}>Blog posts</h2>
          </Grid>
          <Grid
            item
            md={3}
            order={{ lg: 1 }}
            style={{ width: "100%" }}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            <FormControl>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="all"
                name="radio-buttons-group"
              >
                <FormControlLabel value="all" control={<Radio />} label="All" />
                <FormControlLabel
                  value="announcements"
                  control={<Radio />}
                  label="Announcements"
                />
                <FormControlLabel value="products" control={<Radio />} label="Products" />
                <FormControlLabel
                  value="partnerships"
                  control={<Radio />}
                  label="Partnerships"
                />
                <FormControlLabel value="events" control={<Radio />} label="Events" />
                <FormControlLabel value="usdb" control={<Radio />} label="USDB" />
                <FormControlLabel value="fhm" control={<Radio />} label="FHM" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid
            item
            md={9}
            order={{ lg: 1 }}
            sx={{ width: { xs: "80%", md: "100%" }, marginLeft: { xs: "10%", md: "0%" } }}
          >
            <Grid container columnSpacing={2} rowSpacing={{ xs: 4, md: 0 }}>
              {blogPosts &&
                blogPosts.blogPosts &&
                blogPosts.blogPosts.map((post: BlogPostDTO) => (
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
            className="email-div"
            md={12}
            order={{ lg: 1 }}
            style={{ width: "100%" }}
          >
            <Paper
              className="email-box"
              style={{
                width: "100%",
                borderRadius: "80px",
                background: `url(${BalanceEmailBanner})`,
              }}
            >
              <Grid
                container
                style={{ width: "100%", height: "100%" }}
                columnSpacing={2}
                rowSpacing={{ sm: 0, md: 4 }}
              >
                <Grid item md={6} order={{ lg: 1 }} className={style["iconsElement"]} />
                <Grid item md={6} order={{ lg: 1 }} className={style["iconsElement"]}>
                  <Typography
                    style={{ marginLeft: "40px", fontSize: "20px", color: "#000000" }}
                  >
                    Receive email updates
                  </Typography>
                  <Grid
                    container
                    style={{ width: "100%", height: "100%" }}
                    columnSpacing={2}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "start",
                      alignItems: "start",
                      paddingTop: "30px",
                    }}
                    rowSpacing={{ xs: 4, md: 0 }}
                  >
                    <Grid
                      item
                      md={6}
                      order={{ lg: 1 }}
                      className={style["iconsElement"]}
                      style={{ marginLeft: "40px" }}
                    >
                      <OutlinedInput
                        className={`${style["styledInput"]}`}
                        placeholder="Enter your email address"
                        value={email}
                        style={{ color: "#000000", borderColor: "#000000" }}
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                      />
                    </Grid>
                    <Grid item md={3} order={{ lg: 1 }} className={style["iconsElement"]}>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ px: "3em", display: { md: "flex" } }}
                        className={style["link"]}
                        onClick={onSubmitEmail}
                      >
                        Subscribe
                      </Button>
                    </Grid>
                  </Grid>
                  <Typography style={{ marginLeft: "40px", color: "#000000" }}>
                    No spam. Never shared. Opt out at any time.
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item lg={12} className={style["heroTextContent"]}></Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default BlogPage;
