import { Box, Grid, Icon } from "@mui/material";
import { useEffect } from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import Headline from "../../components/headline/headline";
import Logo from "../../components/logo/logo";
import style from "./about-page.module.scss";

const heroContent = {
  hero: true,
  title: "Where traditional finance meets DeFi",
  subtitle: [
    "USDB is a decentralized, low risk stable asset that bridges the world of traditional finance with DeFi to unlock growth for businesses and investors around the world.",
  ],
};

export const AboutPage = (): JSX.Element => {
  // mailchimp integration
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://chimpstatic.com/mcjs-connected/js/users/30ce909d3542b1d245b54e5b8/31faed079e8d768a93c14ffc0.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <>
      <Box
        className={`${style["__heading"]} flexCenterRow`}
        maxWidth="md"
        sx={{ margin: "0 auto 490px auto" }}
      >
        <Logo style={{ width: "424px", paddingBottom: "2em" }} />
        <Headline {...heroContent} />
        <a className={style["learnMore"]} href="/about#details">
          Learn More
          <Icon component={ArrowUpwardIcon} className={style["linkArrow"]} />
        </a>
      </Box>
      <Box
        className={`${style["__section"]} ${style["info1"]} flexCenterRow`}
        sx={{ margin: "0 auto" }}
      >
        <Grid container columnSpacing={6}>
          <Grid item xs={12} sm={6} md={5}>
            <h2>Building an open financial system</h2>
            <p>
              USDB offers a plethora of financial tools and services for individuals and
              institutions
            </p>
          </Grid>
          <Grid item xs>
            <Grid container columnSpacing={6}>
              <Grid item xs={12} md={4}>
                <h4>B2B liquidity solutions</h4>
                <p>
                  A liquidity solution to help businesses to expand and grow, while
                  mitigationg risk.
                </p>
                <a href="/about#" className={style["learnMore"]}>
                  Get in touch
                  <Icon component={ArrowUpwardIcon} className={style["linkArrow"]} />
                </a>
              </Grid>
              <Grid item xs={12} md={4}>
                <h4>B2B Single-sided staking</h4>
                <p>
                  A high-interest earning opportunity of up to 32.5% without the
                  complexity.
                </p>
                <a href="/about#" className={style["learnMore"]}>
                  Learn more
                  <Icon component={ArrowUpwardIcon} className={style["linkArrow"]} />
                </a>
              </Grid>
              <Grid item xs={12} md={4}>
                <h4>Trad-Fi bonds</h4>
                <p>
                  A long-term investment vehicle to safely park funds and earn stable
                  yields
                </p>
                <a href="/about#" className={style["learnMore"]}>
                  Get in touch
                  <Icon component={ArrowUpwardIcon} className={style["linkArrow"]} />
                </a>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default AboutPage;
