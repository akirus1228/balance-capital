import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { addresses, isDev, loadState, usdbLending } from "@fantohm/shared-web3";
import { BackendLoadingStatus, Loan } from "../../types/backend-types";
import { LoanAsyncThunk, LoanDetailsAsyncThunk, RepayLoanAsyncThunk } from "./interfaces";
import { RootState } from "..";
import { BigNumber, ContractReceipt, ContractTransaction, ethers, Event } from "ethers";

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

export type RepayLoanEvent = {
  event: string;
  args: {
    lender: string;
    borrower: string;
    nftAddress: string;
    nftTokenId: string;
    loanId: BigNumber;
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
  readonly loanReadStatus: BackendLoadingStatus;
  readonly repayLoanStatus: BackendLoadingStatus;
}

export type LoanDetailsResponse = {
  nftAddress: string;
  borrower: string;
  lender: string;
  currency: string;
  status: number;
  nftTokenId: BigNumber;
  starttime: BigNumber;
  endTime: BigNumber;
  loanAmount: BigNumber;
  amountDue: BigNumber;
  nftTokenType: number;
};

export type LoanDetails = {
  nftAddress: string;
  borrower: string;
  lender: string;
  currency: string;
  status: LoanDetailsStatus;
  nftTokenId: number;
  starttime: number;
  endTime: number;
  endDateTime: Date;
  loanAmount: number;
  amountDue: number;
  amountDueGwei: BigNumber;
  nftTokenType: TokenType;
  loanId: number;
};

export enum LoanDetailsStatus {
  CREATED,
  REPAID,
  LIQUIDATED,
}

export enum TokenType {
  ERC721,
  ERC1155,
  Other,
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

/*
repayLoan: add loan to contract
params:
- loanId: number;
- amountDue: number;
- provider: JsonRpcProvider;
- networkId: number;
returns: number | boolean
*/
export const repayLoan = createAsyncThunk(
  "loan/repayLoan",
  async (
    { loanId, amountDue, provider, networkId }: RepayLoanAsyncThunk,
    { rejectWithValue, dispatch }
  ) => {
    console.log("loan-slice: repayLoan");
    const signer = provider.getSigner();
    const lendingContract = new ethers.Contract(
      addresses[networkId]["USDB_LENDING_ADDRESS"],
      usdbLending,
      signer
    );
    const repayTxn: ContractTransaction = await lendingContract["repayLoan"](
      loanId,
      amountDue
    );
    console.log(repayTxn);
    const response: ContractReceipt = await repayTxn.wait();
    console.log(response);
    const event: Event | undefined = response.events?.find(
      (event: RepayLoanEvent | Event) => !!event.event && event.event === "LoanLiquidated"
    );
    if (event && event.args) {
      const [lender, borrower, nftAddress, nftTokenId, loanId] = event.args;
      return +loanId;
    } else {
      return false;
    }
  }
);

/*
getLoanDetailsFromContract: add loan to contract
params:
- loanId: number
- address: string
- provider: JsonRpcProvider
returns: void
*/
export const getLoanDetailsFromContract = createAsyncThunk(
  "loan/getLoanDetailsFromContract",
  async (
    { loanId, networkId, provider }: LoanDetailsAsyncThunk,
    { rejectWithValue, dispatch }
  ) => {
    console.log("getting loan details");
    console.log(`loanId ${loanId}`);
    console.log(`networkId ${networkId}`);
    const lendingContract = new ethers.Contract(
      addresses[networkId]["USDB_LENDING_ADDRESS"],
      usdbLending,
      provider
    );
    console.log("Contract init pass");
    // call the contract
    const loanDetails: LoanDetailsResponse = await lendingContract["loans"](loanId);
    return {
      nftAddress: loanDetails.nftAddress,
      borrower: loanDetails.borrower,
      lender: loanDetails.lender,
      currency: loanDetails.currency,
      status: loanDetails.status,
      nftTokenId: +loanDetails.nftTokenId,
      starttime: +loanDetails.starttime,
      endTime: loanDetails.endTime.toNumber(),
      endDateTime: new Date(+loanDetails.endTime * 1000),
      loanAmount: +ethers.utils.formatEther(loanDetails.loanAmount),
      amountDue: +ethers.utils.formatEther(loanDetails.amountDue),
      amountDueGwei: loanDetails.amountDue,
      nftTokenType: loanDetails.nftTokenType,
      loanId,
    } as LoanDetails;
  }
);

// initial wallet slice state
const previousState = loadState("loans");
const initialState: LoansState = {
  loans: [],
  ...previousState, // overwrite assets and currencies from cache if recent
  isDev: isDev(),
  loanCreationStatus: BackendLoadingStatus.idle,
  loanReadStatus: BackendLoadingStatus.idle,
  repayLoanStatus: BackendLoadingStatus.idle,
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
    builder.addCase(getLoanDetailsFromContract.pending, (state, action) => {
      state.loanReadStatus = BackendLoadingStatus.loading;
    });
    builder.addCase(getLoanDetailsFromContract.fulfilled, (state, action) => {
      state.loanReadStatus = BackendLoadingStatus.succeeded;
      // dispatch update loan status
    });
    builder.addCase(getLoanDetailsFromContract.rejected, (state, action) => {
      state.loanReadStatus = BackendLoadingStatus.failed;
    });
    builder.addCase(repayLoan.pending, (state, action) => {
      state.repayLoanStatus = BackendLoadingStatus.loading;
    });
    builder.addCase(repayLoan.fulfilled, (state, action) => {
      state.repayLoanStatus = BackendLoadingStatus.succeeded;
      // dispatch update loan status
    });
    builder.addCase(repayLoan.rejected, (state, action) => {
      state.repayLoanStatus = BackendLoadingStatus.failed;
    });
  },
});

export const loansReducer = loansSlice.reducer;
// actions are automagically generated and exported by the builder/thunk
//export const { } = listingsSlice.actions;

const baseInfo = (state: RootState) => state.loans;
export const getLoansState = createSelector(baseInfo, (loans) => loans);
