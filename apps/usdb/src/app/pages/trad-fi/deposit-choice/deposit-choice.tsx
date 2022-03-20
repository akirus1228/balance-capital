import css from './deposit-choice.module.scss';
import {
  Box,
  Grid,
  Zoom,
} from '@mui/material';
import {DepositCard} from './deposit-card';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {BondType} from "../../../../../../../libs/shared/web3/src/lib/lib/bond";
import Bond from "../../bond/bond";
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {useBonds} from "../../../../../../../libs/shared/web3/src/lib/hooks";
import {useWeb3Context} from "@fantohm/shared-web3";

interface IDepositChoiceParams {
  id?: string;
}

export const DepositChoice = (params: IDepositChoiceParams): JSX.Element => {
  const {connect, hasCachedProvider, chainID} = useWeb3Context();
  const {bonds, allBonds} = useBonds(chainID || 250);

  const bondsUsdb = bonds.filter((bond) => bond.type === BondType.TRADFI);
  console.log(bonds)
  return (
    <Box sx={{marginTop: '3em'}} id={params.id}>
      <Zoom in={true}>
        <Grid container item xs={12} spacing={4} className={css['gridParent']}>
          <Grid item xs={0} md={2}>
            &nbsp;
          </Grid>
          <Grid item xs={12} md={4}>
            <DepositCard bondType="3month" term={3} roi={5} apy={21.55} bond={bondsUsdb[0]} days={1}/>
            <DepositCard bondType="3month" term={3} roi={5} apy={21.55} days={90} bond={bondsUsdb[0]}/>
          </Grid>
          <Grid item xs={12} md={4}>
            <DepositCard bondType="6month" term={6} roi={15} apy={32.55} bond={bondsUsdb[0]} days={1}/>
            <DepositCard bondType="6month" term={6} roi={15} apy={32.55} days={180} bond={bondsUsdb[0]}/>
          </Grid>
          <Grid item xs={0} md={2}>
            &nbsp;
          </Grid>
        </Grid>
      </Zoom>
    </Box>
  );
};

export default DepositChoice;
