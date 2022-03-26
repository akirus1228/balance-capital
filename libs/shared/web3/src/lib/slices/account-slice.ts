import { BigNumber, ethers } from 'ethers';
import { addresses } from '../constants';
import {
  ierc20Abi,
  usdbContractAbi as usdbAbi,
  daiContractAbi as daiAbi,
  sOhmv2Abi as sOHMv2,
  wsOhmAbi as wsOHM,
  olympusStakingv2Abi as OlympusStaking,
  masterChefAbi as masterchefAbi,
} from '../abi';

import { setAll, trim } from '../helpers';

import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import {
  IBaseAddressAsyncThunk,
  ICalcUserBondDetailsAsyncThunk,
} from './interfaces';
import { chains } from '../providers';
import { BondAction, BondType, PaymentToken } from '../lib/bond';

import { findOrLoadMarketPrice } from './bond-slice';

export const getBalances = createAsyncThunk(
  'account/getBalances',
  async ({ address, networkId }: IBaseAddressAsyncThunk) => {
    if(!address || !networkId){
      return {
        balances: {
          dai: 0,
          fhm: 0,
          usdb: 0,
        },
      }
    }
    const provider = await chains[networkId].provider;
    const daiContract = new ethers.Contract(
      addresses[networkId]['DAI_ADDRESS'] as string,
      daiAbi,
      provider
    );
    const fhmContract = new ethers.Contract(
      addresses[networkId]['OHM_ADDRESS'] as string,
      ierc20Abi,
      provider
    );
    // let daiBalance: any;
    // let fhmBalance: any;
    // const getDai = new Promise((resolve, reject) => {
    //   resolve(daiContract['balanceOf'](address));
    // });
    // const getFhm = new Promise((resolve, reject) => {
    //   resolve(daiContract['balanceOf'](address));
    // });
    // await Promise.all([getDai, getFhm])
    //   .then((res) => {
    //     console.log('ressssss: ', res);
    //     daiBalance = res[0];
    //     fhmBalance = res[1];
    //   })
    //   .catch((err) => console.log(err));
    const daiBalance = await daiContract['balanceOf'](address);
    const fhmBalance = await fhmContract['balanceOf'](address);

    let usdbBalance = 0;
    if (addresses[networkId]['USDB_ADDRESS']) {
      const usdbContract = new ethers.Contract(
        addresses[networkId]['USDB_ADDRESS'] as string,
        usdbAbi,
        provider
      );
      usdbBalance = await usdbContract['balanceOf'](address);
    }
    console.log('tokenBalances: ', daiBalance, fhmBalance, usdbBalance);
    return {
      balances: {
        dai: ethers.utils.formatUnits(daiBalance, 18),
        fhm: ethers.utils.formatUnits(fhmBalance, 18),
        usdb: ethers.utils.formatUnits(usdbBalance, 18),
      },
    };
  }
);

interface IUserAccountDetails {
  balances: {
    dai: string;
    ohm: string;
    sohm: string;
    wsohm: string;
    usdb: string;
  };
  staking: {
    ohmStake: number;
    ohmUnstake: number;
  };
  warmup: {
    depositAmount: number;
    warmUpAmount: number;
    expiryBlock: number;
  };
  bonding: {
    daiAllowance: number;
  };
  bridging: {
    // for incoming (in FHM.m)
    bridgeDownstreamAllowance: number;
    // for outgoing (in FHM)
    bridgeUpstreamAllowance: number;
  };
}

