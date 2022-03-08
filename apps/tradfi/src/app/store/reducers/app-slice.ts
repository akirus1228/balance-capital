import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";


const initialState = {};

export function setAll(state: any, properties: any) {
	const props = Object.keys(properties);
	props.forEach(key => {
		state[key] = properties[key];
	});
}

const appSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
      fetchAccountSuccess: (state, action) => {
        setAll(state, action.payload);
      }
    },
  });
  

export const {fetchAccountSuccess} = appSlice.actions;

export default appSlice.reducer;