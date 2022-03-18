import { Box, Tabs, Tab, Typography, Skeleton, FormControl, OutlinedInput, InputAdornment, Button, InputLabel } from '@mui/material';
import { a11yProps, formatAmount } from '@fantohm/shared-helpers';
import { useWeb3Context, calcXfhmDetails, xFhmToken, NetworkID } from '@fantohm/shared-web3';
import { memo, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../store';
import './xfhm.module.scss';

export const XfhmPage = (): JSX.Element => {

  const { chainID, address } = useWeb3Context();
  const dispatch = useDispatch();
  const [view, setView] = useState<number>(0);
  const [quantity, setQuantity] = useState<string>('');

  const details = useSelector((state: RootState) => state.xfhm.details);
  console.log('details: ', details);

  const changeView = (event: SyntheticEvent, newView: number) => {
    setView(newView);
  };

  const setMax = () => {
    if (details) {
      setQuantity(formatAmount(details.balance, xFhmToken.decimals).toString());
    }
  }

  useEffect(() => {
    if (!address) {
      return;
    }
    dispatch(calcXfhmDetails({ address, networkID: chainID as NetworkID, xfhm: xFhmToken }));
  }, [address]);

  return (
    <Box mt='50px' className='flexCenterCol'>
      <Tabs
        key='xfhm-tabs'
        centered
        value={ view }
        textColor='primary'
        indicatorColor='primary'
        className='stake-tab-buttons'
        onChange={ changeView }
        aria-label='xfhm-tabs'
      >
        <Tab label='xFHM' { ...a11yProps(0) } />
        <Tab label='Add Liquidity' { ...a11yProps(1) } />
      </Tabs>
      <Box width='100%' maxWidth='400px' bgcolor='#fff' mt='30px' py='30px' px='20px' borderRadius='1.5rem'>
        {
          view === 0 &&
          <Box className='flexCenterCol'>
            <Box mb='20px'>
              <Typography variant='h4' color='textPrimary' style={ { fontWeight: 'bold' } }>xFHM</Typography>
            </Box>
            <Box width='100%' display='flex' justifyContent='space-between' alignItems='center' mb='20px'>
              <Box>
                { details ? <Typography variant='h4' color='textPrimary'>{
                    formatAmount(details.claimableXfhm, xFhmToken.decimals)
                  }</Typography> :
                  <Skeleton /> }
                <Typography variant='body2' color='textPrimary'>Claimable xFHM</Typography>
              </Box>
              <Button color='primary' className='fill'>
                Claim xFHM
              </Button>
            </Box>
            <Box width='100%' display='flex' justifyContent='space-between' alignItems='center' mb='5px'>
              <Typography variant='body2' color='textPrimary'>Staked FHM</Typography>
              { details ?
                <Typography variant='body2' color='textPrimary' style={ { fontWeight: 'bolder' } }>{
                  formatAmount(details.stakedFhm, xFhmToken.decimals)
                }</Typography> :
                <Skeleton width="100px" /> }
            </Box>
            <Box width='100%' display='flex' justifyContent='space-between' alignItems='center' mb='5px'>
              <Typography variant='body2' color='textPrimary'>xFHM / hour</Typography>
              { details ?
                <Typography variant='body2' color='textPrimary' style={ { fontWeight: 'bolder' } }>{
                  formatAmount(details.xfhmPerHour, xFhmToken.decimals)
                }</Typography> :
                <Skeleton width="100px" /> }
            </Box>
            <Box width='100%' display='flex' justifyContent='space-between' alignItems='center' mb='5px'>
              <Typography variant='body2' color='textPrimary'>Max xFHM to Earn</Typography>
              { details ?
                <Typography variant='body2' color='textPrimary' style={ { fontWeight: 'bolder' } }>{
                  formatAmount(details.maxXfhmToEarn, xFhmToken.decimals)
                }</Typography> :
                <Skeleton width="100px" /> }
            </Box>
            <Box width='100%' display='flex' justifyContent='space-between' alignItems='center' mb='20px'>
              <Typography variant='body2' color='textPrimary'>Total xFHM Supply</Typography>
              { details ?
                <Typography variant='body2' color='textPrimary' style={ { fontWeight: 'bolder' } }>{
                  formatAmount(details.totalXfhmSupply, xFhmToken.decimals)
                }</Typography> :
                <Skeleton width="100px" /> }
            </Box>
            <Box width='100%' display='flex' justifyContent='space-between' alignItems='center' mb='20px'>
              <Typography variant='h6' color='textPrimary' style={ { fontWeight: 'bolder' } }>My Balance</Typography>
              { details ?
                <Typography variant='h6' color='textPrimary' style={ { fontWeight: 'bolder' } }>{
                  formatAmount(details.balance, xFhmToken.decimals)
                }</Typography> :
                <Skeleton width="100px" /> }
            </Box>
            {
              details && details.allowance > 0 ? (
                <Box width="100%">
                  <FormControl className="ohm-input" variant="outlined" color="primary">
                    <InputLabel htmlFor="amount-input"></InputLabel>
                    <OutlinedInput
                      id="amount-input"
                      type="number"
                      placeholder="Enter an amount"
                      className="stake-input"
                      value={quantity}
                      onChange={e => setQuantity(e.target.value)}
                      endAdornment={
                        <InputAdornment position="end">
                          <Button variant="text" onClick={setMax} color="inherit">
                            Max
                          </Button>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Box>
              ) : (
                <Box display="flex" justifyContent="center">
                  <Button color='primary' className='fill'>
                    Approve
                  </Button>
                </Box>
              )
            }
          </Box>
        }
      </Box>
    </Box>
  );
};

export default memo(XfhmPage);
