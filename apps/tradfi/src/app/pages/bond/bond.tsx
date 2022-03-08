import { Backdrop, Fade, Grid } from '@mui/material';
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
          <h1>Hello Bond</h1>
          <p>{bondType}</p>
        </Backdrop>
      </Grid>
    </Fade>
  );
}

export default Bond;
