import { setAll } from "@fantohm/shared-web3";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { loadState } from "../localstorage";
import { RootState } from "..";
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { BlogPostDTO } from "../../../../../nft-market/src/app/types/backend-types";

export const loadBlogPosts = createAsyncThunk("app/loadBlogPosts", async () => {
  const posts: BlogPostDTO[] = [];

  return {
    blogPosts: posts,
  } as IBlogData;
});

interface IBlogData {
  readonly blogPosts: BlogPostDTO[];
}

// load cached application state
const appState = loadState();
const initialState: IBlogData = {
  checkedConnection: false,
  loading: true,
  loadingMarketPrice: false,
  theme: "dark",
  ...appState?.backend,
};

const backendSlice = createSlice({
  name: "backend",
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
});

const baseInfo = (state: RootState) => state.backend;

export const backendReducer = backendSlice.reducer;

export const getAppState = createSelector(baseInfo, (backend) => backend);
