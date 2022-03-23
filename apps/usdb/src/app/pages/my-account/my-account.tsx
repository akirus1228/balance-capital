import {
  Button,
  ButtonGroup,
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
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { tableCellClasses } from '@mui/material/TableCell';
import { Box } from '@mui/system';
import { format } from 'date-fns';
import style from './my-account.module.scss';
import { styled } from '@mui/material/styles';
import Info from '../../../assets/icons/info.svg';
import {
  BondType,
  cancelBond,
  IAllBondData,
  isPendingTxn,
  prettifySeconds,
  redeemAllBonds,
  RootState,
  secondsUntilBlock,
  txnButtonTextGeneralPending,
  useBonds,
  useWeb3Context,
} from '@fantohm/shared-web3';
import { useEffect, useMemo, useState } from 'react';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { chains } from 'libs/shared/web3/src/lib/providers';

export interface Investment {
  id: string;
  type: BondType;
  amount: number;
  rewards: number;
  rewardToken: string;
  bondName: string;
  bondIndex: number;
  displayName: string;
  roi: number;
  secondsToVest: number;
  percentVestedFor: number;
}

export interface AccountDetails {
  address: string;
  balance: number;
  rewardsClaimed: number;
  claimableRewards: number;
}

export const currencyFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

// export interface MyAccountProps {}

const inactiveInvestments: Investment[] = [
  {
    id: '1',
    amount: 29275.51,
    type: BondType.TRADFI,
    rewards: 832.23,
    rewardToken: 'USDB',
    bondName: 'tradfi3month',
    bondIndex: 0,
    displayName: '6 Months',
    roi: 32.5,
    secondsToVest: 1638507600,
    percentVestedFor: 100,
  },
  {
    id: '2',
    type: BondType.TRADFI,
    amount: 29275.51,
    rewards: 1963.75,
    rewardToken: 'USDB',
    bondName: 'tradfi3month',
    bondIndex: 1,
    displayName: '6 Months',
    roi: 32.5,
    secondsToVest: 1638507600,
    percentVestedFor: 100,
  },
  {
    id: '3',
    type: BondType.TRADFI,
    amount: 29275.51,
    rewards: 1963.75,
    rewardToken: 'USDB',
    bondName: 'tradfi3month',
    bondIndex: 2,
    displayName: '6 Months',
    roi: 32.5,
    secondsToVest: 1638507600,
    percentVestedFor: 100,
  },
];

export function shorten(str: string) {
  if (str.length < 10) return str;
  return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
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

const StyledTableRow = styled(TableRow)(({ theme }) => ({
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
  const { provider, address, chainId } = useWeb3Context();
  const { bonds } = useBonds(chainId ?? 250);
  const [currentBlock, setCurrentBlock] = useState<number>();

  const accountBonds = useSelector((state: RootState) => {
    return state.account.bonds;
  });

  useEffect(() => {
    (async function () {
      if (chainId) {
        const provider = await chains[chainId].provider;
        setCurrentBlock(await provider.getBlockNumber());
      }
    })();
  }, [chainId]);

  const activeInvestments = useMemo(() => {
    if (accountBonds && currentBlock && chainId) {
      return bonds.flatMap((bond) => {
        const bondName = bond.name;
        const accountBond = accountBonds[bondName];
        if (accountBond) {
          const userBonds = accountBond.userBonds;
          return userBonds.map((userBond, i) => {
            const secondsToVest = secondsUntilBlock(
              chainId,
              currentBlock,
              userBond.bondMaturationBlock
            );
            const investment: Investment = {
              id: `investment-${bond.name}-${i}`,
              type: bond.type,
              amount: Number(userBond.amount),
              rewards: Number(userBond.rewards),
              rewardToken: userBond.rewardToken,
              bondName: bond.name,
              bondIndex: i,
              displayName: bond.displayName,
              roi: Number(bond.roi),
              secondsToVest,
              percentVestedFor: userBond.percentVestedFor,
            };
            return investment;
          });
        } else {
          return [];
        }
      });
    } else {
      return [];
    }
  }, [JSON.stringify(accountBonds), JSON.stringify(bonds), currentBlock]);

  const accountDetails = useMemo(() => {
    if (address && activeInvestments) {
      return {
        address,
        balance: activeInvestments.reduce(
          (balance, investment) => balance + investment.amount,
          0
        ),
        rewardsClaimed: 1247.31, // TODO
        claimableRewards: 237.11, // TODO
      };
    } else {
      return null;
    }
  }, [address, JSON.stringify(activeInvestments)]);

  const pendingTransactions = useSelector((state: RootState) => {
    return state?.pendingTransactions;
  });

  const pendingClaim = () => {
    if (
      isPendingTxn(pendingTransactions, 'redeem_all_bonds') ||
      isPendingTxn(pendingTransactions, 'redeem_all_bonds_autostake')
    ) {
      return true;
    }

    return false;
  };

  const onRedeemAll = async () => {
    console.log('redeeming all bonds');
    if (provider && chainId) {
      await dispatch(
        redeemAllBonds({
          networkId: chainId,
          address,
          bonds,
          provider,
          autostake: false,
        })
      );
    }

    console.log('redeem all complete');
  };

  const onRedeemOne = async (bond: IAllBondData, index: number) => {
    console.log('redeeming bond');

    // TODO

    console.log('redeem complete');
  };

  const onCancelBond = async (bond: IAllBondData, index: number) => {
    console.log('cancelling bond');
    if (provider && chainId) {
      await dispatch(
        cancelBond({ networkId: chainId, address, bond, provider, index })
      );
    }

    console.log('cancelling bond complete');
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
            <span style={{ color: '#858E93' }}>
              ({accountDetails && shorten(accountDetails.address)})
            </span>
          </Typography>
          <Paper
            elevation={0}
            sx={{ marginTop: '10px' }}
            className={style['rowCard']}
            style={{ backgroundColor: `${backgroundColor}` }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" className={style['subTitle']}>
                  Portfolio value{' '}
                  <img src={Info} alt="info" className={style['infoIcon']} />{' '}
                </Typography>
                <Typography variant="h5">
                  {accountDetails &&
                    currencyFormat.format(accountDetails.balance)}
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
                  {accountDetails &&
                    currencyFormat.format(accountDetails.rewardsClaimed)}
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
                  +
                  {accountDetails &&
                    currencyFormat.format(accountDetails.claimableRewards)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="contained"
                  disableElevation
                  disabled={pendingClaim()}
                  onClick={() => {
                    onRedeemAll();
                  }}
                >
                  {txnButtonTextGeneralPending(
                    pendingTransactions,
                    'redeem_all_bonds',
                    'Claim all'
                  )}
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
            sx={{ marginTop: '10px' }}
            className={style['rowCard']}
            style={{ backgroundColor: `${backgroundColor}` }}
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
                    Investment
                    <img
                      src={Info}
                      alt="info"
                      className={style['infoIcon']}
                    />{' '}
                  </Typography>
                  <Typography variant="h6">{investment.displayName}</Typography>
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
                  <Typography variant="h6">
                    {prettifySeconds(investment.secondsToVest)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} md={2}>
                  <ButtonGroup>
                    {investment.type === BondType.SINGLE_SIDED && (
                      <Link to="/staking#bond">
                        <Button
                          variant="contained"
                          disableElevation
                          sx={{ padding: '10px 30px' }}
                        >
                          Manage
                        </Button>
                      </Link>
                    )}
                    {investment.type === BondType.TRADFI && [
                      <Button
                        variant="contained"
                        disableElevation
                        disabled={investment.percentVestedFor < 100}
                        sx={{ padding: '10px 30px' }}
                        onClick={() => {
                          const bond = bonds.find(
                            (bond) => bond.name === investment.bondName
                          );
                          bond && onRedeemOne(bond as IAllBondData, investment.bondIndex);
                        }}
                      >
                        Redeem
                      </Button>,
                      <Button
                        variant="contained"
                        color="secondary"
                        disableElevation
                        disabled={investment.percentVestedFor >= 100}
                        sx={{ padding: '10px 30px' }}
                        onClick={() => {
                          const bond = bonds.find(
                            (bond) => bond.name === investment.bondName
                          );
                          bond && onCancelBond(bond as IAllBondData, investment.bondIndex);
                        }}
                      >
                        Cancel
                      </Button>,
                    ]}
                  </ButtonGroup>
                </Grid>
              </Grid>
            ))}
          </Paper>
        </Box>
        <Box>
          <Typography variant="subtitle1">
            Previous Investments ({inactiveInvestments.length})
          </Typography>
          <TableContainer sx={{ marginTop: '10px' }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#000', color: '#FFF' }}>
                  <StyledTableCell className={style['leftEdge']}>
                    Amount{' '}
                    <img src={Info} alt="info" className={style['infoIcon']} />{' '}
                  </StyledTableCell>
                  <StyledTableCell>
                    Rewards{' '}
                    <img src={Info} alt="info" className={style['infoIcon']} />{' '}
                  </StyledTableCell>
                  <StyledTableCell>
                    Investment{' '}
                    <img src={Info} alt="info" className={style['infoIcon']} />{' '}
                  </StyledTableCell>
                  <StyledTableCell>
                    ROI{' '}
                    <img src={Info} alt="info" className={style['infoIcon']} />{' '}
                  </StyledTableCell>
                  <StyledTableCell className={style['rightEdge']}>
                    Lock up period{' '}
                    <img src={Info} alt="info" className={style['infoIcon']} />{' '}
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inactiveInvestments.map((investment) => (
                  <StyledTableRow
                    key={investment.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
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
                    <StyledTableCell>{investment.displayName}</StyledTableCell>
                    <StyledTableCell>{investment.roi}%</StyledTableCell>
                    <StyledTableCell className={style['rightEdge']}>
                      Completed {format(new Date(), 'MM/dd/yyyy')}
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
