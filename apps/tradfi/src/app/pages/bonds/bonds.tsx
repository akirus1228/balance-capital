import { useDispatch, useSelector } from "react-redux";
import css from "./bonds.module.scss";
import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Zoom,
} from "@mui/material";
import { useMediaQuery } from "@mui/material";
import { useWeb3Context } from "@fantohm/web3";
import { useState } from "react";
import { BondCard } from "./bond-card";


const BondsPage = (): JSX.Element => {

    return(
        <Box >
            <Zoom in={true}>
                <Grid container item xs={12} spacing={4} className={css['gridParent']}>
                    <Grid item xs={0} md={2}>
                    &nbsp;
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <BondCard term={3} roi={5} apy={21.55}/>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <BondCard term={6} roi={15} apy={32.55}/>
                    </Grid>
                    <Grid item xs={0} md={2}>
                    &nbsp;
                    </Grid>
                </Grid>
            </Zoom>
        </Box>
    );
}

export default BondsPage;