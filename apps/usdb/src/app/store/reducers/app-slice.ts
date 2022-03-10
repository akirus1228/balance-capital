import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";

interface IAppState {
  bondType: string | null;
}

const initialState: IAppState = {
  bondType: null
};

export function setAll(state: any, properties: any) {
	const props = Object.keys(properties);
	props.forEach(key => {
		state[key] = properties[key];
	});
}

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
      fetchAccountSuccess: (state, action) => {
        setAll(state, action.payload);
      },
      selectBondType: (state, action) => {
        state.bondType = action.payload;
      }
    },
  });
  

export const {fetchAccountSuccess} = appSlice.actions;

export default appSlice.reducer;