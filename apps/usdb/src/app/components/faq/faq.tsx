import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, SxProps, Theme, Typography } from '@mui/material';
import style from './faq.module.scss';
import dots from '../../../assets/images/dots.svg';
import { ExpandMore } from '@mui/icons-material';

/* eslint-disable-next-line */
export interface FaqProps {
  sx?: SxProps<Theme>
}

type FaqItem = {
  title: string;
  content: string;
} 

export const faqItems: FaqItem[] = [
  {
    title: "What is USDB?",
    content: "USDB is a truly decentralised stablecoin backed by FHM. It uses a method known as proof of burn to cement its value at $1. Proof of burn is a concept in which a coin is destroyed at a specific point in time and value.  At that moment it is recorded in a blockchain transaction. USDB is valued and maintained at $1 through its relationship with FHM, a decentralised reserve asset and an arbitrage that anyone can participate in."
  },
  {
    title: "How to use TradFi Bonds",
    content: "Connect your wallet using the button in the upper right corner of this page and use the interface just above these FAQs. Deposit your DAI and return in 3-6 months for your returns. The interface will only appear on the ETH and FTM networks."
  },
  {
    title: "Is it really only 2 steps?",
    content: "Yes! We've streamlined this process for your convenience."
  }
]

export const Faq = (props: FaqProps): JSX.Element => {
  return (
    <Box className={`${style['faqSection']} flexCenterCol`} sx={{marginTop: '5em', ...props.sx}}>
      <Grid container columnSpacing={5}>
        <Grid item xs={12} md={6}>
          <Box className="flexCenterCol">
            <span className={style['faqHeader']}>Frequently asked questions</span>
            <Box className={style['dots']}>
              <img src={dots} alt="grid of dots" style={{marginBottom: '2em'}}/>
              <img src={dots} alt="grid of dots" />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          
            {faqItems.map((faqItem: FaqItem, key: number) => (
              <Accordion key={`faq-acc-${key}`}>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                >
                  {faqItem.title}
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    {faqItem.content}
                  </Typography>
                </AccordionDetails>
                </Accordion>
            ))}
            
          
          <span className={style['faqTitle']}>What is USDB?</span>
          <hr />
          <span className={style['faqTitle']}>How do I add liquidity?</span>
          <hr />
          <span className={style['faqTitle']}>What's the minimum or maximum I can deposit?</span>
          <hr />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Faq;
