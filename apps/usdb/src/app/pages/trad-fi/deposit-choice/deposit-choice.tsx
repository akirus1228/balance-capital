import style from './deposit-choice.module.scss';
import {
  Box,
} from '@mui/material';
import {DepositCard} from './deposit-card';
import {BondType, IAllBondData, TRADFI_3M} from "@fantohm/shared-web3";
import {useBonds} from "@fantohm/shared-web3";
import {useWeb3Context} from "@fantohm/shared-web3";
import { useEffect, useState } from 'react';
import {prettifySeconds} from "../../../helper";

interface IDepositChoiceParams {
  id?: string;
}


export const DepositChoice = (params: IDepositChoiceParams): JSX.Element => {
  const { chainId, connected } = useWeb3Context();
  const { bonds } = useBonds(chainId || 250);
  const [bondsUsdb, setBondsUsdb] = useState<Array<IAllBondData>>();

  useEffect(() => {
    setBondsUsdb(bonds.filter((bond) => bond.type === BondType.TRADFI));
  }, [bonds]);

  return (
   <Box id={params.id}>
        <Box className={style["__bond-cards"]}>
          {
            bondsUsdb?.map((bond, index) =>
            (<DepositCard key={index} bondType="3month" months={bond.name === TRADFI_3M ? 3 : 6} roi={Number(bond.roi)} apr={Number(bond.apr)} bond={bond} vestingTermPretty={prettifySeconds(bond.vestingTermSeconds)}/>))
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
