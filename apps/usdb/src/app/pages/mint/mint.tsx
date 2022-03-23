import React from 'react';
import { Typography, Box, Grid, Button, Paper } from '@mui/material';
import { ReactComponent as DAI } from '../../../assets/tokens/DAI.svg';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import style from './mint.module.scss';

const token = [
  {
    title: 'Mint with DAI',
    name: 'DAI',
    total: '10,058.81',
    value: '1800.00',
    owned: '1799',
  },
  {
    title: 'Mint with FHM',
    name: 'FHM',
    total: '58.81',
    value: '18.00',
    owned: '202.41',
  },
];

export default function Mint() {
  const [tabState, setTabState] = React.useState(true);
  const selectedToken = tabState ? token[0] : token[1];

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
              <Grid item md={4}>
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
              <Grid item md={8}>
                <div className={style['roundArea']}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      width: '100%',
                      fontSize: '30px',
                    }}
                  >
                    {selectedToken.value}
                  </div>
                </div>
              </Grid>
            </Grid>
            <div className={style['reward']}>
              <div>You will Get</div>
              <div>{selectedToken.owned} USDB</div>
            </div>
            <div style={{ marginTop: '30px' }}>
              <Button
                variant="contained"
                disableElevation
                onClick={() => {
                  console.log('successfully selected');
                }}
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
