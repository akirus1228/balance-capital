import { loadState } from "@fantohm/shared-web3";
import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

interface AppData {
  readonly loading: boolean;
  readonly checkedConnection: boolean;
  readonly alerts: AlertMsg[];
}

export type AlertMsg = {
  title?: string;
  message: string;
  duration: number;
  severity?: string;
  open: boolean;
  startSeconds: number;
};

const previousState = loadState("app");
const initialState: AppData = {
  ...previousState,
  loading: true,
  checkedConnection: false,
  alerts: [],
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCheckedConnection: (state, action: PayloadAction<boolean>) => {
      state.checkedConnection = action.payload;
    },
    addAlert: (state, action: PayloadAction<Partial<AlertMsg>>) => {
      const alert = {
        duration: action.payload.duration || 10000,
        message: action.payload.message || "",
        severity: action.payload.severity || "success",
        startSeconds: Date.now(),
        open: true,
      } as AlertMsg;
      state.alerts = [...state.alerts, alert];
    },
    clearAlert: (state, action: PayloadAction<number>) => {
      state.alerts = [
        ...state.alerts.filter(
          (alert: AlertMsg) => alert.startSeconds !== action.payload
        ),
      ];
    },
  },
});

const baseInfo = (state: RootState) => state.app;

export const appReducer = appSlice.reducer;
export const { setLoading, setCheckedConnection, addAlert, clearAlert } =
  appSlice.actions;
export const getAppState = createSelector(baseInfo, (app) => app);
