import { Box, Button, Grid, Typography } from "@mui/material";
import DaiCard from "../../components/dai-card/dai-card";
import Faq, { FaqItem } from "../../components/faq/faq";
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

export const faqItems: FaqItem[] = [
  {
    title: "What is USDB?",
    content: "USDB is a truly decentralised stablecoin backed by FHM. It uses a method known as proof of burn to cement its value at $1. Proof of burn is a concept in which a coin is destroyed at a specific point in time and value.  At that moment it is recorded in a blockchain transaction. USDB is valued and maintained at $1 through its relationship with FHM, a decentralised reserve asset and an arbitrage that anyone can participate in."
  },
  {
    title: "How to use Single Sided Staking",
    content: "Connect your wallet using the button in the upper right corner of this page and use the interface just above these FAQs. Deposit your DAI and return in 3-6 months for your returns. The interface will only appear on the ETH and FTM networks."
  },
  {
    title: "Is it really only 2 steps?",
    content: "Yes! We've streamlined this process for your convenience."
  },
  {
    title: "What happens if I want my money back?",
    content: "You can withdraw your funds early, but you will receive your original value but in USDB and will be subject to a fee of 5%. "
  },
  {
    title: "What happens at the end of the term of my Deposit?",
    content: "You will need to withdraw the bond back into your wallet. That action is not automatic. You will be paid out in USDB."
  }
];

export const StakingChoicePage = (): JSX.Element => {
  const { bonds } = useBonds(250);

  const heroContent = {
    hero: true,
    title: "Earn up to 20% on Dai",
    subtitle: ["The safest way to earn yeilds on your Dai"]
  };
  const simpleSafe = {
    title: "Simple & safe returns",
    subtitle: ["To earn rewards, investors only provide one side of the pair while our protocol deposits the other."]
  };
  const getStarted = {
    title: "Get started today",
    subtitle: ["Single Sided Staking is similar to Liquidity Pair (LP) farming but eliminates impermanent loss."]
  };

  return (
    <>
      <Box className={style["__heading"]}>
        <Headline {...heroContent}/>
        <Box className={`${style['depositBox']} flexCenterCol`}>
          <DaiCard className={`${style['daiIcon']} dai`} tokenImage={DaiToken}>
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
            <Grid item xs={12} sm={6}  sx={{display: 'flex', justifyContent: {xs: 'center', sm: 'flex-end'}}} className={style['buttonArea']}>
              <Button variant="contained" color="primary" sx={{width: '255px'}} href="staking#deposit" className={style['depositButton']}>Deposit</Button>
            </Grid>
            <Grid item xs={12} sm={6} sx={{display: 'flex', justifyContent: {xs: 'center', sm: 'flex-start'}}} className={style['buttonArea']}>
              <Button variant="outlined" sx={{width: '255px'}} href="staking#learn-more" className={style['learnMore']}>Learn More</Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box className={style["__section"]}>
        <Headline {...simpleSafe} id="learn-more" sx={{mb: '5em'}} />
        <SsInfoBlock />
      </Box>
      <Box className={style["__section"]}>
        <Headline {...getStarted} />
        <Box className="flexCenterCol" sx={{marginTop: "3em", mb:'10em'}} id="deposit">
          <StakingCard bondType="6month" term={6} roi={15} apy={20.00} />
        </Box>
        <Faq faqItems={faqItems} sx={{mb: '10em'}}/>
      </Box>
      <Box className={style["__section"]}>
        <Headline {...simpleSafe} sx={{mb: '2em'}}/>
        <Logo />
      </Box>
    </>
  );
};

export default StakingChoicePage;
