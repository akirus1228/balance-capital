import {
  Box,
  Tabs,
  Tab,
  Typography,
  Skeleton,
  FormControl,
  OutlinedInput,
  InputAdornment,
  Button
} from "@mui/material";
import { a11yProps, formatAmount } from "@fantohm/shared-helpers";
import {
  useWeb3Context,
  calcXfhmDetails,
  xFhmToken,
  NetworkID,
  fhmApprovalForXfhm,
  NetworkIDs,
  txnButtonText,
  isPendingTxn,
  error, changeStakeForXfhm
} from "@fantohm/shared-web3";
import { memo, SyntheticEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../store";
import "./xfhm.module.scss";

export const XfhmPage = (): JSX.Element => {

  const { chainID, address, provider } = useWeb3Context();
  const dispatch = useDispatch();
  const [xfhmView, setXfhmView] = useState<number>(0);
  const [stakeView, setStakeView] = useState<number>(0);
  const [stakeQuantity, setStakeQuantity] = useState<string>("");
  const [unstakeQuantity, setUnStakeQuantity] = useState<string>("");

  const details = useSelector((state: RootState) => {
    return state?.xfhm.details;
  });
  const pendingTransactions = useSelector((state: RootState) => {
    return state?.pendingTransactions;
  });
  console.log("details: ", details);

  const changeXfhmView = (event: SyntheticEvent, newView: number) => {
    setXfhmView(newView);
  };

  const changeStakeView = (event: SyntheticEvent, newView: number) => {
    setStakeView(newView);
  };

  const onChangeStake = async (action: string) => {
    if (!provider || !chainID || !address) {
      return;
    }
    if (action === "stake") {
      // @ts-ignore
      if (isNaN(stakeQuantity) || stakeQuantity === 0 || stakeQuantity === "") {
        dispatch(error("Please enter a value!"));
        return;
      }
      if (Number(stakeQuantity) > formatAmount(details?.fhmBalance, "gwei")) {
        dispatch(error("You cannot stake more than your FHM balance."));
        return;
      }
      await dispatch(changeStakeForXfhm({
        address,
        action,
        value: stakeQuantity.toString(),
        provider,
        networkID: chainID
      }));
    } else {
      // @ts-ignore
      if (isNaN(unstakeQuantity) || unstakeQuantity === 0 || unstakeQuantity === "") {
        dispatch(error("Please enter a value!"));
        return;
      }
      if (Number(unstakeQuantity) > formatAmount(details?.depositAmount, "gwei")) {
        dispatch(error("You cannot unstake more than your FHM balance."));
        return;
      }
      await dispatch(changeStakeForXfhm({
        address,
        action,
        value: unstakeQuantity.toString(),
        provider,
        networkID: chainID
      }));
    }
  };

  const setMax = (stakeView: number) => {
    if (!details) {
      return;
    }
    if (stakeView === 0) {
      setStakeQuantity(formatAmount(details.fhmBalance, "gwei").toString());
    } else {
      setUnStakeQuantity(formatAmount(details.depositAmount, "gwei").toString());
    }
  };

  const onSeekApproval = async () => {
    if (!address || !provider) {
      return;
    }
    await dispatch(fhmApprovalForXfhm({ address, provider, networkID: chainID || NetworkIDs.FantomOpera }));
  };

  useEffect(() => {
    console.log("address changed to  ", address);
    dispatch(calcXfhmDetails({ address, networkID: chainID as NetworkID }));
  }, [address]);

  return (
    <Box mt='50px' className='flexCenterCol'>
      <Tabs
        key='xfhm-tabs'
        centered
        value={ xfhmView }
        textColor='primary'
        indicatorColor='primary'
        className='stake-tab-buttons'
        onChange={ changeXfhmView }
        aria-label='xfhm-tabs'
      >
        <Tab label='xFHM' { ...a11yProps(0) } />
        <Tab label='Add Liquidity' { ...a11yProps(1) } />
      </Tabs>
      <Box className='w-full' maxWidth='400px' bgcolor='#fff' mt='30px' py='30px' px='20px' borderRadius='1.5rem'>
        {
          xfhmView === 0 &&
          <Box className='flexCenterCol'>
            <Box mb='20px'>
              <Typography variant='h4' color='textPrimary' className='font-weight-bold'>xFHM</Typography>
            </Box>
            <Box className='w-full' display='flex' justifyContent='space-between' alignItems='center' mb='20px'>
              <Box>
                { details ? <Typography variant='h4' color='textPrimary'>{
                    formatAmount(details.claimableXfhm, xFhmToken.decimals)
                  }</Typography> :
                  <Skeleton /> }
                <Typography variant='body2' color='textPrimary'>Claimable xFHM</Typography>
              </Box>
              <Button className="thin" color='primary' variant='contained'>
                Claim xFHM
              </Button>
            </Box>
            <Box className='w-full' display='flex' justifyContent='space-between' alignItems='center' mb='5px'>
              <Typography variant='body2' color='textPrimary'>FHM Balance</Typography>
              { details ?
                <Typography variant='body2' color='textPrimary' style={ { fontWeight: "bolder" } }>{
                  formatAmount(details.fhmBalance, "gwei")
                }</Typography> :
                <Skeleton width='100px' /> }
            </Box>
            <Box className='w-full' display='flex' justifyContent='space-between' alignItems='center' mb='5px'>
              <Typography variant='body2' color='textPrimary'>Staked FHM</Typography>
              { details ?
                <Typography variant='body2' color='textPrimary' style={ { fontWeight: "bolder" } }>{
                  formatAmount(details.stakedFhm, "gwei")
                }</Typography> :
                <Skeleton width='100px' /> }
            </Box>
            <Box className='w-full' display='flex' justifyContent='space-between' alignItems='center' mb='5px'>
              <Typography variant='body2' color='textPrimary'>xFHM / hour</Typography>
              { details ?
                <Typography variant='body2' color='textPrimary' style={ { fontWeight: "bolder" } }>{
                  formatAmount(details.xfhmPerHour, xFhmToken.decimals)
                }</Typography> :
                <Skeleton width='100px' /> }
            </Box>
            <Box className='w-full' display='flex' justifyContent='space-between' alignItems='center' mb='5px'>
              <Typography variant='body2' color='textPrimary'>Max xFHM to Earn</Typography>
              { details ?
                <Typography variant='body2' color='textPrimary' style={ { fontWeight: "bolder" } }>{
                  formatAmount(details.maxXfhmToEarn, "gwei")
                }</Typography> :
                <Skeleton width='100px' /> }
            </Box>
            <Box className='w-full' display='flex' justifyContent='space-between' alignItems='center' mb='20px'>
              <Typography variant='body2' color='textPrimary'>Total xFHM Supply</Typography>
              { details ?
                <Typography variant='body2' color='textPrimary' style={ { fontWeight: "bolder" } }>{
                  formatAmount(details.totalXfhmSupply, "gwei")
                }</Typography> :
                <Skeleton width='100px' /> }
            </Box>
            <Box className='w-full' display='flex' justifyContent='space-between' alignItems='center' mb='20px'>
              <Typography variant='h6' color='textPrimary' style={ { fontWeight: "bolder" } }>My Balance</Typography>
              { details ?
                <Typography variant='h6' color='textPrimary' style={ { fontWeight: "bolder" } }>{
                  formatAmount(details.xfhmBalance, "gwei")
                } xFHM</Typography> :
                <Skeleton width='100px' /> }
            </Box>
            {
              details && details.allowance > 0 ? (
                <Box width='100%'>
                  <Tabs
                    key='xfhm-tabs'
                    centered
                    value={ stakeView }
                    textColor='primary'
                    indicatorColor='primary'
                    className='stake-tab-buttons'
                    onChange={ changeStakeView }
                    aria-label='xfhm-tabs'
                  >
                    <Tab label='Stake' { ...a11yProps(0) } />
                    <Tab label='Unstake' { ...a11yProps(1) } />
                  </Tabs>
                  <Box mt='20px'>
                    {
                      stakeView === 0 ? (
                        <>
                          <FormControl className='ohm-input' style={ { width: "100%" } } variant='outlined'
                                       color='primary'>
                            <OutlinedInput
                              id='amount-input'
                              type='number'
                              placeholder={ `Enter an ${ stakeView === 0 ? "stake" : "unstake" } amount` }
                              className='stake-input'
                              value={ stakeQuantity }
                              onChange={ e => setStakeQuantity(e.target.value) }
                              endAdornment={
                                <InputAdornment position='end'>
                                  <Button variant='text' onClick={ () => setMax(stakeView) } color='inherit'>
                                    Max
                                  </Button>
                                </InputAdornment>
                              }
                            />
                          </FormControl>
                          <Box mt='20px'>
                            <Button
                              className='w-full thin'
                              color='primary'
                              variant='contained'
                              disabled={ isPendingTxn(pendingTransactions, "staking") }
                              onClick={ () => {
                                onChangeStake("stake").then();
                              } }
                            >
                              { txnButtonText(pendingTransactions, "staking", "Stake FHM") }
                            </Button>
                          </Box>
                        </>
                      ) : (
                        <>
                          <FormControl className='ohm-input' style={ { width: "100%" } } variant='outlined'
                                       color='primary'>
                            <OutlinedInput
                              id='amount-input'
                              type='number'
                              placeholder={ `Enter an ${ stakeView === 0 ? "stake" : "unstake" } amount` }
                              className='stake-input'
                              color='primary'
                              value={ unstakeQuantity }
                              onChange={ e => setUnStakeQuantity(e.target.value) }
                              endAdornment={
                                <InputAdornment position='end'>
                                  <Button variant='text' onClick={ () => setMax(stakeView) } color='inherit'>
                                    Max
                                  </Button>
                                </InputAdornment>
                              }
                            />
                          </FormControl>
                          <Box mt='20px'>
                            <Button
                              className='w-full thin'
                              variant='contained'
                              disabled={ isPendingTxn(pendingTransactions, "unstaking") }
                              onClick={ () => {
                                onChangeStake("unstake").then();
                              } }
                            >
                              { txnButtonText(pendingTransactions, "unstaking", "Unstake FHM") }
                            </Button>
                          </Box>
                        </>
                      )
                    }
                  </Box>
                </Box>
              ) : (
                <Box display='flex' justifyContent='center'>
                  <Button className='thin' color='primary' variant='contained'
                          disabled={ isPendingTxn(pendingTransactions, "approve_fhm") }
                          onClick={ () => onSeekApproval() }>
                    { txnButtonText(pendingTransactions, "approve_fhm", "Approve") }
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
