import { setAll, IBaseAsyncThunk, enabledMainNetworkIds, enabledNetworkIdsExceptBscAndEth, loadNetworkDetails } from "@fantohm/shared-web3";
import {createSlice, createSelector, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import { loadState } from "../localstorage";
import { RootState } from "..";

const appState = loadState();

const initialState = appState ? appState : {
	loading: false,
	loadingMarketPrice: false,
  theme: 'light'
};

export const loadAppDetails = createAsyncThunk(
	"app/loadAppDetails",
	async ({ networkId }: IBaseAsyncThunk, {dispatch}) => {

		const networkDetailsList = await Promise.all(enabledNetworkIdsExceptBscAndEth.map((enabledNetworkId: any) => dispatch(loadNetworkDetails({ networkId: enabledNetworkId })).unwrap()));
		const localNetworkDetails = networkDetailsList.find((networkDetails: { networkId: any; }) => networkDetails.networkId === networkId);
		if (localNetworkDetails === undefined) {
			throw new Error(`Unable to load local network details. networkId: ${networkId}`);
		}

		const prodNetworkDetailsList = networkDetailsList.filter((networkDetails: { networkId: any; }) => enabledMainNetworkIds.includes(networkDetails.networkId));

		// Global network calculations
		const globalMarketCap = prodNetworkDetailsList.map((networkDetails: { marketCap: any; }) => networkDetails.marketCap).reduce((sum: any, a: any) => sum + a, 0);
		const globalCircSupply = prodNetworkDetailsList.map((networkDetails: { circSupply: any; }) => networkDetails.circSupply).reduce((sum: any, a: any) => sum + a, 0);
		const globalTotalSupply = prodNetworkDetailsList.map((networkDetails: { totalSupply: any; }) => networkDetails.totalSupply).reduce((sum: any, a: any) => sum + a, 0);
		const globalStakingTVL = prodNetworkDetailsList.map((networkDetails: { stakingTVL: any; }) => networkDetails.stakingTVL).reduce((sum: any, a: any) => sum + a, 0);
		const globalStakingRewardFHM = prodNetworkDetailsList.map((networkDetails: { stakingRewardFHM: any; }) => networkDetails.stakingRewardFHM).reduce((sum: any, a: any) => sum + a, 0);
		const globalStakingCircSupply = prodNetworkDetailsList.map((networkDetails: { stakingCircSupply: any; }) => networkDetails.stakingCircSupply).reduce((sum: any, a: any) => sum + a, 0);

		const globalStakingRebase = globalStakingRewardFHM / globalStakingCircSupply;
		const globalFiveDayRate = prodNetworkDetailsList.map((networkDetails: { fiveDayRate: any; }) => networkDetails.fiveDayRate).reduce((sum: number, a: number) => sum + a * (1 / enabledMainNetworkIds.length), 0);
		const globalStakingAPY = prodNetworkDetailsList.map((networkDetails: { stakingAPY: any; }) => networkDetails.stakingAPY).reduce((sum: number, a: number) => sum + a * (1 / enabledMainNetworkIds.length), 0);

		return {
			currentIndex: localNetworkDetails.currentIndex,
			currentBlock: localNetworkDetails.currentBlock,
			fiveDayRate: localNetworkDetails.fiveDayRate,
			stakingAPY: localNetworkDetails.stakingAPY,
			stakingTVL: localNetworkDetails.stakingTVL,
			stakingRebase: localNetworkDetails.stakingRebase,
			marketCap: localNetworkDetails.marketCap,
			marketPrice: localNetworkDetails.marketPrice,
			circSupply: localNetworkDetails.circSupply,
			totalSupply: localNetworkDetails.totalSupply,
			treasuryMarketValue: localNetworkDetails.treasuryMarketValue,
			stakingRewardFHM: localNetworkDetails.stakingRewardFHM,
			stakingCircSupply: localNetworkDetails.stakingCircSupply,
			secondsPerEpoch: localNetworkDetails.secondsPerEpoch,
			globalMarketCap: globalMarketCap,
			globalCircSupply: globalCircSupply,
			globalTotalSupply: globalTotalSupply,
			globalStakingTVL: globalStakingTVL,
			globalFiveDayRate: globalFiveDayRate,
			globalStakingAPY: globalStakingAPY,
			globalStakingRebase: globalStakingRebase,
			globalStakingRewardFHM: globalStakingRewardFHM,
			globalStakingCircSupply: globalStakingCircSupply,
			endBlock: localNetworkDetails.endBlock,
			epochNumber: localNetworkDetails.epochNumber,
		} as IAppData;
	},
);

interface IAppData {
	readonly circSupply: number;
	readonly currentIndex: string;
	readonly currentBlock: number;
	readonly fiveDayRate: number;
	readonly marketCap: number;
	readonly marketPrice: number;
	readonly stakingAPY: number;
	readonly stakingRebase: number;
	readonly stakingTVL: number;
	readonly totalSupply: number;
	readonly treasuryBalance: number;
	readonly treasuryMarketValue: number;
	readonly stakingRewardFHM: number;
	readonly stakingCircSupply: number;
	readonly secondsPerEpoch: number;
	readonly globalMarketCap: number;
	readonly globalCircSupply: number;
	readonly globalTotalSupply: number;
	readonly globalStakingTVL: number;
	readonly globalFiveDayRate: number;
	readonly globalStakingAPY: number;
	readonly globalStakingRebase: number;
	readonly globalStakingRewardFHM: number;
	readonly globalStakingCircSupply: number;
	readonly endBlock: number;
	readonly epochNumber: number;
  readonly theme: string;
}

const appSlice = createSlice({
	name: "app",
	initialState,
	reducers: {
		fetchAppSuccess(state, action) {
			setAll(state, action.payload);
		},
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    }
	},
	extraReducers: builder => {
		builder
			.addCase(loadAppDetails.pending, state => {
				state.loading = true;
			})
			.addCase(loadAppDetails.fulfilled, (state, action) => {
				setAll(state, action.payload);
				state.loading = false;
			})
			.addCase(loadAppDetails.rejected, (state, {error}) => {
				state.loading = false;
				console.error(error.name, error.message, error.stack);
			});
	},
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const baseInfo = (state: RootState) => state.app;

export const appReducer = appSlice.reducer;

export const {fetchAppSuccess, setTheme} = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
