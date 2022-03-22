import { Grid } from '@mui/material';
import IconLink from '../../../components/icon-link/icon-link';
import { WalletIcon, TradFiIcon, BankIcon, NFTsIcon, DoughnutChartIcon, ShieldIcon } from '@fantohm/shared/images';

/* eslint-disable-next-line */
export interface IconGridProps {}

export const IconGrid = (props: IconGridProps): JSX.Element  => {
  return (
    <Grid container rowSpacing={3} sx={{maxWidth: '645px'}}>
      <Grid item md={4} xs={6}>
        <IconLink title="Staking" icon={WalletIcon} linkText="Learn More" link="/staking"/>
      </Grid>
      <Grid item md={4} xs={6}>
        <IconLink title="TradFi" icon={TradFiIcon} linkText="Learn More" link="/trad-fi"/>
      </Grid>
      <Grid item md={4} xs={6}>
        <IconLink title="USDBank" icon={BankIcon}/>
      </Grid>
      <Grid item md={4} xs={6}>
        <IconLink title="TBA" icon={NFTsIcon} />
      </Grid>
      <Grid item md={4} xs={6}>
        <IconLink title="TBA" icon={DoughnutChartIcon} />
      </Grid>
      <Grid item md={4} xs={6}>
        <IconLink title="TBA" icon={ShieldIcon} />
      </Grid>
    </Grid>
  );
}

export default IconGrid;
