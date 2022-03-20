import {Box, Button, Grid, Paper, Typography} from "@mui/material";
import css from "./deposit-choice.module.scss";
import DAIIcon from "../../../../assets/tokens/DAI.svg";
import {Link} from 'react-router-dom';
import {ThemeProvider} from "@mui/material/styles";
import {USDBLight} from "@fantohm/shared-ui-themes";
import {useDispatch, useSelector} from "react-redux";
import {useWeb3Context} from "@fantohm/shared-web3";
import {useCallback, useEffect, useState} from "react";
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { error } from "../../../../../../../libs/shared/web3/src/lib/slices/messages-slice";
import {RootState} from "../../../store";
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {bondAsset, changeApproval} from "../../../../../../../libs/shared/web3/src/lib/slices/bond-slice";
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  IApproveBondAsyncThunk,
  IBondAssetAsyncThunk
} from "../../../../../../../libs/shared/web3/src/lib/slices/interfaces";
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {isPendingTxn, txnButtonText} from "../../../../../../../libs/shared/web3/src/lib/slices/pending-txns-slice";
import {JsonRpcSigner} from "@ethersproject/providers";

interface IDepositCardParams {
  bondType: string;
  term: number;
  roi: number;
  apy: number;
  days: number;
  bond: any;
}

export const DepositCard = (params: IDepositCardParams): JSX.Element => {
  const SECONDS_TO_REFRESH = 60;
  const dispatch = useDispatch();
  const {provider, address, chainID} = useWeb3Context();


  let approveTx;

  const [quantity, setQuantity] = useState("");
  const [secondsToRefresh, setSecondsToRefresh] = useState(SECONDS_TO_REFRESH);

  const pendingTransactions = useSelector((state: RootState) => {
    return state?.pendingTransactions;
  });

  const hasAllowance = useCallback(() => {
    console.log(params.bond.allowance)
    return (params.bond.allowance > 0) ?? false;
  }, [params.bond.allowance]);

  // const currentBlock = useSelector((state: RootState) => {
  //   console.log(state)
  //   return state.app.currentBlock;
  // });
  // const isBondLoading = useSelector((state: RootState) => state?.bonding["loading"] ?? true);

  async function useBond() {

    if (quantity === "") {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch(error("Please enter a value!"));
    } else if (isNaN(Number(quantity))) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch(error("Please enter a valid value!"));
    } else if (params.bond.interestDue > 0 || params.bond.pendingPayout > 0) {
      const shouldProceed = window.confirm(
        "You have an existing bond. Bonding will reset your vesting period and forfeit rewards. We recommend claiming rewards first or using a fresh wallet. Do you still want to proceed?",
      );
      const slippage = 0;
      if (shouldProceed) {
        dispatch(
          bondAsset({
            value: quantity,
            slippage,
            bond: params.bond,
            networkId: chainID || 250,
            provider,
            address: address,
          } as IBondAssetAsyncThunk)
        );
      }
    } else {
      const slippage = 0;
      dispatch(
        bondAsset({
          value: quantity,
          slippage,
          bond: params.bond,
          networkId: chainID || 250,
          provider,
          address: address,
        } as IBondAssetAsyncThunk)
      );
      clearInput();
    }
  }

  const onSeekApproval = async () => {
    dispatch(changeApproval({address, provider, bond: params.bond, networkId: chainID} as IApproveBondAsyncThunk));
  };

  const clearInput = () => {
    setQuantity("");
  };


  return (
    <ThemeProvider theme={USDBLight}>
      <Box sx={{height: '100%', width: '100%'}} className={`${css['bondCard']} flexCenterCol`}>
        <Paper sx={{marginTop: '47px', maxWidth: '470px'}} elevation={0}>
          <Grid container rowSpacing={3}>
            <Grid item xs={12}>
              <Box className={`flexCenterCol`}>
                <div className={`${css['iconWrapper']}`}>
                  <img src={DAIIcon} alt="DAI token" className={css['daiIcon']}/>
                </div>
              </Box>
              <Grid container rowSpacing={3}>
                <Grid item xs={12} sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingTop: '50px'
                }}>
                  <Box className={css['titleWrapper']}>
                    <h3>Fixed deposit</h3>
                  </Box>
                  <Typography variant="h1">{params.term} months</Typography>
                  <span style={{color: '#696C80'}}>{params.days} days</span>
                </Grid>
                <Grid item xs={12}>
                  <hr/>
                </Grid>
                <Grid item xs={6}>
                  <Box className={css['lowerStats']}>
                    <Typography variant="h2">{params.roi}%</Typography>
                    <span>ROI</span>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box className={css['lowerStats']}>
                    <Typography variant="h2">{params.apy}%</Typography>
                    <span>APY</span>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Link to={`/trad-fi/deposit/${params.bondType}`} style={{color: 'inherit'}}>
                    {!params.bond.isAvailable[chainID ?? 250] ? (
                      <Button variant="contained" color="primary" id="bond-btn" className="transaction-button"
                              disabled={true}>
                        Sold Out
                      </Button>
                    ) : hasAllowance() ? (
                      <Button
                        variant="contained"
                        color="primary"
                        id="bond-btn"
                        className="transaction-button"
                        disabled={isPendingTxn(pendingTransactions, "bond_" + params.bond.name)}
                        onClick={useBond}
                      >
                        {txnButtonText(pendingTransactions, "bond_" + params.bond.name, params.bond.bondAction)}
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        id="bond-approve-btn"
                        className="transaction-button"
                        disabled={isPendingTxn(pendingTransactions, "approve_" + params.bond.name)}
                        onClick={onSeekApproval}
                      >
                        {txnButtonText(pendingTransactions, "approve_" + params.bond.name, "Approve")}
                      </Button>
                    )}
                  </Link>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default DepositCard;
