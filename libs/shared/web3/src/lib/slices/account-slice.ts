import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import {chains} from "../providers";
import { abi as usdbAbi } from "../abi/USDBContract.json";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { addresses } from "../constants";
import {IBaseAddressAsyncThunk, ICalcUserBondDetailsAsyncThunk} from "./interfaces";

export function setAll(state: any, properties: any) {
	const props = Object.keys(properties);
	props.forEach(key => {
		state[key] = properties[key];
	});
}

export const getBalances = createAsyncThunk(
  "account/getBalances",
  async ({ address, networkID }: IBaseAddressAsyncThunk) => {
    const provider = await chains[networkID].provider;

    // Contracts
    let usdbBalance = 0;
    let fhmBalance = 0;
    if (networkID === 250 || networkID === 4002) {
      const usdbContract = new ethers.Contract(addresses[networkID]["USDB_ADDRESS"] as string, usdbAbi, provider);
      usdbBalance = await usdbContract["balanceOf"](address);
      const fhmContract = new ethers.Contract(addresses[networkID]["OHM_ADDRESS"] as string, ierc20Abi, provider);
      fhmBalance = await fhmContract["balanceOf"](address);
    }
console.log(usdbBalance)
    console.log(fhmBalance)
    return {
      balances: {
        fhm: ethers.utils.formatUnits(fhmBalance, 18),
        usdb: ethers.utils.formatUnits(usdbBalance, 18),
        dai: 0
      },
    };
  },
);

export const calculateUserBondDetails = createAsyncThunk(
  "account/calculateUserBondDetails",
  async ({ address, bond, networkID }: ICalcUserBondDetailsAsyncThunk) => {
    if (!address) {
      return {
        bond: "",
        displayName: "",
        bondIconSvg: "",
        isLP: false,
        allowance: 0,
        balance: "0",
        interestDue: 0,
        bondMaturationBlock: 0,
        pendingPayout: "",
      };
    }

    const provider = await chains[networkID].provider;

    // Contracts
    const bondContract = await bond.getContractForBond(networkID);
    const reserveContract = await bond.getContractForReserve(networkID);

    let interestDue, bondMaturationBlock;

    const paymentTokenDecimals = 18;

    // Contract Interactions
    const [bondDetails, pendingPayout, allowance, balance] = await Promise.all([
      bondContract["bondInfo"](address),
      bondContract["pendingPayoutFor"](address),
      reserveContract["allowance"](address, bond.getAddressForBond(networkID)),
      reserveContract["balanceOf"](address),
    ]).then(([bondDetails, pendingPayout, allowance, balance]) => [
      bondDetails,
      ethers.utils.formatUnits(pendingPayout, paymentTokenDecimals),
      Number(allowance),
      // balance should NOT be converted to a number. it loses decimal precision
      ethers.utils.formatUnits(balance, bond.isLP ? 18 : bond.decimals),
    ]);

    // eslint-disable-next-line prefer-const
    interestDue = bondDetails.payout / Math.pow(10, paymentTokenDecimals);
    // eslint-disable-next-line prefer-const
    bondMaturationBlock = +bondDetails.vesting + +bondDetails.lastBlock;

    return {
      bond: bond.name,
      displayName: bond.displayName,
      bondIconSvg: bond.bondIconSvg,
      isLP: bond.isLP,
      allowance,
      balance,
      interestDue,
      bondMaturationBlock,
      pendingPayout,
      paymentToken: bond.paymentToken,
      bondAction: bond.bondAction,
    };
  },
);

export interface IUserBondDetails {
  allowance: number;
  interestDue: number;
  bondMaturationBlock: number;
  pendingPayout: string; //Payout formatted in gwei.
}

interface IAccountSlice {
  bonds: { [key: string]: IUserBondDetails };
  balances: {
    fhm: string;
    usdb: string;
    dai: string;
  };
  loading: boolean;
}
const initialState: IAccountSlice = {
  loading: false,
  bonds: {},
  balances: { fhm: "", usdb: "", dai: "" },
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    fetchAccountSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getBalances.pending, state => {
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
      .addCase(calculateUserBondDetails.pending, state => {
        state.loading = true;
      })
      .addCase(calculateUserBondDetails.fulfilled, (state, action) => {
        if (!action.payload) return;
        const bond = action.payload.bond;
        //state.bonds[bond] = action.payload;
        state.loading = false;
      })
      .addCase(calculateUserBondDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
  },
});


export const {fetchAccountSuccess} = accountSlice.actions;

export default accountSlice.reducer;
