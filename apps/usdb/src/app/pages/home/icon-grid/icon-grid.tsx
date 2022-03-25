import { Grid } from '@mui/material';
import IconLink from '../../../components/icon-link/icon-link';
import style from './icon-grid.module.scss';
import { WalletIcon, TradFiIcon, BankIcon, NFTsIcon, xFhmIcon, MintIcon } from '@fantohm/shared/images';

export const IconGrid = (): JSX.Element  => {
  return (
    <Grid container rowSpacing={6} className={style['productGrid']}>
      <Grid item md={4} xs={6}>
        <IconLink title="Staking" icon={WalletIcon} link="/staking"/>
      </Grid>
      <Grid item md={4} xs={6}>
        <IconLink title="TradFi" icon={TradFiIcon} link="/trad-fi"/>
      </Grid>
      <Grid item md={4} xs={6}>
        <IconLink title="xFHM" icon={xFhmIcon} link="/xfhm"/>
      </Grid>
      <Grid item md={4} xs={6}>
        <IconLink title="Mint USDB" icon={MintIcon} link="/mint"/>
      </Grid>
      <Grid item md={4} xs={6}>
        <IconLink title="USDBank" icon={BankIcon}/>
      </Grid>
      <Grid item md={4} xs={6}>
        <IconLink title="TBA" icon={NFTsIcon} />
      </Grid>
    </Grid>
  );
}

export default IconGrid;