export const loadAccountDetails = createAsyncThunk(
  'account/loadAccountDetails',
  async ({ networkId, address }: IBaseAddressAsyncThunk, { dispatch }) => {
    const provider = await chains[networkId].provider;

    async function loadBridgeAccountDetails() {
      let bridgeTokenBalance = 0;
      let bridgeUpstreamAllowance = 0;
      let bridgeDownstreamAllowance = 0;
      if (
        addresses[networkId]['BRIDGE_TOKEN_ADDRESS'] &&
        addresses[networkId]['BRIDGE_ADDRESS']
      ) {
        const ohmContract = new ethers.Contract(
          addresses[networkId]['OHM_ADDRESS'] as string,
          ierc20Abi,
          provider
        );
        const bridgeContract = new ethers.Contract(
          addresses[networkId]['BRIDGE_TOKEN_ADDRESS'] as string,
          ierc20Abi,
          provider
        );
        [
          bridgeTokenBalance,
          bridgeUpstreamAllowance,
          bridgeDownstreamAllowance,
        ] = await Promise.all([
          bridgeContract['balanceOf'](address),
          ohmContract['allowance'](
            address,
            addresses[networkId]['BRIDGE_ADDRESS']
          ),
          bridgeContract['allowance'](
            address,
            addresses[networkId]['BRIDGE_ADDRESS']
          ),
        ]);
      }

      return {
        bridgeTokenBalance,
        bridgeUpstreamAllowance,
        bridgeDownstreamAllowance,
      };
    }

    // Contracts
    const ohmContract = new ethers.Contract(
      addresses[networkId]['OHM_ADDRESS'] as string,
      ierc20Abi,
      provider
    );
    const sohmContract = new ethers.Contract(
      addresses[networkId]['SOHM_ADDRESS'] as string,
      sOHMv2,
      provider
    );
    const wsohmContract = new ethers.Contract(
      addresses[networkId]['WSOHM_ADDRESS'] as string,
      wsOHM,
      provider
    );
    const stakingContract = new ethers.Contract(
      addresses[networkId]['STAKING_ADDRESS'] as string,
      OlympusStaking,
      provider
    );
    const daiContract = new ethers.Contract(
      addresses[networkId]['DAI_ADDRESS'] as string,
      daiAbi,
      provider
    );
    // Contract Interactions
    // const [
    //   ohmBalance,
    //   stakeAllowance,
    //   sohmBalance,
    //   unstakeAllowance,
    //   poolAllowance,
    //   wsohmBalance,
    //   sohmWrappingAllowance,
    //   wsohmUnwrappingAllowance,
    //   daiBalance,
    //   warmupInfo,
    // ] = await Promise.all([
    //   ohmContract['balanceOf'](address),
    //   ohmContract['allowance'](
    //     address,
    //     addresses[networkId]['STAKING_HELPER_ADDRESS']
    //   ),
    //   sohmContract['balanceOf'](address),
    //   sohmContract['allowance'](
    //     address,
    //     addresses[networkId]['STAKING_ADDRESS']
    //   ),
    //   sohmContract['allowance'](
    //     address,
    //     addresses[networkId]['PT_PRIZE_POOL_ADDRESS']
    //   ),
    //   wsohmContract['balanceOf'](address),
    //   sohmContract['allowance'](address, addresses[networkId]['WSOHM_ADDRESS']),
    //   wsohmContract['allowance'](
    //     address,
    //     addresses[networkId]['WSOHM_ADDRESS']
    //   ),
    //   daiContract['balanceOf'](address),
    //   stakingContract['warmupInfo'](address),
    // ]);
    const daiBalance = await daiContract['balanceOf'](address);
    // const fhmBalance = await ohmContract['balanceOf'](address);
    let usdbBalance = 0;
    if (networkId === 250) {
      const usdbContract = new ethers.Contract(
        addresses[networkId]['USDB_ADDRESS'] as string,
        usdbAbi,
        provider
      );
      usdbBalance = await usdbContract['balanceOf'](address);
    }
    // const balance = await sohmContract['balanceForGons'](warmupInfo.gons);
    // const depositAmount = warmupInfo.deposit;
    // const warmUpAmount = +ethers.utils.formatUnits(balance, 'gwei');
    // const expiry = warmupInfo.expiry;

    // if (addresses[networkId].PT_TOKEN_ADDRESS) {
    //   const poolTokenContract = await new ethers.Contract(addresses[networkId].PT_TOKEN_ADDRESS, ierc20Abi, provider);
    //   poolBalance = await poolTokenContract["balanceOf"](address);
    // }

    // for (const fuseAddressKey of ["FUSE_6_SOHM", "FUSE_18_SOHM"]) {
    //   if (addresses[networkId][fuseAddressKey]) {
    //     const fsohmContract = await new ethers.Contract(
    //       addresses[networkId][fuseAddressKey] as string,
    //       fuseProxy,
    //       provider,
    //     );
    //     fsohmContract.signer;
    //     const exchangeRate = ethers.utils.formatEther(await fsohmContract.exchangeRateStored());
    //     const balance = ethers.utils.formatUnits(await fsohmContract["balanceOf"](address), "gwei");
    //     fsohmBalance += Number(balance) * Number(exchangeRate);
    //   }
    // }

    return {
      balances: {
        dai: ethers.utils.formatUnits(daiBalance, 18),
        fhm: ethers.utils.formatUnits(0, 18),
        usdb: ethers.utils.formatUnits(usdbBalance, 18),
      },
      // staking: {
      //   ohmStake: +stakeAllowance,
      //   ohmUnstake: +unstakeAllowance,
      // },
      // warmup: {
      //   depositAmount: +ethers.utils.formatUnits(depositAmount, 'gwei'),
      //   warmUpAmount,
      //   expiryBlock: expiry,
      // },
      // bonding: {
      //   daiAllowance: 0,
      // },
    };
  }
);

export interface IUserBond {
  interestDue: number;
  amount: string;
  rewards: string;
  rewardToken: PaymentToken;
  rewardsInUsd: string;
  bondMaturationBlock: number;
  maturationSeconds: number;
  secondsToVest: number;
  pendingPayout: string; //Payout formatted in gwei.
  percentVestedFor: number;
  lpTokenAmount: string;
  iLBalance: string;
  pendingFHM: string;
  pricePaid: number;
}

