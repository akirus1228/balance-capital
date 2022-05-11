import { configureStore } from "@reduxjs/toolkit";
import { appReducer } from "./reducers/app-slice";
import { saveState } from "./localstorage";
import { themeReducer } from "@fantohm/shared-ui-themes";
import { assetsReducer } from "./reducers/asset-slice";
import { backendReducer } from "./reducers/backend-slice";
import { walletReducer } from "@fantohm/shared-web3";
import { listingsReducer } from "./reducers/listing-slice";

// reducers are named automatically based on the name field in the slice
// exported in slice files by default as nameOfSlice.reducer

const store = configureStore({
  reducer: {
    app: appReducer,
    assets: assetsReducer,
    listings: listingsReducer,
    theme: themeReducer,
    backend: backendReducer,
    wallet: walletReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

store.subscribe(() => {
  saveState("app", store.getState().app);
  saveState("backend", store.getState().backend);
  saveState("assets", store.getState().assets);
  saveState("wallet", store.getState().wallet);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
