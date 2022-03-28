import {
  Button,
  ButtonGroup,
  Grid, Icon,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow, Tooltip,
  Typography
} from "@mui/material";
import { HashLink as Link } from 'react-router-hash-link';
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
  defaultNetworkId
} from "@fantohm/shared-web3";
import { useEffect, useState } from 'react';
import Investment from './my-account-investments';
import {
  isPendingTxn,
  txnButtonTextGeneralPending,
} from "@fantohm/shared-web3";
import { RootState } from '../../store';
import { Box } from '@mui/system';
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export const currencyFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

export const MyAccountActiveInvestmentsCards = ({ investments, onRedeemBond, onCancelBond }: { investments: Investment[], onRedeemBond: (bond: IAllBondData, index: number) => void, onCancelBond: (bond: IAllBondData, index: number) => void }): JSX.Element => {
  const themeType = useSelector((state: any) => state.app.theme);
  const backgroundColor = themeType === 'light' ? '#f7f7ff' : '#0E0F10';

  const dispatch = useDispatch();
  const { provider, address, chainId } = useWeb3Context();
  const { bonds } = useBonds(chainId ?? defaultNetworkId);
  const [currentBlock, setCurrentBlock] = useState<number>();

  const pendingTransactions = useSelector((state: RootState) => {
    return state?.pendingTransactions;
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

  return (
    <Box>
      {investments.map((investment, index) => (
        <Paper
        elevation={0}
        sx={{ marginTop: '10px' }}
        className={style['rowCard']}
        style={{ backgroundColor: `${backgroundColor}` }}
        key={`invests-${index}`}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" className={style['subTitle']}>
                Amount
                <Tooltip sx={{marginLeft: "5px"}} arrow title="List of active investments">
                  <Icon component={InfoOutlinedIcon} fontSize="small" />
                </Tooltip>
              </Typography>
              <Typography variant="h6">
                {currencyFormat.format(investment.amount)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" className={style['subTitle']}>
                Rewards
                <Tooltip sx={{marginLeft: "5px"}} arrow title="Projected reward per investment">
                  <Icon component={InfoOutlinedIcon} fontSize="small" />
                </Tooltip>
              </Typography>
              <Typography variant="h6">
                {trim(investment.rewards, 2)}{' '}
                {investment.rewardToken}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" className={style['subTitle']}>
                Investment
                <Tooltip sx={{marginLeft: "5px"}} arrow title="Product invested in">
                  <Icon component={InfoOutlinedIcon} fontSize="small" />
                </Tooltip>
              </Typography>
              <Typography variant="h6">{investment.displayName}</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" className={style['subTitle']}>
                ROI
                <Tooltip sx={{marginLeft: "5px"}} arrow title="Return on investment over vesting period">
                  <Icon component={InfoOutlinedIcon} fontSize="small" />
                </Tooltip>
              </Typography>
              <Typography variant="h6">{investment.roi}%</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" className={style['subTitle']}>
                Time remaining
                <Tooltip sx={{marginLeft: "5px"}} arrow title="Time remaining in vesting period">
                  <Icon component={InfoOutlinedIcon} fontSize="small" />
                </Tooltip>
              </Typography>
              {currentBlock ? (
              <Typography variant="h6">
                {prettifySeconds(investment.secondsToVest)}
              </Typography>
                ) : (<></>)}
            </Grid>
            <Grid item xs={12} sm={4}>
              <ButtonGroup>
                {investment.type === BondType.SINGLE_SIDED && (
                  <Link to={{pathname: "/staking", hash:"#deposit"}}>
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
                      bond && onRedeemBond(bond as IAllBondData, investment.bondIndex);
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
                  </Button>)
                )}
              </ButtonGroup>
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Box>
  );
};



export default MyAccountActiveInvestmentsCards;
