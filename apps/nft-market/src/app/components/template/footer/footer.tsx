import { AppBar, Toolbar, Container, Grid, Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import MenuLink from "../header/menu-link";
import store, { RootState } from "../../../store";
import style from "./footer.module.scss";
import { Logo } from "@fantohm/shared/ui-components";

type Page = {
  title: string;
  href?: string;
};

type FooterItem = {
  label: string;
  pages: Page[];
};

export const Footer = (): JSX.Element => {
  const footerItems: FooterItem[] = [
    {
      label: "Products",
      pages: [
        { title: "Tradfi", href: "/trad-fi" },
        { title: "Staking", href: "/staking" },
        { title: "xFHM", href: "/xfhm" },
        {
          title: "Bridge",
          href: "https://synapseprotocol.com/?inputCurrency=USDB&outputCurrency=USDB&outputChain=1",
        },
      ],
    },
    {
      label: "Useful Links",
      pages: [
        { title: "My Account", href: "/my-account" },
        { title: "Documentation", href: "https://fantohm.gitbook.io/documentation" },
        {
          title: "Audits",
          href: "https://github.com/fantohm-dev/fantohm-contracts/tree/main/audit",
        },
        { title: "FantOHM", href: "https://fantohm.com" },
      ],
    },
    {
      label: "Community",
      pages: [
        { title: "Twitter", href: "https://twitter.com/usdb_" },
        { title: "Discord", href: "https://discord.com/invite/8wAQWZgjCv" },
        {
          title: "Youtube",
          href: "https://www.youtube.com/channel/UCa1eJEgcVnFhfLNdjw3yr4g",
        },
        { title: "Reddit", href: "https://www.reddit.com/r/USDB_OFFICIAL/" },
      ],
    },
  ];

  return (
    <AppBar position="static" color="transparent" elevation={0} style={{ margin: 0 }}>
      <Container maxWidth="xl" sx={{ my: "100px" }}>
        <Toolbar disableGutters>
          <Grid container spacing={2} sx={{ px: { xs: "40px", md: "0" } }}>
            <Grid item xs={12} md={5}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Box width="220px" mb="30px">
                  <Link to="/">
                    <Logo store={store} />
                  </Link>
                  <Typography
                    variant="subtitle2"
                    color="primary"
                    className="font-weight-bold"
                    style={{ marginTop: "15px" }}
                  >
                    USDB is a next generation algorithmic stable coin
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={7}>
              <Grid container spacing={2}>
                {footerItems.map((item: FooterItem, index: number) => (
                  <Grid item xs={6} md={4} key={`footer-item-${index}`}>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography
                        variant="h6"
                        color="textPrimary"
                        className="font-weight-bolder"
                        style={{ marginBottom: "20px" }}
                      >
                        {item.label}
                      </Typography>
                      {item.pages.map((page: Page) => (
                        <MenuLink
                          href={page.href ? page.href : "#"}
                          key={page.title}
                          style={{ marginBottom: "10px" }}
                        >
                          <Typography color="textPrimary">{page.title}</Typography>
                        </MenuLink>
                      ))}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </Container>
      <Box className={style["splitter"]} />
      <Box
        sx={{
          background: "black",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "center",
          alignItems: "center",
          py: "10px",
        }}
      >
        <Typography color="white" textAlign="center">
          &copy; 2022 USD Balance
        </Typography>
        <Box sx={{ display: "flex" }}>
          <Box
            sx={{
              mx: { xs: "0", sm: "30px" },
              mt: "3px",
              display: { xs: "none", sm: "block" },
            }}
          >
            <Typography color="white">*</Typography>
          </Box>
          <Typography color="white" textAlign="center">
            <a href="mailto:hello@balanceusdb.com" style={{ color: "white" }}>
              hello@balanceusdb.com
            </a>
          </Typography>
          <Box
            sx={{
              mx: { xs: "0", sm: "30px" },
              mt: "3px",
              display: { xs: "none", sm: "block" },
            }}
          >
            <Typography color="white">*</Typography>
          </Box>
        </Box>
        <MenuLink href="#">
          <Typography color="white" textAlign="center">
            Privacy Policy
          </Typography>
        </MenuLink>
      </Box>
    </AppBar>
  );
};
