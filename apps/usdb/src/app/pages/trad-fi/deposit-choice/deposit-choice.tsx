import css from './deposit-choice.module.scss';
import {
  Box,
  Grid,
  Zoom,
} from '@mui/material';
import {DepositCard} from './deposit-card';
import {BondType, IAllBondData} from "@fantohm/shared-web3";
import {useBonds} from "@fantohm/shared-web3";
import {useWeb3Context} from "@fantohm/shared-web3";
import { useEffect, useState } from 'react';

interface IDepositChoiceParams {
  id?: string;
}

export const DepositChoice = (params: IDepositChoiceParams): JSX.Element => {
  const {connect, hasCachedProvider, chainId} = useWeb3Context();
  const {bonds, allBonds} = useBonds(chainId || 250);
  const [bondsUsdb, setBondsUsdb] = useState<Array<IAllBondData>>()

  useEffect(() => {
    console.log("set bonds")
    setBondsUsdb(bonds.filter((bond) => bond.type === BondType.TRADFI));
  }, [bonds]);

  console.log(bonds);
  return (
    <Box sx={{marginTop: '3em'}} id={params.id}>
      <Zoom in={true}>
        <Grid container item xs={12} spacing={4} className={css['gridParent']}>
          <Grid item xs={0} md={2}>
            &nbsp;
          </Grid>
          <Grid item xs={12} md={4}>
            {bondsUsdb?.map((bond, index) => 
              (<DepositCard key={index} bondType="3month" term={3} roi={5} apy={21.55} bond={bond} days={1}/>))}
          </Grid>
          <Grid item xs={12} md={4}>
            
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