export interface IUserBondDetails {
  allowance: number;
  userBonds: IUserBond[];
  readonly paymentToken: PaymentToken;
  readonly bondAction: BondAction;
}

export const calculateUserBondDetails = createAsyncThunk(
  'account/calculateUserBondDetails',
  async (
    { address, bond, networkId }: ICalcUserBondDetailsAsyncThunk,
    { dispatch }
  ) => {
    if (!address) {
      return {
        bond: '',
        displayName: '',
        bondIconSvg: '',
        isLP: false,
        allowance: 0,
        balance: '0',
        userBonds: [
          {
            amount: '0',
            rewards: '0',
            rewardToken: PaymentToken.USDB,
            rewardsInUsd: '0',
            interestDue: 0,
            bondMaturationBlock: 0,
            maturationSeconds: 0,
            secondsToVest: 0,
            pendingPayout: '',
            percentVestedFor: 0,
            lpTokenAmount: '0',
            iLBalance: '0',
            pendingFHM: '0',
            pricePaid: 0,
          },
        ],
        paymentToken: bond.paymentToken,
        bondAction: bond.bondAction,
      };
    }
    const provider = await chains[networkId].provider;

    // Contracts
    const bondContract = await bond.getContractForBond(networkId);
    const reserveContract = await bond.getContractForReserve(networkId);

    const orgPaymentTokenDecimals = 18;
    const paymentTokenDecimals =
      bond.paymentToken === PaymentToken.USDB ? 18 : 9;

    const [allowance, balance] = await Promise.all([
      reserveContract['allowance'](address, bond.getAddressForBond(networkId)),
      reserveContract['balanceOf'](address),
    ]).then(([allowance, balance]) => [
      allowance,
      // balance should NOT be converted to a number. it loses decimal precision
      ethers.utils.formatUnits(balance, bond.isLP ? 18 : bond.decimals),
    ]);

    if (bond.type === BondType.TRADFI) {
      const bondLength = Number(await bondContract['bondlength'](address));
      const userBonds: IUserBond[] = await Promise.all(
        [...Array(bondLength).keys()].map(async (bondIndex) => {
          const [bondDetails, pendingPayout, percentVestedFor] =
            await Promise.all([
              bondContract['bondInfo'](address, bondIndex),
              bondContract['pendingPayoutFor'](address, bondIndex),
              bondContract['percentVestedFor'](address, bondIndex),
            ]).then(([bondDetails, pendingPayout, percentVestedFor]) => [
              bondDetails,
              ethers.utils.formatUnits(pendingPayout, paymentTokenDecimals),
              Number(percentVestedFor.div(BigNumber.from('100'))),
            ]);
          console.log(`bondDetails ${bondDetails}`);
          console.log(`pendingPayout ${pendingPayout}`);
          console.log(`percentVestedFor ${percentVestedFor}`);
          const interestDue =
            bondDetails.payout / Math.pow(10, paymentTokenDecimals);
          const bondMaturationBlock =
            +bondDetails.vesting + +bondDetails.lastBlock;
          const pricePaid =
            bondDetails.pricePaid / Math.pow(10, paymentTokenDecimals);
          const payout = ethers.utils.formatUnits(
            bondDetails.payout,
            paymentTokenDecimals
          );
          const rewards = trim(interestDue * (1 - pricePaid), 2);
          const amount = trim(Number(payout) * pricePaid, 2);
          
          const latestBlockNumber = await provider.getBlockNumber();
          
          // TODO: Move this function to a helper or other.
          // sometimes getBlock fails
          const getLatestBlock = async ():Promise<ethers.providers.Block> => {
            let block = undefined;
              block = await provider.getBlock(latestBlockNumber);
              if(block){
                return block;
              }else{
                //console.log("~~~~~RETRYING GETLATESTBLOCK~~~~~");
                await new Promise(r => setTimeout(r, 500));
                return getLatestBlock();
              }
          }
          const latestBlock = await getLatestBlock();

          // console.log(bondDetails);
          // console.log(latestBlock);
          const latestBlockTimestamp = latestBlock.timestamp;
          const maturationSeconds = Number(bondDetails['vestingSeconds']) + Number(bondDetails['lastTimestamp']);
          const secondsToVest = maturationSeconds - latestBlockTimestamp;
          // console.log(`maturationSeconds ${maturationSeconds}`);
          // console.log(`vestingSeconds ${secondsToVest}`);

          return {
            amount,
            rewards,
            rewardToken: PaymentToken.USDB,
            rewardsInUsd: rewards,
            interestDue,
            bondMaturationBlock,
            maturationSeconds,
            secondsToVest,
            pendingPayout,
            percentVestedFor,
            lpTokenAmount: '0',
            iLBalance: '0',
            pendingFHM: '0',
            pricePaid: pricePaid,
          };
        })
      );

      return {
        bond: bond.name,
        displayName: bond.displayName,
        bondIconSvg: bond.bondIconSvg,
        isLP: bond.isLP,
        allowance,
        balance,
        userBonds,
        paymentToken: bond.paymentToken,
        bondAction: bond.bondAction,
      };
    }

    // Contract Interactions
    const [bondDetails, pendingPayout, fhmMarketPrice] = await Promise.all([
      bondContract['bondInfo'](address),
      bondContract['pendingPayoutFor'](address),
      dispatch(findOrLoadMarketPrice({ networkId: networkId })).unwrap(),
    ]).then(([bondDetails, pendingPayout, fhmMarketPrice]) => [
      bondDetails,
      ethers.utils.formatUnits(pendingPayout, paymentTokenDecimals),
      fhmMarketPrice?.marketPrice || 0,
    ]);
    // console.log(`bondDetails ${bondDetails}`);
    // console.log(`pendingPayout ${pendingPayout}`);
    // console.log(`fhmMarketPrice ${fhmMarketPrice}`);
    const interestDue =
      bondDetails.payout / Math.pow(10, orgPaymentTokenDecimals);
    console.log(`interestDue ${interestDue}`);
    const bondMaturationBlock = +bondDetails.vesting + +bondDetails.lastBlock;
    console.log(`bondMaturationBlock ${bondMaturationBlock}`);
    let pendingFHM = '0';
    let iLBalance = '0';
    let lpTokenAmount = 0;
    if (bond.type === BondType.SINGLE_SIDED) {
      const masterchefContract = new ethers.Contract(
        addresses[networkId]['MASTERCHEF_ADDRESS'],
        masterchefAbi,
        provider
      );
      const fhmRewards = await masterchefContract['pendingFhm'](0, address);

      pendingFHM = trim(
        Number(ethers.utils.formatUnits(String(fhmRewards), 9)),
        2
      );
      iLBalance = trim(
        Number(
          ethers.utils.formatUnits(
            Number(bondDetails.ilProtectionAmountInUsd),
            9
          )
        ),
        2
      );
      lpTokenAmount = Number(
        ethers.utils.formatUnits(
          bondDetails.lpTokenAmount,
          orgPaymentTokenDecimals
        )
      );
    }
    const payout = Number(
      ethers.utils.formatUnits(bondDetails.payout, orgPaymentTokenDecimals)
    );
    const pricePaid = Number(
      ethers.utils.formatUnits(bondDetails.pricePaid, orgPaymentTokenDecimals)
    );
    const amount = payout * pricePaid;
    const rewardsInUsd = Number(pendingFHM) * fhmMarketPrice;
    const userBonds =
      amount > 0
        ? [
            {
              amount: trim(amount, 2), // TODO can we just assume lp is totally balanced?
              rewards: pendingFHM,
              rewardToken: PaymentToken.FHM,
              rewardsInUsd: trim(rewardsInUsd, 2),
              interestDue,
              bondMaturationBlock,
              pendingPayout,
              secondsToVest: 999999999999, // TODO, how do we calculate this seconds until vested
              maturationSeconds: 999999999999999, //TODO,  how do we calculate seconds until maturation
              percentVestedFor: 0, // No such thing as percentVestedFor for single sided
              lpTokenAmount: trim(lpTokenAmount, 2),
              iLBalance: iLBalance,
              pendingFHM,
              pricePaid: 1,
            },
          ]
        : [];
    return {
      bond: bond.name,
      displayName: bond.displayName,
      bondIconSvg: bond.bondIconSvg,
      isLP: bond.isLP,
      allowance,
      balance,
      userBonds,
      paymentToken: bond.paymentToken,
      bondAction: bond.bondAction,
    };
  }
);

interface IAccountSlice {
  bonds: { [key: string]: IUserBondDetails };
  balances: {
    usdb: string;
    dai: string;
    fhm: string;
  };
  loading: boolean;
}

const initialState: IAccountSlice = {
  loading: false,
  bonds: {},
  balances: { usdb: '', dai: '', fhm: '' },
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    fetchAccountSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAccountDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadAccountDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAccountDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(getBalances.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBalances.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getBalances.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(calculateUserBondDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(calculateUserBondDetails.fulfilled, (state, action) => {  //PayloadAction<IBondDetails>
        if (!action.payload) return;
        const bond = action.payload.bond;
        state.bonds[bond] = action.payload;
        state.loading = false;
      })
      .addCase(calculateUserBondDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
  },
});

export const accountReducer = accountSlice.reducer;
export const { fetchAccountSuccess } = accountSlice.actions;
