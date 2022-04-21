import { Box, Button, Grid, Icon, Paper } from "@mui/material";
import { useEffect } from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import Headline from "../../components/headline/headline";
import Logo from "../../components/logo/logo";
import style from "./about-page.module.scss";
import {
  TeammateProfile,
  Teammate,
} from "../../components/teammate-profile/teammate-profile";

const heroContent = {
  hero: true,
  title: "Where traditional finance meets DeFi",
  subtitle: [
    "USDB is a decentralized, low risk stable asset that bridges the world of traditional finance with DeFi to unlock growth for businesses and investors around the world.",
  ],
};

const sectionText = {
  title: "Two layers of multisig protection",
  subtitle: [
    "USDB is protected by two layers of multisig protection, Fantom Safe and OpenZeppelin Defender.",
  ],
};

const teammates: Teammate[] = [
  {
    name: "pwntr0n",
    details: "Lead developer",
  },
  {
    name: "Kanan",
    details: "Web dev & designer",
  },
  {
    name: "Rayne",
    details: "Marketing specialist",
  },
  {
    name: "AtomicSwap",
    details: "KuramaDAO",
  },
  {
    name: "lilbobross",
    details: "Cityroots.io, OtterClam, NovaDAO, SneakyCapital",
  },
  {
    name: "Sleepy Neko",
    details: "Trusted Shiba Inu Community Member",
  },
];

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
      <Box className={`${style["__section"]} ${style["info1"]} flexCenterRow`}>
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
                <a href="mailto:info@usdbalance.com" className={style["learnMore"]}>
                  Get in touch
                  <Icon component={ArrowUpwardIcon} className={style["linkArrow"]} />
                </a>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Box className={`${style["__section"]} ${style["info2"]} flexCenterRow`}>
        <Paper className={`${style["usdbBanner"]} usdbBanner `}>
          <Box sx={{ width: "40%" }}>
            <h1>Discover how USDB can strengthen your product or service.</h1>
            <p>
              Are you part of a financial institution or a DeFi protocol? Speak with a
              member of our team today to learn more.
            </p>
          </Box>
          <Button
            href="mailto:info@usdbalance.com"
            variant="contained"
            className={`${style["bannerButton"]} inverted`}
          >
            Get in touch
          </Button>
        </Paper>
      </Box>
      <Box
        className={`${style["__section"]} flexCenterRow`}
        sx={{ margin: "0 auto" }}
        maxWidth="md"
      >
        <Headline {...sectionText} />
      </Box>
      <Box
        className={`${style["__section"]} flexCenterRow`}
        sx={{ margin: "0 auto" }}
        maxWidth="md"
      >
        <Grid container rowSpacing={6}>
          {teammates.map((teammate, index) => (
            <Grid item xs={12} sm={6} md={4} key={`teammate-${index}`}>
              <TeammateProfile teammate={teammate} />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box
        className={`${style["__section"]} flexCenterRow`}
        sx={{ margin: "0 auto" }}
        maxWidth="md"
      >
        <Headline {...sectionText} />
      </Box>
    </>
  );
};

export default AboutPage;
