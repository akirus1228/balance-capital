import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { addresses, isDev, loadState, usdbLending } from "@fantohm/shared-web3";
import { BackendLoadingStatus, Loan } from "../../types/backend-types";
import { LoanAsyncThunk } from "./interfaces";
import { RootState } from "..";
import { ContractReceipt, ContractTransaction, ethers, Event } from "ethers";

export type CreateLoanEvent = {
  event: string;
  args: {
    borrower: string;
    lender: string;
    loanId: string;
    nftAddress: string;
    nftTokenId: string;
  };
};

export type Loans = {
  [loanId: string]: Loan;
};

export type LoanLoadStatus = {
  [key: string]: BackendLoadingStatus;
};

export interface LoansState {
  readonly loans: Loans;
  readonly isDev: boolean;
  readonly loanCreationStatus: BackendLoadingStatus;
}

/*
createLoan: add loan to contract
params:
- networkId: number
- address: string
- provider: JsonRpcProvider
returns: void
*/
export const contractCreateLoan = createAsyncThunk(
  "loan/contractCreateLoan",
  async (
    { loan, provider, networkId }: LoanAsyncThunk,
    { rejectWithValue, dispatch }
  ) => {
    console.log("loan-slice: contractCreateLoan");
    const signer = provider.getSigner();
    console.log("contractCreateLoan 2");
    const lendingContract = new ethers.Contract(
      addresses[networkId]["USDB_LENDING_ADDRESS"],
      usdbLending,
      signer
    );

    // put the params in an object to make it very clear in contract call
    const params = {
      borrower: loan.borrower.address,
      lender: loan.lender.address,
      nftAddress: loan.assetListing.asset.assetContractAddress,
      currencyAddress: addresses[networkId]["USDB_ADDRESS"],
      nftTokenId: loan.assetListing.asset.tokenId,
      duration: loan.term.duration,
      loanAmount: ethers.utils.parseEther(loan.term.amount.toString()),
      apr: loan.term.apr * 100,
      nftTokenType: 0, // token type
      sig: loan.term.signature,
    };
    console.log(params);
    // call the contract
    const approveTx: ContractTransaction = await lendingContract["createLoan"](
      params.lender,
      params.borrower,
      params.nftAddress,
      params.currencyAddress,
      params.nftTokenId,
      params.duration,
      params.loanAmount,
      params.apr,
      params.nftTokenType,
      params.sig
    );
    console.log(approveTx);
    const response: ContractReceipt = await approveTx.wait();
    console.log(response);
    const event: Event | undefined = response.events?.find(
      (event: CreateLoanEvent | Event) => !!event.event && event.event === "LoanCreated"
    );
    if (event && event.args) {
      const [originator, borrower, nftAddress, nftTokenId, currentId] = event.args;
      // console.log(`originator ${originator}`);
      // console.log(`borrower ${borrower}`);
      // console.log(`nftAddress ${nftAddress}`);
      // console.log(`nftTokenId ${nftTokenId}`);
      // console.log(`currentId ${currentId}`);
      // update loan record with Id
      return +currentId;
    } else {
      return false;
    }
  }
);

// initial wallet slice state
const previousState = loadState("loans");
const initialState: LoansState = {
  loans: [],
  ...previousState, // overwrite assets and currencies from cache if recent
  isDev: isDev(),
  loanCreationStatus: BackendLoadingStatus.idle,
};

// create slice and initialize reducers
const loansSlice = createSlice({
  name: "listings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(contractCreateLoan.pending, (state, action) => {
      state.loanCreationStatus = BackendLoadingStatus.loading;
    });
    builder.addCase(contractCreateLoan.fulfilled, (state, action) => {
      state.loanCreationStatus = BackendLoadingStatus.succeeded;
      // dispatch update loan status
    });
    builder.addCase(contractCreateLoan.rejected, (state, action) => {
      state.loanCreationStatus = BackendLoadingStatus.failed;
    });
  },
});

export const loansReducer = loansSlice.reducer;
// actions are automagically generated and exported by the builder/thunk
//export const { } = listingsSlice.actions;

const baseInfo = (state: RootState) => state.loans;
export const getLoansState = createSelector(baseInfo, (loans) => loans);
