import { configureStore } from '@reduxjs/toolkit';
import appSliceReducer from './reducers/app-slice';
import {accountReducer} from '@fantohm/shared-web3';
import { web3SliceReducer } from '@fantohm/shared-web3';
import { bondingReducer } from "@fantohm/shared-web3";
import { globalbondingReducer } from "@fantohm/shared-web3";
import {investmentsReducer} from "@fantohm/shared-web3";
import {tokenPriceReducer} from "@fantohm/shared-web3";
import {appReducer} from "@fantohm/shared-web3";
import {networkReducer} from "@fantohm/shared-web3";
import { pendingTransactionsReducer } from "@fantohm/shared-web3";
import {poolDataReducer} from "@fantohm/shared-web3";
import {lusdDataReducer} from "@fantohm/shared-web3";
import { messagesReducer } from "@fantohm/shared-web3";

// reducers are named automatically based on the name field in the slice
// exported in slice files by default as nameOfSlice.reducer

const store = configureStore({
  reducer: {
    //   we'll have state.account, state.bonding, etc, each handled by the corresponding
    // reducer imported from the slice file
    account: accountReducer,
    bonding: bondingReducer,
    globalbonding: globalbondingReducer,
    investments: investmentsReducer,
    tokenPrices: tokenPriceReducer,
    app: appReducer,
    networks: networkReducer,
    pendingTransactions: pendingTransactionsReducer,
    poolData: poolDataReducer,
    lusdData: lusdDataReducer,
    messages: messagesReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
