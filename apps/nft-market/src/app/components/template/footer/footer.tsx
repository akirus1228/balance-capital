import { Box, Container, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { FooterBar } from "@fantohm/shared-ui-themes";

type Page = {
  title: string;
  href: string;
};

export const Footer = (): JSX.Element => {
  const footerItems: Page[] = [
    {
      title: "Help",
      href: "/help",
    },
    {
      title: "Cookies",
      href: "/cookies",
    },
    {
      title: "Disclaimer",
      href: "/disclaimer",
    },
    {
      title: "Terms",
      href: "/term",
    },
    {
      title: "Privacy",
      href: "/privacy",
    },
  ];

  return (
    <FooterBar elevation={0} position="sticky" style={{ marginTop: "auto", zIndex: "0" }}>
      <Container maxWidth="xl" sx={{ my: "2em" }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: { xs: "center", md: "space-between" },
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: { xs: "100%", md: "500px" },
              justifyContent: "space-between",
            }}
          >
            {footerItems.map((footerItem: Page, index: number) => {
              return (
                <Link to={footerItem.href} key={`footer-link-${index}`}>
                  {footerItem.title}
                </Link>
              );
            })}
          </Box>
          <Box sx={{ mt: { xs: "20px", md: "0" } }}>
            <Typography textAlign="center" variant="body2" color="white">
              Copyright &copy; 2022. All rights reserved.
            </Typography>
          </Box>
        </Toolbar>
      </Container>
    </FooterBar>
  );
};
