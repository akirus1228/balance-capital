import {
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import {tableCellClasses} from '@mui/material/TableCell';
import {Box} from '@mui/system';
import {
  format,
  formatDuration,
  intervalToDuration,
  formatDistanceToNow,
} from 'date-fns';
import {useTheme} from '@mui/material/styles';
import style from './my-account.module.scss';
import {styled} from '@mui/material/styles';
import Info from '../../../assets/icons/info.svg';
import {
  Bond, IAllBondData,
  isPendingTxn, IUserBondDetails, redeemAllBonds,
  RootState, setWalletConnected,
  redeemOneBond,
  txnButtonTextGeneralPending,
  useBonds,
  useWeb3Context
} from "@fantohm/shared-web3";
import {useEffect, useState} from "react";
import {allBonds} from "@fantohm/shared-web3";
import {prettifySeconds, secondsUntilBlock} from "@fantohm/shared-web3";

export interface Investment {
  id: string;
  amount: number;
  rewards: number;
  rewardToken: string;
  term: number;
  termType: string;
  roi: string;
  vestDate: number;
}

export interface AccountDetails {
  address: string;
  balance: number;
  rewardsClaimed: number;
  claimableRewards: number;
}

export const accountDetails: AccountDetails = {
  address: '0x9a468E8828318Aa40a2F750B7cF575F10ca8B875',
  balance: 36500.03,
  rewardsClaimed: 1247.31,
  claimableRewards: 237.11,
};

export const currencyFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

// export interface MyAccountProps {}

let activeInvestments: Investment[] = [
  {
    id: '4',
    amount: 39275.51,
    rewards: 1963.75,
    rewardToken: 'FHUD',
    term: 3,
    termType: 'months',
    roi: "20.0",
    vestDate: 1655182800,
  },
];

const inactiveInvestments: Investment[] = [
  {
    id: '1',
    amount: 29275.51,
    rewards: 832.23,
    rewardToken: 'USDB',
    term: 6,
    termType: 'months',
    roi: "32.5",
    vestDate: 1638507600,
  },
  {
    id: '2',
    amount: 29275.51,
    rewards: 1963.75,
    rewardToken: 'USDB',
    term: 6,
    termType: 'months',
    roi: "32.5",
    vestDate: 1638507600,
  },
  {
    id: '3',
    amount: 29275.51,
    rewards: 1963.75,
    rewardToken: 'USDB',
    term: 6,
    termType: 'months',
    roi: "32.5",
    vestDate: 1638507600,
  },
];

export function shorten(str: string) {
  if (str.length < 10) return str;
  return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
}

const StyledTableCell = styled(TableCell)(({theme}) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#1A1A1A',
    color: '#E3E2EA',
    border: 'none',
  },
  border: 'none',
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    border: 'none',
  },
}));

