import css from './staking-choice.module.scss';
import {
  Box,
  Grid,
  Zoom,
} from '@mui/material';
import { StakingCard } from './staking-card';

export const StakingChoicePage = (): JSX.Element => {
  return (
    <Box sx={{marginTop: '3em'}}>
      <Zoom in={true}>
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
      </Zoom>
    </Box>
  );
};

export default StakingChoicePage;