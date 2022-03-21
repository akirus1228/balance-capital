import { Box, Grid } from '@mui/material';
import style from './faq.module.scss';
import dots from '../../../assets/images/dots.svg';

/* eslint-disable-next-line */
export interface FaqProps {}

export const Faq = (props: FaqProps): JSX.Element => {
  return (
    <Box className="flexCenterCol" sx={{marginTop: '5em'}}>
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
