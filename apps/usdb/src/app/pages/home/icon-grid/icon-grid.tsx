import { Grid } from '@mui/material';
import IconLink from '../../../components/icon-link/icon-link';
import { WalletIcon, TradFiIcon, BankIcon, NFTsIcon, DoughnutChartIcon, ShieldIcon } from '@fantohm/shared/images';

export const IconGrid = (): JSX.Element  => {
  return (
    <Grid container rowSpacing={6}>
      <Grid item md={4} xs={6}>
        <IconLink title="Staking" icon={WalletIcon} link="/staking"/>
      </Grid>
      <Grid item md={4} xs={6}>
        <IconLink title="TradFi" icon={TradFiIcon} link="/trad-fi"/>
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
