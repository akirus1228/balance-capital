import {
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  OutlinedInput,
  Skeleton,
  SvgIcon,
  Typography
} from "@mui/material";
import { formatAmount } from "@fantohm/shared-helpers";
import { memo } from "react";
import { ethers } from "ethers";
import { parseFixed } from '@ethersproject/bignumber'

import { ReactComponent as ArrowDown } from "../../../assets/icons/arrow-down.svg";
import style from "./xfhm-lqdr.module.scss";

export const AssetSection = (props: any): JSX.Element => {

  const changeAmount = async (e: any) => {
    try {
      if (props?.isMulti) {
        props?.setBTokenAmount(e.target.value);
        const bTokenAmount = ethers.utils.parseUnits(parseFixed(e.target.value || "0", props?.token.decimals).toString(), props?.token.decimals);
        const maxAmount = await props?.calcATokenAmount(bTokenAmount);
        props?.setATokenAmount(formatAmount(maxAmount || 0, props?.pairToken.decimals, 9));
      } else {
        props?.setATokenAmount(e.target.value);
        const aTokenAmount = ethers.utils.parseUnits(parseFixed(e.target.value || "0", props?.token.decimals).toString(), props?.token.decimals);
        const maxAmount = await props?.calcBTokenAmount(aTokenAmount);
        props?.setBTokenAmount(formatAmount(maxAmount || 0, props?.pairToken.decimals, 9));
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Box className="w-full" mt="20px">
      <Box mb="5px">
        <Typography variant="h6" color="textPrimary" className="font-weight-bold">{props?.title}</Typography>
      </Box>
      <Grid container spacing={1}>
        <Grid item xs={4}>
          <Box className={`w-full h-full ${style["line-border"]}`} style={{ padding: "0 10px" }} display="flex"
               alignItems="center" justifyContent="space-between" onClick={() => {
            if (props?.isMulti) {
              props?.openAssetTokenModal();
            }
          }}>
            <Box display="flex" alignItems="center">
              <Box display="flex" alignItems="center">
                <SvgIcon viewBox="0 0 32 32" component={props?.token?.iconSvg} />
              </Box>
              <Box ml="10px" width="55px">
                <Typography variant="body2" color="textPrimary"
                            className="font-weight-bold">{props?.token.name}</Typography>
                {props?.token.balance ? <Typography noWrap  variant="body2" color="textPrimary">{
                    formatAmount(props?.token.balance, props?.token.decimals, 9, true)
                  }</Typography> :
                  <Skeleton width="100%" />}
              </Box>
            </Box>
            {
              props?.isMulti && (
                <Box display="flex" alignItems="center" mt="15px" ml="15px">
                  <SvgIcon viewBox="0 0 32 32" component={ArrowDown} />
                </Box>
              )
            }
          </Box>
        </Grid>
        <Grid item xs={8}>
          <Box className={`w-full h-full ${style["line-border"]}`} display="flex" alignItems="center">
            <FormControl className={`ohm-input ${style["line-border"]}`} style={{ width: "100%" }} variant="outlined"
                         color="primary">
              <OutlinedInput
                id="amount-input-lqdr"
                type="number"
                placeholder="Enter an amount"
                className={`stake-input ${style["no-padding"]}`}
                value={props?.amount}
                onChange={e => changeAmount(e)}
                inputProps={{
                  classes: {
                    notchedOutline: style["no-touched-outline "]
                  }
                }}
                startAdornment={
                  <InputAdornment position="end">
                    <Button className={style["no-padding"]} variant="text"
                            onClick={() => props?.setMax(props?.title)}
                            color="inherit">
                      Max
                    </Button>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default memo(AssetSection);
