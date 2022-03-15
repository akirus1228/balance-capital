import { JsonRpcProvider } from "@ethersproject/providers";
import { BondDetails } from "../types/bond-structs";
import { NetworkID } from "../networks";

export interface IJsonRPCError {
  readonly message: string;
  readonly code: number;
}

export interface IBaseAsyncThunk {
  readonly networkID: NetworkID;
}

export interface IInteractiveAsyncThunk {
  readonly provider: JsonRpcProvider;
}

export interface IChangeApprovalAsyncThunk extends IBaseAsyncThunk, IInteractiveAsyncThunk {
  readonly token: string;
  readonly address: string;
}

export interface IActionAsyncThunk extends IBaseAsyncThunk, IInteractiveAsyncThunk {
  readonly action: string;
  readonly address: string;
}

export interface IValueAsyncThunk extends IBaseAsyncThunk {
  readonly value: string;
  readonly address: string;
}

export interface IActionValueAsyncThunk extends IValueAsyncThunk, IInteractiveAsyncThunk {
  readonly action: string;
}

export interface IBaseAddressAsyncThunk extends IBaseAsyncThunk {
  readonly address: string;
}

// Account Slice

export interface ICalcUserBondDetailsAsyncThunk extends IBaseAddressAsyncThunk, IBaseBondAsyncThunk {}

// Bond Slice

export interface IBaseBondAsyncThunk extends IBaseAsyncThunk {
  readonly bond: BondDetails;
}

export interface IApproveBondAsyncThunk extends IBaseBondAsyncThunk, IInteractiveAsyncThunk {
  readonly address: string;
}

export interface ICalcBondDetailsAsyncThunk extends IBaseBondAsyncThunk {
  readonly value: string;
}

export interface ICalcGlobalBondDetailsAsyncThunk {
  readonly allBonds: BondDetails[];
}

export interface IBondAssetAsyncThunk extends IBaseBondAsyncThunk, IValueAsyncThunk, IInteractiveAsyncThunk {
  readonly slippage: number;
}

export interface IRedeemBondAsyncThunk extends IBaseBondAsyncThunk, IInteractiveAsyncThunk {
  readonly address: string;
  readonly autostake: boolean;
}

export interface IRedeemAllBondsAsyncThunk extends IBaseAsyncThunk, IInteractiveAsyncThunk {
  readonly bonds: BondDetails[];
  readonly address: string;
  readonly autostake: boolean;
}

export interface IWrapDetails extends IBaseAsyncThunk {
    isWrap: boolean;
    value: string;
}
