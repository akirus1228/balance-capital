import { Box, Button, Grid, Paper } from "@mui/material";
import css from "./deposit-choice.module.scss";
import DAIIcon from "../../../../assets/tokens/DAI.svg";
import { Link } from 'react-router-dom';

interface IDepositCardParams {
    bondType: string;
    term: number;
    roi: number;
    apy: number;
}

export const DepositCard = (params: IDepositCardParams): JSX.Element => {

    return(
        <Paper sx={{marginTop: '47px'}}>
            <Grid container rowSpacing={3}>
                <Grid item xs={12}>
                    <Box className={`flexCenterCol`}>
                        <div className={`${css['iconWrapper']}`}>
                            <img src={DAIIcon} alt="DAI token" className={css['daiIcon']}/>
                        </div>
                    </Box>
                </Grid>
                <Grid item xs={12} sx={{display: 'flex', flexDirection: 'column', justifyContent:'center', alignItems:'center', paddingTop: '50px'}}>
                    <Box className={css['titleWrapper']}>
                        <h3>FIXED DEPOSIT</h3>
                    </Box>
                    <h1>{params.term} MONTHS</h1>
                </Grid>
                <Grid item xs={6} className={css['lowerStats']}>
                    <Box className={css['lowerStats']}>
                        <h1>{params.roi}%</h1>
                        <span>ROI</span>
                    </Box>
                </Grid>
                <Grid item xs={6} className={css['lowerStats']}>
                    <Box className={css['lowerStats']}>
                        <h1>{params.apy}%</h1>
                        <span>APY</span>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{display: 'flex', justifyContent:'center'}}>
                        <Link to={`/trad-fi/deposit/${params.bondType}`} style={{color: 'inherit'}}>
                            <Button className="paperButton">Deposit</Button>
                        </Link>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
}

export default DepositCard;