import { DaiToken } from '@fantohm/shared/images';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import style from './wallet-ballance.module.scss';

/* eslint-disable-next-line */
export interface WalletBalanceProps {
  currency?: string;
  balance?: string;
}

interface IWalletBalanceState {
  currency: string;
  balance: string;
}

export const WalletBalance = (props: WalletBalanceProps): JSX.Element => {
  const [state, setState] = useState({} as IWalletBalanceState)
  useEffect(() => {
    setState({...state, currency: props.currency ? props.currency : "DAI"});
    setState({...state, balance: props.balance ? props.balance : "loading..."});
  }, [props.currency, props.balance])

  return (
    <Box className={`flexCenterRow ${style['currencySelector']}`}>
      <img src={DaiToken} style={{height: '31px', marginRight: "1em"}} alt="DAI Token Symbol"/>
      <Box sx={{display: "flex", flexDirection: "column", justifyContent: "left"}}>
        <span className={style['name']}>{props.currency} balance</span>
        <span className={style['amount']}>{props.balance} DAI</span>
      </Box>
    </Box>
  );
}

export default WalletBalance;
