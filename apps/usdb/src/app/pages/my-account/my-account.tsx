import {
  Paper,
  Typography, useMediaQuery,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/system';
import style from './my-account.module.scss';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {
  BondType,
  redeemOneBond,
  claimSingleSidedBond,
  useBonds,
  useWeb3Context,
  secondsUntilBlock,
  chains,
  IAllBondData,
  cancelBond,
  IUserBond
} from "@fantohm/shared-web3";
import {useEffect, useMemo, useState} from "react";
import { RootState } from '../../store';
import MyAccountActiveInvestmentsTable from './my-account-active-investments-table';
import MyAccountInactiveInvestmentsTable from './my-account-inactive-investments-table';
import MyAccountDetailsTable from './my-account-details-table';
import Investment from './my-account-investments';
import AccountDetails from './my-account-details';
import MyAccountActiveInvestmentsCards from './my-account-active-investments-cards';

export const currencyFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

const inactiveInvestments: Investment[] = [
  {
    id: '1',
    amount: 29275.51,
    type: BondType.TRADFI,
    rewards: 832.23,
    rewardToken: 'USDB',
    rewardsInUsd: 832.23,
    term: 6,
    termType: 'months',
    roi: "32.5",
    vestDate: 1638507600,
    bondName: 'tradfi3month',
    bondIndex: 0,
    displayName: '6 Months',
    secondsToVest: 1638507600,
    percentVestedFor: 100,
  },
  {
    id: '2',
    type: BondType.TRADFI,
    amount: 29275.51,
    rewards: 1963.75,
    rewardToken: 'USDB',
    rewardsInUsd: 1963.75,
    term: 6,
    termType: 'months',
    roi: "32.5",
    vestDate: 1638507600,
    bondName: 'tradfi3month',
    bondIndex: 1,
    displayName: '6 Months',
    secondsToVest: 1638507600,
    percentVestedFor: 100,
  },
  {
    id: '3',
    type: BondType.TRADFI,
    amount: 29275.51,
    rewards: 1963.75,
    rewardToken: 'USDB',
    rewardsInUsd: 1963.75,
    term: 6,
    termType: 'months',
    roi: "32.5",
    vestDate: 1638507600,
    bondName: 'tradfi3month',
    bondIndex: 2,
    displayName: '6 Months',
    secondsToVest: 1638507600,
    percentVestedFor: 100,
  },
];

export function shorten(str: string) {
  if (str.length < 10) return str;
  return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
}

export const MyAccount = (): JSX.Element => {
  const dispatch = useDispatch();
  const { provider, address, chainId } = useWeb3Context();
  const { bonds } = useBonds(chainId ?? 250);
  const [currentBlock, setCurrentBlock] = useState<number>();

  const isMediumScreen = useMediaQuery("(max-width: 1000px)");

  const hasCheckedConnection = useSelector((state: RootState) => state.app.checkedConnection);
  const accountBonds = useSelector((state: RootState) => {
    return state.account.bonds;
  });

  useEffect(() => {
    (async function () {
      if (chainId) {
        const provider = await chains[chainId].provider;
        setCurrentBlock(await provider.getBlockNumber());
        // console.log('blockNumber: ', await provider.getBlockNumber());
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
          return userBonds.map((userBond: IUserBond, i: number) => {
            // const secondsToVest = secondsUntilBlock(
            //   chainId,
            //   currentBlock,
            //   userBond.bondMaturationBlock
            // );
            const investment: Investment = {
              id: `investment-${bond.name}-${i}`,
              type: bond.type,
              amount: Number(userBond.amount),
              rewards: Number(userBond.rewards),
              rewardToken: userBond.rewardToken,
              rewardsInUsd: Number(userBond.rewardsInUsd),
              bondName: bond.name,
              bondIndex: i,
              displayName: bond.displayName,
              roi: bond.roi+"",
              term: Number(bond.vestingTerm),
              termType: 'months',
              secondsToVest: userBond.secondsToVest,
              percentVestedFor: userBond.percentVestedFor,
              vestDate: Number(userBonds[i].bondMaturationBlock),
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

  const accountDetails: AccountDetails | null = useMemo(() => {
    if (address && activeInvestments) {
      return {
        address,
        balance: activeInvestments.reduce(
          (balance, investment) => balance + investment.amount,
          0
        ),
        rewardsClaimed: 1247.31, // TODO
        claimableRewards: activeInvestments.reduce(
          (rewardsInUsd, investment) => rewardsInUsd + investment.rewardsInUsd,
          0
        )
      };
    } else {
      return null;
    }
  }, [address, JSON.stringify(activeInvestments)]);

  const onCancelBond = async (bond: IAllBondData, index: number) => {
    const shouldProceed = window.confirm(
      "Cancelling a bond incurs a 5% loss. Do you still want to proceed?",
    );
    if (provider && chainId && shouldProceed) {
      await dispatch(cancelBond({ networkId: chainId, address, bond, provider, index }));
    }
  };

  const onRedeemBond = async (bond: IAllBondData, index: number) => {
    if (provider && chainId) {
      await dispatch(redeemOneBond({networkId: chainId, address, bond: bond, provider, autostake: false}));
    }
  };

  const onRedeemAll = async () => {
    if (provider && chainId) {
      for (const bond of bonds) {
        const currentInvests = activeInvestments.filter(investment => investment.bondName === bond.name);
        if (currentInvests.length === 0) continue;

        if (bond.type === BondType.TRADFI) {
          await dispatch(redeemOneBond({ networkId: chainId!, address, bond, provider: provider!, autostake: false }));
        } else if (bond.type === BondType.SINGLE_SIDED) {
          const { amount } = currentInvests[0];
          await dispatch(claimSingleSidedBond({ value: String(amount), networkId: chainId!, address, bond, provider: provider! }));
        }
      }
    }
  };

  if(!address)
    return(<h1 style={{textAlign: 'center'}}>{hasCheckedConnection ? "Connect your wallet to view My Account" : "Loading..."}</h1>);
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
          {accountDetails && <MyAccountDetailsTable accountDetails={accountDetails} onRedeemAll={onRedeemAll} />}
        </Box>
        <Box my={4}>
          <Typography variant="subtitle1">
            Active Investments ({activeInvestments.length})
          </Typography>
          {activeInvestments.length > 0 ? <Box>
            {isMediumScreen && <MyAccountActiveInvestmentsCards investments={activeInvestments} onRedeemBond={onRedeemBond} onCancelBond={onCancelBond} /> ||
            <MyAccountActiveInvestmentsTable investments={activeInvestments} onRedeemBond={onRedeemBond} onCancelBond={onCancelBond} />}
            </Box> : <Box>
              <Paper
                elevation={0}
                sx={{ marginTop: '10px' }}
                className={style['rowCard']}
              >
                <Typography variant="h6">
                  You have no active investments
                </Typography>
              </Paper>
            </Box>
            }
        </Box>
        {/* Hide previous investments until ready on the graph */}
        {/* <Box>
          <Typography variant="subtitle1">
            Previous Investments ({inactiveInvestments.length})
          </Typography>
          <MyAccountInactiveInvestmentsTable investments={inactiveInvestments} />
        </Box> */}
      </Box>
    </Box>
  );
};

export default MyAccount;
