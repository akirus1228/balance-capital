import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./slices/account-slice";
import bondingReducer from "./slices/bond-slice";
import pendingTransactionsReducer from "./slices/pending-txns-slice";
import messagesReducer from "./slices/messages-slice";
import globalbondingReducer from "./slices/global-bond-slice";
import investmentsReducer from "./slices/investment-slice";
import tokenPriceReducer from "./slices/token-price-slice";
import appReducer from "./slices/app-slice";
import networkReducer from "./slices/network-slice";
import poolDataReducer from "./slices/pool-thunk";
import lusdDataReducer from "./slices/lusd-slice";
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
