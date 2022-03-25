import style from './deposit-choice.module.scss';
import {
  Box,
} from '@mui/material';
import {DepositCard} from './deposit-card';
import {allBonds, BondType, IAllBondData, TRADFI_3M} from "@fantohm/shared-web3";
import {useBonds} from "@fantohm/shared-web3";
import {useWeb3Context} from "@fantohm/shared-web3";
import {useEffect, useState} from 'react';
import {prettifySeconds} from "../../../helper";

interface DepositChoiceParams {
  id?: string;
}


export const DepositChoice = (params: DepositChoiceParams): JSX.Element => {
  const {chainId, connected} = useWeb3Context();
  const {bonds} = useBonds(chainId || 250);
  const [bondsUsdb, setBondsUsdb] = useState<Array<IAllBondData>>();
  const allTradfiBonds = allBonds.filter((bond) => bond.type === BondType.TRADFI).sort((a, b) => (a.days > b.days) ? 1 : -1)
  useEffect(() => {
    setBondsUsdb(bonds.filter((bond) => bond.type === BondType.TRADFI).sort((a, b) => (a.days > b.days) ? 1 : -1));
  }, [bonds, chainId]);

  return (
    <Box id={params.id}>
      <Box className={style["__bond-cards"]}>
        {
          bondsUsdb?.map((bond, index) =>
            (<DepositCard 
              key={`dc-${index}`} 
              bondType={bond.name} 
              months={bond.name === "tradfi3month" ? 3 : 6}
              roi={Number(bond.roi)} apr={Number(bond.apr)} 
              bond={bond}
              vestingTermPretty={bond.name === "tradfi3month" ? "30 days" : "90 days"}
            />))
        }
        {
          (!bondsUsdb || bondsUsdb.length === 0 ) ? (
                allTradfiBonds?.map((bond, index) =>
                  (<DepositCard 
                    key={index} 
                    bondType={bond.name} 
                    months={bond.name === "tradfi3month" ? 3 : 6}
                    roi={Number(bond.roi)} 
                    apr={Number(bond.roi)} 
                    bond={bond}
                    vestingTermPretty={bond.name === "tradfi3month" ? "30 days" : "90 days"}
                  />))
            ) :
            (<></>)
        }
      </Box>
    </Box>
  );
};

export default DepositChoice;
