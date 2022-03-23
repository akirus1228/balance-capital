import { createSlice, PayloadAction  } from "@reduxjs/toolkit"

interface IAppState {
  bondType: string | null;
  theme: 'light' | 'dark';
}

const initialState: IAppState = {
  bondType: null,
  theme: 'light'
};

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
      selectBondType: (state, action) => {
        state.bondType = action.payload;
      },
      setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
        state.theme = action.payload;
      }
    },
  });

export const {selectBondType, setTheme} = appSlice.actions;

export default appSlice.reducer;
