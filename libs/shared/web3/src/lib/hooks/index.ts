// export { default as useDebounce } from "./Debounce";

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";

export { useAddress } from "./web3-context";
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
export {useWeb3Context} from "@fantohm/shared-web3"


export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export { default as useBonds } from "./bonds";
