import {
  Button,
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
import style from './my-account.module.scss';
import Info from '../../../assets/icons/info.svg';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {
  BondType,
  cancelBond,
  IAllBondData,
  redeemOneBond,
  useBonds,
  useWeb3Context,
  prettifySeconds,
  secondsUntilBlock,
  trim,
  chains,
} from "@fantohm/shared-web3";
import { useEffect, useState } from 'react';
import Investment from './my-account-investments';

export const currencyFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

export const MyAccountActiveInvestmentsTable = ({ investments }: { investments: Investment[] }): JSX.Element => {
  const themeType = useSelector((state: any) => state.app.theme);
  const backgroundColor = themeType === 'light' ? '#f7f7ff' : '#0E0F10';

  const dispatch = useDispatch();
  const { provider, address, chainId } = useWeb3Context();
  const { bonds } = useBonds(chainId ?? 250);
  const [currentBlock, setCurrentBlock] = useState<number>();

  useEffect(() => {
    (async function () {
      if (chainId) {
        const provider = await chains[chainId].provider;
        setCurrentBlock(await provider.getBlockNumber());
        // console.log('blockNumber: ', await provider.getBlockNumber());
      }
    })();
  }, [chainId]);

  const onCancelBond = async (bond: IAllBondData, index: number) => {
    if (provider && chainId) {
      await dispatch(cancelBond({ networkId: chainId, address, bond, provider, index }));
    }
  };

  const onRedeemOne = async (bond: IAllBondData, index: number) => {
    if (provider && chainId) {
      await dispatch(redeemOneBond({networkId: chainId, address, bond: bond, provider, autostake: false}));
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{ marginTop: '10px' }}
      className={style['rowCard']}
      style={{ backgroundColor: `${backgroundColor}` }}
    >
      <TableContainer>
        <Table aria-label="Active investments">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" className={style['subTitle']}>
                  Amount
                  <img
                    src={Info}
                    alt="info"
                    className={style['infoIcon']}
                  />{' '}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" className={style['subTitle']}>
                  Rewards
                  <img
                    src={Info}
                    alt="info"
                    className={style['infoIcon']}
                  />{' '}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" className={style['subTitle']}>
                  Investment
                  <img
                    src={Info}
                    alt="info"
                    className={style['infoIcon']}
                  />{' '}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" className={style['subTitle']}>
                  APY
                  <img
                    src={Info}
                    alt="info"
                    className={style['infoIcon']}
                  />{' '}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" className={style['subTitle']}>
                  Time remaining
                  <img
                    src={Info}
                    alt="info"
                    className={style['infoIcon']}
                  />{' '}
                </Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {investments.map((investment, index) => (
              <TableRow id={`invests-${index}`}>
                <TableCell>
                  <Typography variant="h6">
                    {currencyFormat.format(investment.amount)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">
                    {trim(investment.rewards, 2)}{' '}{investment.rewardToken}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">
                    {investment.displayName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">
                    {investment.roi}%
                  </Typography>
                </TableCell>
                <TableCell>
                  {currentBlock ? (
                    <Typography variant="h6">
                      {prettifySeconds(secondsUntilBlock(chainId ?? 250, currentBlock, investment.vestDate))}
                    </Typography>
                  ) : (<></>)}
                </TableCell>
                <TableCell>
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
                  {investment.type === BondType.TRADFI && (
                    investment.percentVestedFor >= 100 ? (<Button
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
                    </Button>):
                    (<Button
                      variant="contained"
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
                    </Button>
                    )
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};



export default MyAccountActiveInvestmentsTable;
