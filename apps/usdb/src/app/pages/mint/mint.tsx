import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useWeb3Context,
  getTokenPrice,
} from '@fantohm/shared-web3';
import { noBorderOutlinedInputStyles } from '@fantohm/shared-ui-themes';
import { Box, Grid, Button, Paper, FormControl, OutlinedInput } from "@mui/material";
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

import { ReactComponent as DAI } from '../../../assets/tokens/DAI.svg';
import style from './mint.module.scss';

export default function Mint() {

  const outlinedInputClasses = noBorderOutlinedInputStyles();

  const { provider, address, connected, connect, chainId } = useWeb3Context();
  const dispatch = useDispatch();
  const [tabState, setTabState] = React.useState(true);
  const [daiPrice, setDaiPrice] = React.useState(0);
  const [value, setValue] = React.useState('');
  const [fhmPrice, setFhmPrice] = React.useState(0);
  const tokenBalance = useSelector((state: any) => {
    // return trim(Number(state.account.balances.dai), 2);
    return state.account.balances;
  });
  console.log('tokenBalance: ', tokenBalance);
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
  React.useEffect(() => {
    async function fetchPrice() {
      setDaiPrice(await getTokenPrice('dai'));
      setFhmPrice(await getTokenPrice('fantom'));
    }
    fetchPrice().then();
  }, []);
  const selectedToken = tabState ? token[0] : token[1];
  const handleClick = async () => {
    console.log('clicked');
    const action = 'mint';
    // await dispatch(
    //   changeMint({
    //     address,
    //     action,
    //     value: value.toString(),
    //     provider,
    //     networkId: chainId,
    //   })
    // );
  };
  console.log('token: ', token);
  return (
    <Box className={style['hero']}>
      <div className={style['tabContent']}>
        <Button
          className={style['tapButton']}
          variant="text"
          onClick={() => setTabState(true)}
          style={{ borderBottom: `${tabState ? 'solid 4px black' : 'none'}` }}
        >
          Mint with DAI
        </Button>
        <Button
          variant="text"
          className={style['tapButton']}
          onClick={() => setTabState(false)}
          style={{ borderBottom: `${tabState ? 'none' : 'solid 4px black'}` }}
        >
          Mint with FHM
        </Button>
      </div>
      <Grid container spacing={8}>
        <Grid item md={6}>
          <div className={style['subCard']} />
        </Grid>
        <Grid item md={6}>
          <Paper className={style['subCard']}>
            <SettingsOutlinedIcon className={style['settingIcon']} />
            <div className={style['subTitle']}>{selectedToken.title}</div>
            <Grid container spacing={1}>
              <Grid item md={4} xs={6}>
                <div className={style['roundArea']}>
                  <DAI style={{ marginRight: '10px' }} />
                  <div style={{ textAlign: 'left' }}>
                    <div className={style['tokenName']}>
                      {selectedToken.name}
                    </div>
                    <div className={style['tokenValue']}>
                      {selectedToken.total}
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item md={8} xs={6}>
                <Box className={style['roundArea']}>
                  <FormControl className='w100 ohm-input' variant='outlined'
                               color='primary'>
                    <OutlinedInput
                      id='amount-input'
                      type='number'
                      placeholder='Enter an amount'
                      classes={ outlinedInputClasses }
                      value={ value }
                      onChange={ e => setValue(e.target.value) }
                    />
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
            <div className={style['reward']}>
              <div>You will Get</div>
              <div>{(selectedToken.price * Number(value)).toFixed(3)} USDB</div>
            </div>
            <div style={{ marginTop: '30px' }}>
              <Button
                variant="contained"
                disableElevation
                onClick={handleClick}
                className={style['mintButton']}
              >
                Mint USDB
              </Button>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
