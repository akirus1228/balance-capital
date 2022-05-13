import { Box, Grid, Typography } from "@mui/material";
import IconLink from "../../../components/icon-link/icon-link";
import style from "./investment-options.module.scss";
import { OneIcon, TwoIcon, ThreeIcon } from "@fantohm/shared/images";
import InvestmentLink from "./investment-link";

export const InvestmentOptions = (): JSX.Element => {
  return (
    <Grid container rowSpacing={6} className={style["productGrid"]}>
      <Grid item md={4} xs={6}>
        <InvestmentLink
          title="Build"
          icon={TwoIcon}
          link="/staking"
          linkText="For protocols"
          text="Our organization includes financial engineers and developers with top level mastery within the fields of risk management and software engineering."
        />
      </Grid>
      <Grid item md={4} xs={6}>
        <InvestmentLink
          title="Grow"
          icon={OneIcon}
          link="/trad-fi"
          linkText="For institutions"
          text="Through the systems in place, new financial interests are welcome to take part in both the continued success of the Balance ecosystem."
        />
      </Grid>
      <Grid item md={4} xs={6}>
        <InvestmentLink
          title="Earn"
          icon={ThreeIcon}
          link="/mint"
          linkText="For investors"
          text="We serve our stakeholdersthrough a shared purpose of advancing sustainable economic growth and opportunity."
        />
        {/*<IconLink title="Mint USDB" icon={MintIcon} />*/}
      </Grid>
    </Grid>
  );
};

export default InvestmentOptions;
