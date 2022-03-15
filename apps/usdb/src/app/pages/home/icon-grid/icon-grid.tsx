import { Grid } from '@mui/material';
import IconLink from '../../../components/icon-link/icon-link';
import walletIcon from '../../../../assets/icons/wallet.svg';
import windowsIcon from '../../../../assets/icons/windows.svg';
import creditCardsIcon from '../../../../assets/icons/credit-cards.svg';
import bankIcon from '../../../../assets/icons/bank.svg';
import doughnutGraphIcon from '../../../../assets/icons/doughnut-graph.svg';
import shieldIcon from '../../../../assets/icons/shield.svg'; 

/* eslint-disable-next-line */
export interface IconGridProps {}

export const IconGrid = (props: IconGridProps): JSX.Element  => {
  return (
    <Grid container rowSpacing={3} sx={{maxWidth: '645px'}}>
      <Grid item md={4} xs={6}>
        <IconLink title="Staking" icon={walletIcon} linkText="Learn More" link="/staking"/>
      </Grid>
      <Grid item md={4} xs={6}>
        <IconLink title="TradFi" icon={creditCardsIcon} linkText="Learn More" link="/trad-fi"/>
      </Grid>
      <Grid item md={4} xs={6}>
        <IconLink title="USDBank" icon={bankIcon}/>
      </Grid>
      <Grid item md={4} xs={6}>
        <IconLink title="TBA" icon={windowsIcon} />
      </Grid>
      <Grid item md={4} xs={6}>
        <IconLink title="TBA" icon={doughnutGraphIcon} />
      </Grid>
      <Grid item md={4} xs={6}>
        <IconLink title="TBA" icon={shieldIcon} />
      </Grid>
    </Grid>
  );
}

export default IconGrid;
