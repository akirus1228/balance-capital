import { configureStore, createSelector } from "@reduxjs/toolkit";
import { web3Reducers } from "@fantohm/shared-web3";
import { appReducer } from "./reducers/app-slice";
import { saveState } from "./localstorage";

// reducers are named automatically based on the name field in the slice
// exported in slice files by default as nameOfSlice.reducer

const store = configureStore({
  reducer: {
    ...web3Reducers,
    app: appReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false })
});

store.subscribe(() => {
  console.log("Updating app state");
  console.log(store.getState().app);
  saveState(store.getState().app);
});

// create slices
const accountInfo = (state: RootState) => state.account;
export const getAccountState = createSelector(accountInfo, account => account);
const bondingInfo = (state: RootState) => state.bonding;
export const getBondingState = createSelector(bondingInfo, bonding => bonding);
const globalbondingInfo = (state: RootState) => state.globalbonding;
export const getGlobalBondingState = createSelector(globalbondingInfo, globalbonding => globalbonding);
const investmentsInfo = (state: RootState) => state.investments;
export const getInvestmentsState = createSelector(investmentsInfo, investments => investments);
const networksInfo = (state: RootState) => state.networks;
export const getNetworksState = createSelector(networksInfo, networks => networks);
const poolInfo = (state: RootState) => state.poolData;
export const getPoolState = createSelector(poolInfo, app => app);
const tokenPricesInfo = (state: RootState) => state.tokenPrices;
export const getTokenPricesState = createSelector(tokenPricesInfo, tokenPrices => tokenPrices);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
