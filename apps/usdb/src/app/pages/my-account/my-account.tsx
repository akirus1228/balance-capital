import { Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { format, formatDuration, intervalToDuration, formatDistanceToNow } from "date-fns";
import style from './my-account.module.scss';

export interface Investment {
  id: string,
  amount: number,
  rewards: number,
  rewardToken: string,
  term: number,
  termType: string,
  roi: number,
  vestDate: number,
}

export interface AccountDetails {
  address: string,
  balance: number,
  rewardsClaimed: number,
  claimableRewards: number,
}

export const accountDetails: AccountDetails = {
  address: '0x9a468E8828318Aa40a2F750B7cF575F10ca8B875',
  balance: 36500.03,
  rewardsClaimed: 1247.31,
  claimableRewards: 237.11,
}

export const currencyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

export interface MyAccountProps {}

const activeInvestments: Investment[] = [
  { id: '4', amount: 39275.51, rewards: 1963.75, rewardToken: 'USDB', term: 3, termType: 'months', roi: 20.0, vestDate: 1655182800 },
];

const inactiveInvestments: Investment[] = [
  { id: '1', amount: 29275.51, rewards: 832.23, rewardToken: 'USDB', term: 6, termType: 'months', roi: 32.5, vestDate: 1638507600 },
  { id: '2', amount: 29275.51, rewards: 1963.75, rewardToken: 'USDB', term: 6, termType: 'months', roi: 32.5, vestDate: 1638507600 },
  { id: '3', amount: 29275.51, rewards: 1963.75, rewardToken: 'USDB', term: 6, termType: 'months', roi: 32.5, vestDate: 1638507600 },
];

export function shorten(str: string) {
	if (str.length < 10) return str;
	return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
}

export const MyAccount = (props: MyAccountProps): JSX.Element => {
  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      width: '100%'}}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        paddingTop: '100px',
        paddingLeft: '50px',
        paddingRight: '50px',
        width: '100%',
        maxWidth: '1200px'}}
        className={style['hero']}>
        <Box>
          <Typography variant="subtitle1">My Account ({shorten(accountDetails.address)})</Typography>
          <Paper elevation={0}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2">Portfolio value</Typography>
                <Typography variant="h5">{currencyFormat.format(accountDetails.balance)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2">Total rewards claimed</Typography>
                <Typography variant="h5">{currencyFormat.format(accountDetails.rewardsClaimed)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2">Claimable rewards</Typography>
                <Typography variant="h5">+{currencyFormat.format(accountDetails.claimableRewards)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button variant="contained" disableElevation>Claim all rewards</Button>
              </Grid>
            </Grid>
          </Paper>
        </Box>
        <Box my={4}>
          <Typography variant="subtitle1">Active Investments ({activeInvestments.length})</Typography>
          <Paper elevation={0}>
            {activeInvestments.map(investment => (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4} md={2}>
                  <Typography variant="subtitle2">Amount</Typography>
                  <Typography variant="h6">{currencyFormat.format(investment.amount)}</Typography>
                </Grid>
                <Grid item xs={12} sm={4} md={2}>
                  <Typography variant="subtitle2">Rewards</Typography>
                  <Typography variant="h6">{currencyFormat.format(investment.rewards)} {investment.rewardToken}</Typography>
                </Grid>
                <Grid item xs={12} sm={4} md={2}>
                  <Typography variant="subtitle2">Fixed deposit</Typography>
                  <Typography variant="h6">{investment.term} {investment.termType}</Typography>
                </Grid>
                <Grid item xs={12} sm={4} md={2}>
                  <Typography variant="subtitle2">ROI</Typography>
                  <Typography variant="h6">{investment.roi}%</Typography>
                </Grid>
                <Grid item xs={12} sm={4} md={2}>
                  <Typography variant="subtitle2">Time remaining</Typography>
                  <Typography variant="h6">{formatDistanceToNow(new Date(investment.vestDate * 1000))}</Typography>
                </Grid>
                <Grid item xs={12} sm={4} md={2}>
                  <Button variant="contained" disableElevation>Manage</Button>
                </Grid>
              </Grid>
            ))}
          </Paper>
        </Box>
        <Box my={4}>
          <Typography variant="subtitle1">Previous Investments ({inactiveInvestments.length})</Typography>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Amount</TableCell>
                  <TableCell>Rewards</TableCell>
                  <TableCell>Fixed deposit</TableCell>
                  <TableCell>ROI</TableCell>
                  <TableCell>Lock up period</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inactiveInvestments.map(investment => (
                  <TableRow
                    key={investment.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">{currencyFormat.format(investment.amount)}</TableCell>
                    <TableCell>{currencyFormat.format(investment.rewards)} {investment.rewardToken}</TableCell>
                    <TableCell>{investment.term} {investment.termType}</TableCell>
                    <TableCell>{investment.roi}%</TableCell>
                    <TableCell>Completed {format(new Date(investment.vestDate * 1000), "MM/dd/yyyy")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
}

export default MyAccount;
