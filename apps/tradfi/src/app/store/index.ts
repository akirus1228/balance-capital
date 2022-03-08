import { configureStore } from "@reduxjs/toolkit";
import appSliceReducer from "./reducers/app-slice";
import accountReducer from "./reducers/account-slice";
import { web3SliceReducer } from "@fantohm/web3";

// reducers are named automatically based on the name field in the slice
// exported in slice files by default as nameOfSlice.reducer

const store = configureStore({
  reducer: {
    accountReducer,
    appSliceReducer,
    web3SliceReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
