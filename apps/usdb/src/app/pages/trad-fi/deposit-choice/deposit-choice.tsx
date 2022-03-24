import style from './deposit-choice.module.scss';
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
  const {connect, hasCachedProvider, chainId, connected} = useWeb3Context();
  const {bonds, allBonds} = useBonds(chainId || 250);
  const [bondsUsdb, setBondsUsdb] = useState<Array<IAllBondData>>();

  useEffect(() => {
    console.log("set bonds")
    setBondsUsdb(bonds.filter((bond) => bond.type === BondType.TRADFI));
    console.log(bondsUsdb);
  }, [bonds]);

  return (
   <Box id={params.id}>
        <Box className={style["__bond-cards"]}>
          {
            bondsUsdb?.map((bond, index) =>
            (<DepositCard key={index} bondType="3month" term={bond.name === "tradfi3month" ? 3 : 6} roi={Number(bond.roi)} apy={Number(bond.roi)} bond={bond} days={bond.vestingTerm}/>))
          }
          {
            !bondsUsdb && connected ? (
              <span>No available bonds on this network.</span>
            ) : (<></>)
          }
        </Box>
    </Box>
  );
};

export default DepositChoice;
