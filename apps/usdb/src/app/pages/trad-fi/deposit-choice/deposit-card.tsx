import {Box, Button, Grid, Paper, Typography} from "@mui/material";
import css from "./deposit-choice.module.scss";
import DAIIcon from "../../../../assets/tokens/DAI.svg";
import {Link} from 'react-router-dom';
import {ThemeProvider} from "@mui/material/styles";
import {USDBLight} from "@fantohm/shared-ui-themes";

interface IDepositCardParams {
  bondType: string;
  term: number;
  roi: number;
  apy: number;
  days: number;
  bond: any;
}

export const DepositCard = (params: IDepositCardParams): JSX.Element => {

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
                    <Button variant="contained" color="primary" id="bond-btn" className="transaction-button">Deposit</Button>
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
