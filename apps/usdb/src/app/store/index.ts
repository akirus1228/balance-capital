import { configureStore } from "@reduxjs/toolkit";
import {
  accountReducer,
  bondingReducer,
  globalbondingReducer,
  investmentsReducer,
  tokenPriceReducer,
  appReducer,
  networkReducer,
  poolDataReducer,
  lusdDataReducer,
  web3SliceReducer,
  xfhmSliceReducer,
  messagesReducer,
  pendingTransactionsReducer
} from "@fantohm/shared-web3";

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
    messages: messagesReducer,
    web3: web3SliceReducer,
    xfhm: xfhmSliceReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
