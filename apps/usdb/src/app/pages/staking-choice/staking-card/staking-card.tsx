import { useCallback, useState } from "react";
import { Box, Button, Grid, Icon } from "@mui/material";
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
    const [stakingDirection, setStakingDirection] = useState("deposit");
    
    const toggleStakingDirection = useCallback(() => {
        setStakingDirection(stakingDirection === "deposit" ? "redeem" : "deposit");
    }, [stakingDirection])

    return(
        <DaiCard>

            <Box className={style['titleWrapper']}>
                <h3>Single</h3>
            </Box>
            <h1>DAI Liquidity Pool</h1>
            <Box sx={{width: '100%'}}>
                <hr style={{border: 'none', borderTop:'2px solid rgba(105,108,128,0.07)'}}/>
            </Box>
            <Box className={`flexCenterRow`}>
                <Box className={`${style['smokeyToggle']} ${stakingDirection === "deposit" ? style['active'] : ""}`} sx={{mr: '1em'}} onClick={toggleStakingDirection}>
                    <div className={style['dot']} /> 
                    <span>Deposit</span>
                </Box>
                <Box className={`${style['smokeyToggle']} ${stakingDirection === "redeem" ? style['active'] : ""}`} onClick={toggleStakingDirection}>
                    <div className={style['dot']} /> 
                    <span>Redeem</span>
                </Box>
            </Box>
            <Box className={`flexCenterRow`}>
                <h1>{params.apy}% APR</h1>
            </Box>
            <Grid container>
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
                    <Box className={`${style['currencySelector']}`} sx={{display: "flex", flexDirection: "row", justifyContent:"space-between"}} flexGrow={1}>
                        <input type="number" placeholder="0.00"/>
                        <span className={style['amount']}>Max</span>
                    </Box>
                </Grid>
            </Grid>
            <Box className={`flexSBRow w100`}>
                <span>Your deposit <Icon component={InfoOutlinedIcon}/></span>
                <span>100.00 DAI</span>
            </Box>
            <Box className={`flexSBRow w100`}>
                <span>Reward amount <Icon component={InfoOutlinedIcon}/></span>
                <span>20.00 FHM</span>
            </Box>
        </DaiCard>
 
    );
}

export default StakingCard;
