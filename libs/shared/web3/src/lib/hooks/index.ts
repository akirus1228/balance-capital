// export { default as useDebounce } from "./Debounce";

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";

export { useWeb3Context, useAddress } from "./web3-context";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export { default as useBonds } from "./bonds";
