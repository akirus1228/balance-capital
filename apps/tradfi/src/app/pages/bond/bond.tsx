import { Backdrop, Fade, Grid, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';
import './bond.module.scss';

/* eslint-disable-next-line */
export interface BondProps {}

export const Bond = (props: BondProps): JSX.Element => {
  const { bondType } = useParams();
  return (
    <Fade in={true} mountOnEnter unmountOnExit>
      <Grid container id="bond-view">
        <Backdrop open={true}>
          <Fade in={true}>
            <Paper>
              <h1>Hello Bond</h1>
              <p>{bondType}</p>
            </Paper>
          </Fade>
        </Backdrop>
      </Grid>
    </Fade>
  );
}

export default Bond;
