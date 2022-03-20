import { Box, Grid, Paper, ThemeProvider } from '@mui/material';
import { useCallback } from 'react';
import { useSelector } from "react-redux";
import { USDBLight, USDBDark } from '@fantohm/shared-ui-themes';
import { RootState } from "../../store";
import daiToken from "../../../assets/tokens/DAI.svg";
import style from './dai-card.module.scss';



/* eslint-disable-next-line */
export interface DaiCardProps {
  children: JSX.Element | Array<JSX.Element>;
  className?: string;
  invertTheme?: boolean;
}

export const DaiCard = (props: DaiCardProps): JSX.Element => {
  const themeType = useSelector((state: RootState) => state.app.theme);
  
  const theme = useCallback(() => {
    if(props.invertTheme){
      return themeType === 'light' ? USDBDark : USDBLight;
    } else {
      return themeType === 'light' ? USDBLight : USDBDark;
    }
  }, [themeType, props.invertTheme])

  return (
    <ThemeProvider theme={theme}>
      <Paper sx={{marginTop: '47px'}} className={`${style['cardWrapper']} ${props.className} flexCenterCol`}>
          <Grid container rowSpacing={3}>
              <Grid item xs={12}>
                  <Box className={`flexCenterCol`}>
                      <div className={`${style['iconWrapper']}`}>
                          <img src={daiToken} alt="DAI token" className={style['daiIcon']}/>
                      </div>
                  </Box>
              </Grid>
          </Grid>
          {props.children}
      </Paper>
    </ThemeProvider>
  );
}

export default DaiCard;
