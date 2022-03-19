import css from './staking-choice.module.scss';
import {
  Box,
  Grid,
  Paper,
  Zoom,
} from '@mui/material';
import { StakingCard } from './staking-card';
import daiToken from "../../../assets/tokens/DAI.svg";
import Headline from '../../components/headline/headline';

export const StakingChoicePage = (): JSX.Element => {
  const heroContent = {
    hero: true,
    title: "Earn up to 20% on Dai",
    subtitle: ["The safest way to earn on your Dai with zero risk"],
    sx: {marginTop: '10em'}
  }
  return (
    <>
      <Headline {...heroContent}/>
      <Box sx={{marginTop: '3em'}}>
        <Paper className="dai">
          <div>

          </div>
        </Paper>
      </Box>
      <Box sx={{marginTop: '3em'}}>
        <Grid container item xs={12} spacing={4} className={css['gridParent']}>
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
    </>
  );
};

export default StakingChoicePage;