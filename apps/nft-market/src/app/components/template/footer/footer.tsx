import { Toolbar, Container, Typography } from "@mui/material";
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
      href: "/terms",
    },
    {
      title: "Privacy",
      href: "/privacy",
    },
  ];

  return (
    <FooterBar elevation={0} position="sticky" style={{ marginTop: "auto" }}>
      <Container maxWidth="xl" sx={{ my: "2em" }}>
        <Toolbar sx={{ display: "flex", flexDirection: "row" }}>
          {footerItems.map((footerItem: Page, index: number) => {
            return (
              <Link
                to={footerItem.href}
                style={{ marginRight: "2em" }}
                key={`footerlink-${index}`}
              >
                {footerItem.title}
              </Link>
            );
          })}
          <Typography textAlign="center" sx={{ marginLeft: "auto" }}>
            Copyright &copy; 2022. All rights reserved.
          </Typography>
        </Toolbar>
      </Container>
    </FooterBar>
  );
};
