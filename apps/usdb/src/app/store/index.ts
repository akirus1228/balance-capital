import { configureStore } from '@reduxjs/toolkit';
import appSliceReducer from './reducers/app-slice';
import accountReducer from './reducers/account-slice';
import { web3SliceReducer, xfhmSliceReducer, messagesSliceReducer, pendingTxnsSliceReducer} from '@fantohm/shared-web3';

// reducers are named automatically based on the name field in the slice
// exported in slice files by default as nameOfSlice.reducer

export const store = configureStore({
  reducer: {
    account: accountReducer,
    app: appSliceReducer,
    web3: web3SliceReducer,
    xfhm: xfhmSliceReducer,
    pendingTransactions: pendingTxnsSliceReducer,
    messages: messagesSliceReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
