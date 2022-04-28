import { AppBar, Toolbar, Container, Grid, Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import MenuLink from "../header/menu-link";
import style from "./footer.module.scss";
import { Logo } from "@fantohm/shared/ui-components";
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
    <FooterBar position="static" elevation={0} style={{ margin: 0 }}>
      <Container maxWidth="xl" sx={{ my: "100px" }}>
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
