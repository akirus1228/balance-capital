import { configureStore } from "@reduxjs/toolkit";
import { appReducer } from "./reducers/app-slice";
import { saveState } from "./localstorage";
import { themeReducer } from "@fantohm/shared-ui-themes";
import { walletReducer, marketplaceApiReducer } from "@fantohm/shared-web3";

// reducers are named automatically based on the name field in the slice
// exported in slice files by default as nameOfSlice.reducer

const store = configureStore({
  reducer: {
    app: appReducer,
    wallet: walletReducer,
    theme: themeReducer,
    nftMarketplace: marketplaceApiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

store.subscribe(() => {
  saveState(store.getState().app);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
