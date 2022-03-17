import { createSlice } from '@reduxjs/toolkit';
import { Terms, BondDetails } from '../types';
import {Bond} from "../types/Bond";

const initialState: { principle: string; useWhitelist: boolean; soldBondsInHour: any[]; totalDebt: number; fhudMinter: string; FHM: string; usersCount: number; whitelist: any[]; FHUD: string; useCircuitBreaker: boolean; DAO: string; terms: Terms; _bondInfo: any; treasury: string; lastDecay: number } = {
  FHM: '', // token given as payment for bond
  FHUD: '', // FHUD
  principle: '', // token used to create bond
  treasury: '', // mints FHM when receives principle
  DAO: '', // receives profit share from bond
  fhudMinter: '', // receives profit share from bond
  terms: {} as Terms, // stores terms for new bonds
  totalDebt: 0, // total value of outstanding bonds; used for pricing
  lastDecay: 0, // reference block for debt decay
  useWhitelist: false,
  useCircuitBreaker: false,
  whitelist: [],
  soldBondsInHour: [],
  _bondInfo: {} as Bond,
  usersCount: 0,
};

type FetchBondSuccessAction = {
  payload: Bond;
  type: string;
};

export const fhudIso2BondDepository = createSlice({
  name: 'fhudIso2BondDepository',
  initialState,
  reducers: {
    fetchBondSuccess(state, action: FetchBondSuccessAction) {
      state = { ...state, ...action.payload };
    },
  },
});

export const { fetchBondSuccess } = fhudIso2BondDepository.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectBondInfo = (state: BondDetails) => state._bondInfo;

export default fhudIso2BondDepository.reducer;
