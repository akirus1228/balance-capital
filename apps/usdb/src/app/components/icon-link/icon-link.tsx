import { Box, Icon } from '@mui/material';
import { Link } from 'react-router-dom';
import style from './icon-link.module.scss';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

/* eslint-disable-next-line */
export interface IconLinkProps {
  icon: string | typeof import("*.png");
  title: string;
  link?: string;
  linkText?: string;
}

export function IconLink(props: IconLinkProps) {
  return (
    <Box className={style['iconLinkContainer']}>
      <Box className={style['imageBox']} sx={{height: {xs: '114px', md: '190px'}, width: {xs: '114px', md: '190px'}}}>
        <img src={props.icon as string} alt={props.title} className={style['iconImage']}/>
      </Box>
      <h1 className={style['title']}>{props.title}</h1>
      <Link to={props.link ? props.link : '/'}>
        <h2 className={`${style['link']} ${!props.link ? style['disabled'] : ''}`}>
          {props.link ? props.linkText : "Coming Soon"}
          {props.link ? (
            <Icon component={ArrowUpwardIcon} className={style['linkArrow']}/>
          ):''}
        </h2>
      </Link>
    </Box>
  );
}

export default IconLink;
