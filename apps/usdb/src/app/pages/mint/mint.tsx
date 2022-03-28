import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  bondAsset,
  BondType,
  changeApproval,
  error,
  IAllBondData,
  IBondAssetAsyncThunk,
  isPendingTxn,
  trim,
  txnButtonText,
  useBonds,
  useWeb3Context,
  getTokenPrice,
  getBalances,
  changeMint, allBonds, Bond,
} from '@fantohm/shared-web3';
import {Typography, Box, Grid, Button, Paper, OutlinedInput, InputAdornment} from '@mui/material';
import {ReactComponent as DAI} from '../../../assets/tokens/DAI.svg';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import style from './mint.module.scss';
import {RootState} from '../../store';
import { DaiToken, FHMToken } from '@fantohm/shared/images';
import {ReactComponent} from "*.svg";

export default function Mint() {
  const {provider, address, connected, connect, chainId} = useWeb3Context();
  const dispatch = useDispatch();
  const [tabState, setTabState] = React.useState(true);
  const [daiPrice, setDaiPrice] = React.useState(0);
  const [value, setValue] = React.useState('');
  const [fhmPrice, setFhmPrice] = React.useState(0);
  const {bonds} = useBonds(chainId || 250);
  const [bond, setBond] = useState(allBonds.filter(bond => bond.type === BondType.Bond_USDB)[0] as Bond);
  const [usdbBondData, setUsdbBondData] = useState(bonds.filter(bond => bond.type === BondType.Bond_USDB)[0] as IAllBondData);
  const [allowance, setAllowance] = React.useState(false);
  const [quantity, setQuantity] = useState('');
  const [image, setImage] = useState(DaiToken);


  const tokenBalance = useSelector((state: any) => {
    // return trim(Number(state.account.balances.dai), 2);
    return state.account.balances;
  });

  const accountBonds = useSelector((state: RootState) => {
    return state.account.bonds;
  });

  const [usdbBond, setUsdbBond] = useState(accountBonds[usdbBondData?.name]);


  const token = [
    {
      title: 'Mint with DAI',
      name: 'DAI',
      total: tokenBalance.dai,
      price: daiPrice,
    },
    {
      title: 'Mint with FHM',
      name: 'FHM',
      total: tokenBalance.fhm,
      price: fhmPrice,
    },
  ];

  useEffect(() => {
    async function fetchPrice() {
      setDaiPrice(await getTokenPrice('dai'));
      setFhmPrice(await getTokenPrice('fantohm'));
    }

    fetchPrice();
  }, []);

  const pendingTransactions = useSelector((state: RootState) => {
    return state?.pendingTransactions;
  });


  const onSeekApproval = async () => {
    if (provider) {
      dispatch(changeApproval({address, bond: bond, provider, networkId: chainId ?? 250}));
    }
  };

  useEffect(() => {
      setAllowance((bonds.filter(bond => bond.type === BondType.Bond_USDB)[0] as IAllBondData)?.allowance > 0);
  }, [bonds, usdbBondData, usdbBondData?.allowance]);

  const selectedToken = tabState ? token[0] : token[1];

  async function handleClick() {
    if (Number(quantity) === 0) {
      await dispatch(error('Please enter a value!'));
    } else if (isNaN(Number(quantity))) {
      await dispatch(error('Please enter a valid value!'));
    } else if (Number(quantity) > selectedToken.total) {
      await dispatch(error('Please enter a valid value!'));
    } else {
      dispatch(
        bondAsset({
          address,
          slippage: .005,
          value: quantity.toString(),
          provider,
          networkId: chainId,
          bond: bond,
        } as IBondAssetAsyncThunk)
      );
    }
  };

  useEffect(() => {
    setUsdbBondData(bonds.filter(bond => bond.name === "usdbBuy")[0] as IAllBondData);
    setBond(allBonds.filter(bond => bond.name === "usdbBuy")[0] as Bond);
    setUsdbBond(accountBonds["usdbBuy"]);
  }, [usdbBondData?.userBonds])

  function setBondState(bool: boolean) {
    if (bool) {
      setUsdbBondData(bonds.filter(bond => bond.name === "usdbBuy")[0] as IAllBondData);
      setBond(allBonds.filter(bond => bond.name === "usdbBuy")[0] as Bond);
      setUsdbBond(accountBonds["usdbBuy"]);
      setImage(DaiToken)
    } else {
      setUsdbBondData(bonds.filter(bond => bond.name === "usdbFhmBurn")[0] as IAllBondData);
      setBond(allBonds.filter(bond => bond.name === "usdbFhmBurn")[0] as Bond);
      setUsdbBond(accountBonds["usdbFhmBurn"]);
      setImage(FHMToken)
    }
    setTabState(bool)
  }

  const setMax = () => {
    if(selectedToken === token[0]) {
      setQuantity(tokenBalance.dai);
    } else {
      setQuantity(tokenBalance.fhm);
    }
  };



  return (
    <Box className={style['hero']}>
      <div className={style['tabContent']}>
        <Button
          className={style['tapButton']}
          variant="text"
          onClick={() => setBondState(true)}
          style={{borderBottom: `${tabState ? 'solid 4px black' : 'none'}`}}
        >
          Mint with DAI
        </Button>
        <Button
          variant="text"
          className={style['tapButton']}
          onClick={() => setBondState(false)}
          style={{borderBottom: `${tabState ? 'none' : 'solid 4px black'}`}}
        >
          Mint with FHM
        </Button>
      </div>
      <Grid container spacing={8}>
        <Grid item md={6}>
          <div className={style['subCard']}/>
        </Grid>
        <Grid item md={6}>
          <Paper className={style['subCard']}>
            <SettingsOutlinedIcon className={style['settingIcon']}/>
            <div className={style['subTitle']}>{selectedToken.title}</div>
            <Grid container spacing={1}>
              <Grid item md={4} xs={6}>
                <div className={style['roundArea']}>
                  <img src={image} className={style['daiIcon']} style={{marginRight: '10px'}}/>
                  <div style={{textAlign: 'left'}}>
                    <div className={style['tokenName']}>
                      {selectedToken.name}
                    </div>
                    <div className={style['tokenValue']}>
                      {trim(selectedToken.total, 2)}
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item md={8} xs={6}>
                <Box
                  className={style['amountField']}
                >
                  <OutlinedInput
                    id="amount-input-lqdr"
                    type="number"
                    placeholder="Enter an amount"
                    className={`stake-input ${style['styledInput']}`}
                    value={quantity}
                    onChange={(e) => {
                      if (Number(e.target.value) < 0 || e.target.value === '-') return;
                      setQuantity(e.target.value);
                    }}
                    inputProps={{
                      classes: {
                        notchedOutline: {
                          border: 'none',
                        },
                      },
                    }}
                    startAdornment={
                      <InputAdornment position="end" className={style['maxButton']}>
                        <Button
                          className={style['no-padding']}
                          variant="text"
                          onClick={setMax}
                          color="inherit"
                        >
                          Max
                        </Button>
                      </InputAdornment>
                    }
                  />
                </Box>
              </Grid>
            </Grid>
            <div className={style['reward']}>
              <div>You will Get</div>
              <div>{(selectedToken.price * Number(quantity)).toFixed(3)} USDB</div>
            </div>
            <div style={{marginTop: '30px'}}>
              {!connected ? (
                <Button variant="contained" color="primary" id="bond-btn" className="paperButton transaction-button"
                        onClick={connect}>
                  Connect Wallet
                </Button>
              ) : (
                !bond?.isAvailable[chainId ?? 250] ? (
                  <Button variant="contained" color="primary" id="bond-btn" className="paperButton transaction-button"
                          disabled={true}>
                    Sold Out
                  </Button>
                ) : allowance ? (
                  <Button
                    variant="contained"
                    disableElevation
                    onClick={handleClick}
                    className={style['mintButton']}
                  >
                    Mint USDB
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    className="paperButton cardActionButton"
                    disabled={isPendingTxn(pendingTransactions, "approve_" + bond?.name)}
                    onClick={onSeekApproval}>
                    {txnButtonText(pendingTransactions, "approve_" + bond?.name, "Approve")}
                  </Button>))}
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
