import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { addresses, isDev, loadState, usdbLending } from "@fantohm/shared-web3";
import { BackendLoadingStatus, Loan } from "../../types/backend-types";
import { LoanAsyncThunk } from "./interfaces";
import { RootState } from "..";
import { ethers } from "ethers";

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

const cacheTime = 300 * 1000; // 5 minutes

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
    console.log("contractCreateLoan 3");
    // { "internalType": "address", "name": "borrower", "type": "address" },
    // { "internalType": "address", "name": "nftAddress", "type": "address" },
    // { "internalType": "address", "name": "currency", "type": "address" },
    // { "internalType": "uint256", "name": "nftTokenId", "type": "uint256" },
    // { "internalType": "uint256", "name": "duration", "type": "uint256" },
    // { "internalType": "uint256", "name": "loanAmount", "type": "uint256" },
    // { "internalType": "uint256", "name": "apr", "type": "uint256" },
    // { "internalType": "uint8", "name": "nftTokenType", "type": "uint8" },
    // { "internalType": "bytes", "name": "sig", "type": "bytes" }
    console.log(`loan.borrower.address ${loan.borrower.address}`);
    console.log(
      `loan.assetListing.asset.assetContractAddress ${loan.assetListing.asset.assetContractAddress}`
    );
    console.log(
      `addresses[networkId]["USDB_ADDRESS"] ${addresses[networkId]["USDB_ADDRESS"]}`
    );
    console.log(`loan.assetListing.asset.tokenId ${loan.assetListing.asset.tokenId}`);
    console.log(`loan.term.duration ${loan.term.duration}`);
    console.log(
      `ethers.utils.parseEther(loan.term.amount.toString()) ${ethers.utils.parseEther(
        loan.term.amount.toString()
      )}`
    );
    console.log(`loan.term.apr ${loan.term.apr}`);
    console.log(`loan.term.signature ${loan.term.signature}`);

    const params = {
      borrower: loan.borrower.address,
      nftAddress: loan.assetListing.asset.assetContractAddress,
      currency: addresses[networkId]["USDB_ADDRESS"],
      nftTokenId: loan.assetListing.asset.tokenId,
      duration: loan.term.duration,
      loanAmount: ethers.utils.parseEther(loan.term.amount.toString()),
      apr: loan.term.apr,
      nftTokenType: 0, // token type
      sig: loan.term.signature,
    };
    console.log(params);
    const approveTx = await lendingContract["createLoan"](
      loan.borrower.address,
      loan.assetListing.asset.assetContractAddress,
      addresses[networkId]["USDB_ADDRESS"],
      loan.assetListing.asset.tokenId,
      loan.term.duration,
      ethers.utils.parseEther(loan.term.amount.toString()),
      loan.term.apr,
      0, // token type
      loan.term.signature
    );
    console.log("contractCreateLoan 4");
    await approveTx.wait();
    console.log("contractCreateLoan 5");
    console.log(approveTx);
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
