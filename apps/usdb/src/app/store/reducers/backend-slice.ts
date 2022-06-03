import { setAll } from "@fantohm/shared-web3";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { loadState } from "../localstorage";
import { RootState } from "..";
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { BlogPostDTO } from "../../../../../nft-market/src/app/types/backend-types";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const contentful = require("contentful");

export const loadBlogPosts = createAsyncThunk("app/loadBlogPosts", async () => {
  const posts: BlogPostDTO[] = [];
  const client = contentful.createClient({
    space: "38g4g4wmfp15",
    accessToken: "hIyu_c-gNoP0E__ihOjls2XzVE4Tu5ZPV1YlNq-vaSc",
  });

  await client.getEntries().then(function (entries: { items: any[] }) {
    entries.items.forEach(function (entry) {
      if (entry) {
        client.getEntry(entry.sys.id).then(function (entry: any) {
          if (entry) {
            posts.push({
              blogTitle: entry.fields.blogTitle,
              blogAsset: entry.fields.blogAsset,
              content: entry.fields.content,
            });
          }
        });
      }
    });
  });
  console.log(posts);

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
