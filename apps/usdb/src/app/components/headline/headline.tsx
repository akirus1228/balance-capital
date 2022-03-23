import { Box, SxProps, Theme, Typography } from '@mui/material';
import style from './headline.module.scss';

/* eslint-disable-next-line */
export interface HeadlineProps {
  id?: string;
  hero?: boolean;
  title: string;
  subtitle: string | Array<string>;
  sx?: SxProps<Theme>;
}

export const Headline = (props: HeadlineProps): JSX.Element => {
  const subtitle = typeof(props.subtitle) === 'string' ? [props.subtitle] : props.subtitle;

  return (
    <Box className={`${style[props.hero ? 'hero' : 'standard']} flexCenterCol`} sx={{...props.sx}} id={props.id}>
      <Typography variant="h1">{props.title}</Typography>
      {
        subtitle.map((value: string, index: number) => (<Typography key={index} variant="h2" maxWidth="md" sx={{textAlign: 'center'}}>{value}</Typography>))
      }
    </Box>
  );
}

export default Headline;
