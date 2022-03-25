import {
  Button,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { useSelector } from 'react-redux';
import style from './my-account.module.scss';
import Info from '../../../assets/icons/info.svg';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {
  isPendingTxn,
  txnButtonTextGeneralPending,
} from "@fantohm/shared-web3";
import { RootState } from '../../store';
import AccountDetails from './my-account-details';
import { useState } from 'react';

export const currencyFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

export const MyAccountDetailsTable = ({ accountDetails, onRedeemAll }: { accountDetails: AccountDetails, onRedeemAll: () => void }): JSX.Element => {
  const themeType = useSelector((state: any) => state.app.theme);
  const backgroundColor = themeType === 'light' ? '#f7f7ff' : '#0E0F10';
  const [pendingClaim, setPendingClaim] = useState(false);


  const pendingTransactions = useSelector((state: RootState) => {
    return state?.pendingTransactions;
  });

  const onRedeemAllInternal = async () => {
    setPendingClaim(true);
    await onRedeemAll();
    setPendingClaim(false);
  }

  return (
    <Paper
      elevation={0}
      sx={{ marginTop: '10px' }}
      className={style['rowCard']}
      style={{ backgroundColor: `${backgroundColor}` }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="subtitle2" className={style['subTitle']}>
            Portfolio value{' '}
            <img src={Info} alt="info" className={style['infoIcon']} />{' '}
          </Typography>
          <Typography variant="h5">
            {accountDetails &&
              currencyFormat.format(accountDetails.balance)}
          </Typography>
        </Grid>
        {/* Hide until the graph ready */}
        {/* <Grid item xs={12} sm={6} md={3}>
          <Typography variant="subtitle2" className={style['subTitle']}>
            Total rewards claimed
            <img
              src={Info}
              alt="info"
              className={style['infoIcon']}
            />{' '}
          </Typography>
          <Typography variant="h5">
            {accountDetails &&
              currencyFormat.format(accountDetails.rewardsClaimed)}
          </Typography>
        </Grid> */}
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="subtitle2" className={style['subTitle']}>
            Claimable rewards
            <img
              src={Info}
              alt="info"
              className={style['infoIcon']}
            />{' '}
          </Typography>
          <Typography variant="h5">
            +
            {accountDetails &&
              currencyFormat.format(accountDetails.claimableRewards)}
          </Typography>
        </Grid>
        {/* <Grid item xs={12} sm={6} md={4}>
          <Button
            variant="contained"
            disableElevation
            disabled={pendingClaim}
            onClick={() => {
              onRedeemAllInternal();
            }}
          >
            {pendingClaim ? '...Pending' : 'Claim all'}
          </Button>
        </Grid> */}
      </Grid>
    </Paper>
  );
};



export default MyAccountDetailsTable;
