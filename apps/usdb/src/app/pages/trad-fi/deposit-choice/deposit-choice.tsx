import style from './deposit-choice.module.scss';
import {
  Box,
  Grid,
  Zoom,
} from '@mui/material';
import {DepositCard} from './deposit-card';
import {BondType} from "@fantohm/shared-web3";
import {useBonds} from "@fantohm/shared-web3";
import {useWeb3Context} from "@fantohm/shared-web3";

interface IDepositChoiceParams {
  id?: string;
}

export const DepositChoice = (params: IDepositChoiceParams): JSX.Element => {
  const {connect, hasCachedProvider, chainId} = useWeb3Context();
  const {bonds, allBonds} = useBonds(chainId || 250);

  const bondsUsdb = bonds.filter((bond) => bond.type === BondType.TRADFI);
  console.log(bonds)
  return (
    <Box id={params.id}>
        <Box className={style["__bond-cards"]}>
            <DepositCard bondType="3month" term={3} roi={5} apy={21.55} bond={bondsUsdb[0]} days={1}/>
            <DepositCard bondType="3month" term={3} roi={5} apy={21.55} days={90} bond={bondsUsdb[0]}/>
        </Box>
        <Box className={style["__bond-cards"]}>
            <DepositCard bondType="6month" term={6} roi={15} apy={32.55} bond={bondsUsdb[0]} days={1}/>
            <DepositCard bondType="6month" term={6} roi={15} apy={32.55} days={180} bond={bondsUsdb[0]}/>
        </Box>
    </Box>
  );
};

export default DepositChoice;
