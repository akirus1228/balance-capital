import { configureStore } from '@reduxjs/toolkit';
import appSliceReducer from './reducers/app-slice';
import accountReducer from './reducers/account-slice';
import { web3SliceReducer } from '@fantohm/shared-web3';
import bondingReducer from "../../../../../libs/shared/web3/src/lib/slices/bond-slice";
import globalbondingReducer from "../../../../../libs/shared/web3/src/lib/slices/global-bond-slice";
import investmentsReducer from "../../../../../libs/shared/web3/src/lib/slices/investment-slice";
import tokenPriceReducer from "../../../../../libs/shared/web3/src/lib/slices/token-price-slice";
import appReducer from "../../../../../libs/shared/web3/src/lib/slices/app-slice";
import networkReducer from "../../../../../libs/shared/web3/src/lib/slices/network-slice";
import pendingTransactionsReducer from "../../../../../libs/shared/web3/src/lib/slices/pending-txns-slice";
import poolDataReducer from "../../../../../libs/shared/web3/src/lib/slices/pool-thunk";
import lusdDataReducer from "../../../../../libs/shared/web3/src/lib/slices/lusd-slice";
import messagesReducer from "../../../../../libs/shared/web3/src/lib/slices/messages-slice";

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
