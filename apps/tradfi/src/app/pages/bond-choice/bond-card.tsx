import { Box, Button, Grid } from "@mui/material";
import css from "./bonds.module.scss";

interface IBondCardParams {
    bondType: string;
    term: number;
    roi: number;
    apy: number;
}

export const BondCard = (params: IBondCardParams): JSX.Element => {

    return(
        <Box className={css['bondCard']}>
            <Grid container>
                <Grid item xs={12} sx={{display: 'flex', flexDirection: 'column', justifyContent:'center', alignItems:'center'}}>
                    <h3>FIXED DEPOSIT</h3>
                    <h1>{params.term} MONTHS</h1>
                </Grid>
                <Grid item xs={6}>
                    <Box className={css['lowerStats']}>
                        <span>ROI</span>
                        <span>{params.roi}%</span>
                    </Box>
                </Grid>
                <Grid item xs={6} className={css['lowerStats']}>
                    <Box className={css['lowerStats']}>
                        <span>APY</span>
                        <span>{params.apy}%</span>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{display: 'flex', justifyContent:'center'}}>
                        <Button href={`/bonds/${params.bondType}`}>Deposit</Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}