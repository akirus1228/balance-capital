import { networks } from '@fantohm/shared-web3';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ethers } from 'ethers';

import { chains } from '../providers';
import { IBaseXfhmAsyncThunk } from './interfaces';
import { setAll } from '../helpers';
import { abi as sOHM } from '../abi/sOHM.json';

export interface IXfhmDetails {
  balance: number;
  allowance: number;
  depositAmount: number;
  xfhmPerHour: number;
  stakedFhm: number;
  totalXfhmSupply: number;
  maxXfhmToEarn: number;
  claimableXfhm: number;
}

export const calcXfhmDetails = createAsyncThunk(
  'xfhm/calcDetails',
  async ({ address, networkID, xfhm }: IBaseXfhmAsyncThunk): Promise<IXfhmDetails> => {
    const xfhmAddress = xfhm.networkAddrs[networkID];
    console.log('xfhmAddress: ', xfhmAddress);
    if (!xfhmAddress || !address) {
      return {
        balance: 0,
        allowance: 0,
        depositAmount: 0,
        xfhmPerHour: 0,
        stakedFhm: 0,
        totalXfhmSupply: 0,
        maxXfhmToEarn: 0,
        claimableXfhm: 0
      };
    }
    const provider = await chains[networkID].provider;
    console.log('ohm address', networks[networkID].addresses['OHM_ADDRESS']);
    const fhmContract = new ethers.Contract(networks[networkID].addresses['OHM_ADDRESS'] as string, sOHM, provider);
    const xfhmContract = await xfhm.getContract(networkID);
    console.log('address: ', address);
    const temp1 = await xfhmContract['users'](address);
    console.log('temp1: ', temp1[0]);
    const [balance, allowance, depositAmount, xfhmPerHour, stakedFhm, totalXfhmSupply, maxXfhmToEarn, claimableXfhm] = await Promise.all([
      xfhmContract['balanceOf'](address),
      fhmContract['allowance'](address, xfhmAddress),
      xfhmContract['users'](address),
      xfhmContract['generationRate'](),
      xfhmContract['getStakedFhm'](address),
      xfhmContract['totalSupply'](),
      xfhmContract['maxCap'](),
      xfhmContract['claimable'](address)
    ]).then(([balance, allowance, depositAmount, xfhmPerHour, stakedFhm, totalXfhmSupply, maxXfhmToEarn, claimableXfhm]) => [
      balance,
      allowance,
      depositAmount[0],
      xfhmPerHour * 3600 * depositAmount[0],
      stakedFhm,
      totalXfhmSupply,
      maxXfhmToEarn * depositAmount[0],
      claimableXfhm
    ]);

    return {
      balance,
      allowance,
      depositAmount,
      xfhmPerHour,
      stakedFhm,
      totalXfhmSupply,
      maxXfhmToEarn,
      claimableXfhm
    };

  }
);

const setDetailState = (state: IXfhmSlice, payload: IXfhmDetails) => {
  state.details = { ...state.details, ...payload };
  state.loading = false;
};

interface IXfhmSlice {
  details: IXfhmDetails | null;
  loading: boolean;
}

const initialState: IXfhmSlice = {
  loading: false,
  details: null
};

const xfhmSlice = createSlice({
  name: 'xfhm',
  initialState,
  reducers: {
    fetchXfhmSuccess(state, action) {
      setAll(state, action.payload);
    }
  },
  extraReducers: builder => {
    builder
      .addCase(calcXfhmDetails.pending, state => {
        state.loading = true;
      })
      .addCase(calcXfhmDetails.fulfilled, (state, action) => {
        if (!action.payload) return;
        setDetailState(state, action.payload);
      })
      .addCase(calcXfhmDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
  }
});


export const { fetchXfhmSuccess } = xfhmSlice.actions;

export const xfhmSliceReducer = xfhmSlice.reducer;
