import { configureStore } from "@reduxjs/toolkit";
import { appReducer } from "./reducers/app-slice";
import { themeReducer } from "@fantohm/shared-ui-themes";
import { assetsReducer } from "./reducers/asset-slice";
import { backendReducer } from "./reducers/backend-slice";
import { saveState, walletReducer } from "@fantohm/shared-web3";
import { listingsReducer } from "./reducers/listing-slice";
import { openseaApi } from "../api/opensea";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { backendApi } from "../api/backend-api";
import { loansReducer } from "./reducers/loan-slice";

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
    loans: loansReducer,
    [openseaApi.reducerPath]: openseaApi.reducer,
    [backendApi.reducerPath]: backendApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(openseaApi.middleware)
      .concat(backendApi.middleware),
});

store.subscribe(() => {
  saveState("app", store.getState().app);
  saveState("backend", store.getState().backend);
  saveState("assets", store.getState().assets);
  saveState("wallet", store.getState().wallet);
  saveState("loans", store.getState().loans);
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