const StyledTableRow = styled(TableRow)(({theme}) => ({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover,
  },
  border: 'none',
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export interface MyAccountProps {
  bond: any;
}

export const MyAccount = (): JSX.Element => {
  const themeType = useSelector((state: any) => state.app.theme);
  const backgroundColor = themeType === 'light' ? '#f7f7ff' : '#0E0F10';

  const dispatch = useDispatch();
  const {provider, address, chainId} = useWeb3Context();
  const {bonds} = useBonds(chainId ?? 250);
  const [currentBlock, setCurrentBlock] = useState(0);

  const pendingTransactions = useSelector((state: RootState) => {
    return state?.pendingTransactions;
  });

  const accountBonds = useSelector((state: RootState) => {
    return state.account.bonds;
  });

  useEffect(() => {
    activeInvestments = []
    if (accountBonds) {
      for (let i = 0; i < bonds.length - 1; i++) {
        const bond: IAllBondData = (bonds[i] as IAllBondData);
        if (accountBonds[allBonds[i].name]) {
          console.log(accountBonds);
          const userBonds = accountBonds[allBonds[i].name].userBonds;
          for (let j = 0; j < userBonds.length; j++) {
            const investment: Investment = {
              id: `${j}`,
              amount: 29275.51,
              rewards: Number(userBonds[j].pendingPayout),
              rewardToken: 'USDB',
              term: Number(bond.vestingTerm),
              termType: 'months',
              roi: bonds[i].roi,
              vestDate: Number(userBonds[j].bondMaturationBlock),
            }
            activeInvestments.push(
              investment
            )
          }
        }
      }
    }
  }, [accountBonds]);

  useEffect(() => {
    async function fetchData() {
      if (provider) {
        setCurrentBlock(await provider.getBlockNumber())
      }
    }

    fetchData()
  }, [provider])

  const pendingClaim = () => {
    if (
      isPendingTxn(pendingTransactions, "redeem_all_bonds") ||
      isPendingTxn(pendingTransactions, "redeem_all_bonds_autostake")
    ) {
      return true;
    }

    return false;
  };

  const onRedeemAll = async () => {
    console.log("redeeming all bonds");
    if (provider && chainId) {
      await dispatch(redeemAllBonds({networkId: chainId, address, bonds, provider, autostake: false}));
    }

    console.log("redeem all complete");
  };

  const onRedeemOne = async () => {
    console.log("redeeming all bonds");
    if (provider && chainId) {
      await dispatch(redeemAllBonds({networkId: chainId, address, bonds, provider, autostake: false}));
    }

    console.log("redeem all complete");
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          paddingTop: '100px',
          paddingLeft: '50px',
          paddingRight: '50px',
          width: '100%',
          maxWidth: '1200px',
        }}
        className={style['hero']}
      >
        <Box>
          <Typography variant="subtitle1">
            My Account{' '}
            <span style={{color: '#858E93'}}>
              ({shorten(accountDetails.address)})
            </span>
          </Typography>
          <Paper
            elevation={0}
            sx={{marginTop: '10px'}}
            className={style['rowCard']}
            style={{backgroundColor: `${backgroundColor}`}}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" className={style['subTitle']}>
                  Portfolio value{' '}
                  <img src={Info} alt="info" className={style['infoIcon']}/>{' '}
                </Typography>
                <Typography variant="h5">
                  {currencyFormat.format(accountDetails.balance)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" className={style['subTitle']}>
                  Total rewards claimed
                  <img
                    src={Info}
                    alt="info"
                    className={style['infoIcon']}
                  />{' '}
                </Typography>
                <Typography variant="h5">
                  {currencyFormat.format(accountDetails.rewardsClaimed)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" className={style['subTitle']}>
                  Claimable rewards
                  <img
                    src={Info}
                    alt="info"
                    className={style['infoIcon']}
                  />{' '}
                </Typography>
                <Typography variant="h5">
                  +{currencyFormat.format(accountDetails.claimableRewards)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button variant="contained" disableElevation
                        disabled={pendingClaim()}
                        onClick={() => {
                          onRedeemAll()
                        }}>
                  {txnButtonTextGeneralPending(pendingTransactions, "redeem_all_bonds", "Claim all")}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Box>
        <Box my={4}>
          <Typography variant="subtitle1">
            Active Investments ({activeInvestments.length})
          </Typography>
          <Paper
            elevation={0}
            sx={{marginTop: '10px'}}
            className={style['rowCard']}
            style={{backgroundColor: `${backgroundColor}`}}
          >
            {activeInvestments.map((investment) => (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4} md={2}>
                  <Typography variant="subtitle2" className={style['subTitle']}>
                    Amount
                    <img
                      src={Info}
                      alt="info"
                      className={style['infoIcon']}
                    />{' '}
                  </Typography>
                  <Typography variant="h6">
                    {currencyFormat.format(investment.amount)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} md={2}>
                  <Typography variant="subtitle2" className={style['subTitle']}>
                    Rewards
                    <img
                      src={Info}
                      alt="info"
                      className={style['infoIcon']}
                    />{' '}
                  </Typography>
                  <Typography variant="h6">
                    {currencyFormat.format(investment.rewards)}{' '}
                    {investment.rewardToken}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} md={2}>
                  <Typography variant="subtitle2" className={style['subTitle']}>
                    Fixed deposit
                    <img
                      src={Info}
                      alt="info"
                      className={style['infoIcon']}
                    />{' '}
                  </Typography>
                  <Typography variant="h6">
                    {investment.term} {investment.termType}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} md={1}>
                  <Typography variant="subtitle2" className={style['subTitle']}>
                    ROI
                    <img
                      src={Info}
                      alt="info"
                      className={style['infoIcon']}
                    />{' '}
                  </Typography>
                  <Typography variant="h6">{investment.roi}%</Typography>
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                  <Typography variant="subtitle2" className={style['subTitle']}>
                    Time remaining
                    <img
                      src={Info}
                      alt="info"
                      className={style['infoIcon']}
                    />{' '}
                  </Typography>
                  {currentBlock ? (
                  <Typography variant="h6">
                    {prettifySeconds(secondsUntilBlock(chainId ?? 250, currentBlock, investment.vestDate))}
                  </Typography>
                    ) : (<></>)}
                </Grid>
                <Grid item xs={12} sm={4} md={2}>
                  <Button
                    variant="contained"
                    disableElevation
                    sx={{padding: '10px 30px'}}
                  >
                    Manage
                  </Button>
                </Grid>
              </Grid>
            ))}
          </Paper>
        </Box>
        <Box>
          <Typography variant="subtitle1">
            Previous Investments ({inactiveInvestments.length})
          </Typography>
          <TableContainer sx={{marginTop: '10px'}}>
            <Table sx={{minWidth: 650}} aria-label="simple table">
              <TableHead>
                <TableRow sx={{backgroundColor: '#000', color: '#FFF'}}>
                  <StyledTableCell className={style['leftEdge']}>
                    Amount{' '}
                    <img src={Info} alt="info" className={style['infoIcon']}/>{' '}
                  </StyledTableCell>
                  <StyledTableCell>
                    Rewards{' '}
                    <img src={Info} alt="info" className={style['infoIcon']}/>{' '}
                  </StyledTableCell>
                  <StyledTableCell>
                    Fixed deposit{' '}
                    <img src={Info} alt="info" className={style['infoIcon']}/>{' '}
                  </StyledTableCell>
                  <StyledTableCell>
                    ROI{' '}
                    <img src={Info} alt="info" className={style['infoIcon']}/>{' '}
                  </StyledTableCell>
                  <StyledTableCell className={style['rightEdge']}>
                    Lock up period{' '}
                    <img src={Info} alt="info" className={style['infoIcon']}/>{' '}
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inactiveInvestments.map((investment) => (
                  <StyledTableRow
                    key={investment.id}
                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                  >
                    <StyledTableCell
                      component="th"
                      scope="row"
                      className={style['leftEdge']}
                    >
                      {currencyFormat.format(investment.amount)}
                    </StyledTableCell>
                    <StyledTableCell>
                      {currencyFormat.format(investment.rewards)}{' '}
                      {investment.rewardToken}
                    </StyledTableCell>
                    <StyledTableCell>
                      {investment.term} {investment.termType}
                    </StyledTableCell>
                    <StyledTableCell>{investment.roi}%</StyledTableCell>
                    <StyledTableCell className={style['rightEdge']}>
                      Completed{' '}
                      {format(
                        new Date(investment.vestDate * 1000),
                        'MM/dd/yyyy'
                      )}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default MyAccount;
