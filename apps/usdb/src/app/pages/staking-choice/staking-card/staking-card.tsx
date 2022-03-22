import { useCallback, useState } from "react";
import { Box, Button, Grid, Icon, Typography } from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import style from "./staking-card.module.scss";
import DaiCard from "../../../components/dai-card/dai-card";
import { DaiToken } from "@fantohm/shared/images";


interface IStakingCardParams {
    bondType: string;
    term: number;
    roi: number;
    apy: number;
}

export const StakingCard = (params: IStakingCardParams): JSX.Element => {
    const [cardState, setCardState] = useState("deposit");
    
    const toggleStakingDirection = useCallback(() => {
        setCardState(cardState === "deposit" ? "redeem" : "deposit");
    }, [cardState])

    return(
        <DaiCard>
            <h3 className={style['titleWrapper']}>Single</h3>
            <h1>DAI Liquidity Pool</h1>
            <Box sx={{width: '100%'}}>
                <hr style={{border: 'none', borderTop:'2px solid rgba(105,108,128,0.07)'}}/>
            </Box>
            <Box className={`flexCenterRow`}>
                <Box className={`${style['smokeyToggle']} ${cardState === "deposit" ? style['active'] : ""}`} sx={{mr: '1em'}} onClick={toggleStakingDirection}>
                    <div className={style['dot']} /> 
                    <span>Deposit</span>
                </Box>
                <Box className={`${style['smokeyToggle']} ${cardState === "redeem" ? style['active'] : ""}`} onClick={toggleStakingDirection}>
                    <div className={style['dot']} /> 
                    <span>Redeem</span>
                </Box>
            </Box>
            <Box className={`flexCenterRow`}>
                <h1>{params.apy}% APR</h1>
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Box className={`flexCenterRow ${style['currencySelector']}`}>
                        <img src={DaiToken} style={{height: '31px', marginRight: "1em"}} alt="DAI Token Symbol"/>
                        <Box sx={{display: "flex", flexDirection: "column", justifyContent:"left"}}>
                            <span className={style['name']}>DAI blanace</span>
                            <span className={style['amount']}>100.00 DAI</span>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box className={`${style['currencySelector']}`} flexGrow={1}>
                        <input type="number" placeholder="0.00"/>
                        <span className={style['amount']}>Max</span>
                    </Box>
                </Grid>
            </Grid>
            <Box className={`flexSBRow w100`} sx={{mt: '1em'}}>
                <span>Your deposit <Icon component={InfoOutlinedIcon}/></span>
                <span>100.00 DAI</span>
            </Box>
            <Box className={`flexSBRow w100`} sx={{mb: '1em'}}>
                <span>Reward amount <Icon component={InfoOutlinedIcon}/></span>
                <span>20.00 FHM</span>
            </Box>
            <Box className={`${style["infoBox"]}`} sx={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                <Icon component={InfoOutlinedIcon} sx={{mr: "0.5em"}}/>
                <span>Deposit DAI into this pool for FHM rewards with no impermanent loss or deposit fees</span>
            </Box>
            <Button variant="contained" color="primary" className="cardActionButton" sx={{mt: "1em"}}>Deposit</Button>
        </DaiCard>
 
    );
}

export default StakingCard;
