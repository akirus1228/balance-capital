import { Box, Button, Grid, Typography } from "@mui/material";
import DaiCard from "../../components/dai-card/dai-card";
import Faq from "../../components/faq/faq";
import Headline from "../../components/headline/headline";
import { StakingCard } from "./staking-card/staking-card";
import style from "./staking-choice.module.scss";
import { useBonds } from "@fantohm/shared-web3";
import SsInfoBlock from "./staking-choice/ss-info-block/ss-info-block";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {DaiToken} from "@fantohm/shared/images";
import Logo from "../../components/logo/logo";

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
    subtitle: ["The safest way to earn yeilds on your Dai"],
    sx: {marginTop: "10em"}
  };
  const simpleSafe = {
    title: "Simple & safe returns",
    subtitle: ["To farm and earn rewards, investors only provide one side of the pair while our protocol deposits the other."]
  };
  const getStarted = {
    title: "Get started today",
    subtitle: ["Single Sided Staking is similar to Liquidity Pair (LP) farming, but eliminates impermanent loss."]
  };

  return (
    <Box className="flexCenterCol">
      <Headline {...heroContent} />
      <Box sx={{marginTop: "3em", mb: '20em'}} className="flexCenterCol">
        <DaiCard className="dai" tokenImage={DaiToken}>
          <h2 className={style['daiAPR']}>20.00% APR</h2>
          <Grid container>
            <Grid item xs={6} sx={{justifyContent:'left'}}>
              <span className={style['tvlInfo']}>Staked TVL</span>
            </Grid>
            <Grid item xs={6} sx={{display:'flex', justifyContent: 'flex-end'}}>
              <span className={style['tvlInfo']}>$1,562,063</span>
            </Grid>
          </Grid>
        </DaiCard>
        <Grid container sx={{my: '2em'}} columnSpacing={2}>
          <Grid item xs={12} sm={6}  sx={{display: 'flex', justifyContent: {xs: 'center', sm: 'flex-end'}}}>
            <Button variant="contained" color="primary" sx={{width: '255px'}} href="staking#deposit">Deposit</Button>
          </Grid>
          <Grid item xs={12} sm={6} sx={{display: 'flex', justifyContent: {xs: 'center', sm: 'flex-start'}, mt: {xs: '1em', md: '0'}}}>
            <Button variant="outlined" sx={{width: '255px'}} href="staking#learn-more">Learn More</Button>
          </Grid>
        </Grid>
      </Box>
      <Headline {...simpleSafe} id="learn-more" sx={{mb: '5em'}} />
      <SsInfoBlock />
      <Headline {...getStarted} />
      <Box className="flexCenterCol" sx={{marginTop: "3em", mb:'10em'}} id="deposit">
        <StakingCard bondType="6month" term={6} roi={15} apy={32.55} />
      </Box>
      <Faq sx={{mb: '10em'}}/>
      <Headline {...simpleSafe} sx={{mb: '2em'}}/>
      <Logo />
    </Box>
  );
};

export default StakingChoicePage;
