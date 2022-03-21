import { networks, xFhmToken } from "@fantohm/shared-web3";
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ethers } from 'ethers';

import { chains } from '../providers';
import {
  IBaseAddressAsyncThunk,
  IJsonRPCError,
  IXfhmActionValueAsyncThunk, IXfhmChangeApprovalAsyncThunk
} from "./interfaces";
import { setAll } from '../helpers';
import { abi as sOHM } from '../abi/sOHM.json';
import { error} from "./messages-slice";
import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { clearPendingTxn, fetchPendingTxns, getStakingTypeText } from "./pending-txns-slice";
import { segmentUA } from '../helpers/user-analytic-helpers';
import { sleep } from '../helpers/sleep';

interface IUAData {
  address: string;
  value: string;
  approved: boolean;
  txHash: string | null;
  type: string | null;
}

export interface IXfhmDetails {
  fhmBalance: number;
  xfhmBalance: number;
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
  async ({ address, networkID }: IBaseAddressAsyncThunk): Promise<IXfhmDetails> => {
    console.log('address');
    const xfhmAddress = xFhmToken.networkAddrs[networkID];
    console.log('xfhmAddress: ', xfhmAddress);
    if (!xfhmAddress || !address) {
      return {
        fhmBalance: 0,
        xfhmBalance: 0,
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
    const fhmContract = new ethers.Contract(networks[networkID].addresses['OHM_ADDRESS'] as string, sOHM, provider);
    const xfhmContract = await xFhmToken.getContract(networkID);
    const [fhmBalance, xfhmBalance, allowance, depositAmount, xfhmPerHour, stakedFhm, totalXfhmSupply, maxXfhmToEarn, claimableXfhm] = await Promise.all([
      fhmContract['balanceOf'](address),
      xfhmContract['balanceOf'](address),
      fhmContract['allowance'](address, xfhmAddress),
      xfhmContract['users'](address),
      xfhmContract['generationRate'](),
      xfhmContract['getStakedFhm'](address),
      xfhmContract['totalSupply'](),
      xfhmContract['maxCap'](),
      xfhmContract['claimable'](address)
    ]).then(([fhmBalance, xfhmBalance, allowance, depositAmount, xfhmPerHour, stakedFhm, totalXfhmSupply, maxXfhmToEarn, claimableXfhm]) => [
      fhmBalance,
      xfhmBalance,
      allowance,
      depositAmount[0],
      xfhmPerHour * 3600 * depositAmount[0],
      stakedFhm,
      totalXfhmSupply,
      maxXfhmToEarn * depositAmount[0],
      claimableXfhm
    ]);

    return {
      fhmBalance,
      xfhmBalance,
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

export const fhmApprovalForXfhm = createAsyncThunk(
  "xfhm/fhmApprovalForXfhm",
  async ({ provider, address, networkID }: IXfhmChangeApprovalAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const ohmContract = new ethers.Contract(addresses[networkID]['OHM_ADDRESS'] as string, ierc20Abi, signer);
    let approveTx;
    try {
      approveTx = await ohmContract['approve'](
        addresses[networkID]['XFHM_ADDRESS'],
        ethers.utils.parseUnits("1000000000", "gwei").toString(),
      );

      const text = "Approve Staking";
      const pendingTxnType = "approve_staking";
      await dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));
      await approveTx.wait();
    } catch (e: unknown) {
      dispatch(error((e as IJsonRPCError).message));
      return;
    } finally {
      if (approveTx) {
        await dispatch(clearPendingTxn(approveTx.hash));
        await dispatch(calcXfhmDetails({address, networkID}));
      }
    }
  },
);

export const changeStakeForXfhm = createAsyncThunk(
  "xfhm/fhmStakeForXfhm",
  async ({ provider, address, networkID, value, action }: IXfhmActionValueAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const xfhmContract = await xFhmToken.getContractForWrite(networkID, signer);
    let stakeTx;
    let uaData: IUAData = {
      address: address,
      value: value,
      approved: true,
      txHash: null,
      type: null,
    };
    try {
      if (action === "stake") {
        uaData.type = "stake";
        stakeTx = await xfhmContract['deposit'](ethers.utils.parseUnits(value, "gwei"));
      } else {
        uaData.type = "unstake";
        stakeTx = await xfhmContract['withdraw'](ethers.utils.parseUnits(value, "gwei"));
      }
      const pendingTxnType = action === "stake" ? "staking" : "unstaking";
      uaData.txHash = stakeTx.hash;
      await dispatch(fetchPendingTxns({ txnHash: stakeTx.hash, text: getStakingTypeText(action), type: pendingTxnType }));
      await stakeTx.wait();
    } catch (e: unknown) {
      await dispatch(error((e as IJsonRPCError).message));
      return;
    } finally {
      if (stakeTx) {
        segmentUA(uaData);
        await sleep(2);
        dispatch(clearPendingTxn(stakeTx.hash));
        await dispatch(calcXfhmDetails({address, networkID}));
      }
    }
  },
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
export default xfhmSlice.reducer;
