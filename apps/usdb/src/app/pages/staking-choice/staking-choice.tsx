import { Box, Button, Grid } from "@mui/material";
import DaiCard from "../../components/dai-card/dai-card";
import Faq from "../../components/faq/faq";
import Headline from "../../components/headline/headline";
import { StakingCard } from "./staking-card";
import css from "./staking-choice.module.scss";
import {useBonds} from "../../../../../../libs/shared/web3/src/lib/hooks";

interface IDepositCardParams {
  bondType: string;
  term: number;
  roi: number;
  apy: number;
  bond: any;
}

export const StakingChoicePage = (): JSX.Element => {
  const { bonds } = useBonds(250); 

  const heroContent = {
    hero: true,
    title: "Earn up to 20% on Dai",
    subtitle: ["The safest way to earn on your Dai with zero risk"],
    sx: {marginTop: "10em"}
  };
  const simpleSafe = {
    title: "Simple & safe returns",
    subtitle: ["USDB offers the safest way to earn up to 20% on your stables. No risk. No surprises."]
  };
  const getStarted = {
    title: "Get started today",
    subtitle: ["Lorem ipsum dolor sit amet, conctetur adipiscing elit. Etiam auctor commodo."]
  };

  return (
    <>
      <Headline {...heroContent} />
      <Box sx={{marginTop: "3em"}} className="flexCenterCol">
        <DaiCard className="dai">
          <h1>20.00% APR</h1>
          <Grid container>
            <Grid item xs={6} sx={{justifyContent:'left'}}>Staked TVL</Grid>
            <Grid item xs={6} sx={{justifyContent:'right'}}>$1,562,063</Grid>
          </Grid>
        </DaiCard>
        <Box className="flexCenterRow" sx={{my: '2em'}}>
          <Button>Deposit</Button>
          <Button variant="outlined">Learn More</Button>
        </Box>
      </Box>
      <Headline {...simpleSafe} />
      <Headline {...getStarted} />
      <Box sx={{marginTop: "3em"}}>
        <Grid container item xs={12} spacing={4} className={css["gridParent"]}>
          <Grid item xs={0} md={2}>
            &nbsp;
          </Grid>
          <Grid item xs={12} md={4}>
            <StakingCard bondType="3month" term={3} roi={5} apy={21.55} />
          </Grid>
          <Grid item xs={12} md={4}>
            <StakingCard bondType="6month" term={6} roi={15} apy={32.55} />
          </Grid>
          <Grid item xs={0} md={2}>
            &nbsp;
          </Grid>
        </Grid>
      </Box>
      <Faq />
      <Headline {...simpleSafe} />
    </>
  );
};

export default StakingChoicePage;
