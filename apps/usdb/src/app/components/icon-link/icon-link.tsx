import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import style from './icon-link.module.scss';
import { useCallback } from 'react';

/* eslint-disable-next-line */
export interface IconLinkProps {
  icon: string | typeof import('*.png');
  title: string;
  link?: string | undefined;
}

export function IconLink({ icon, title, link = undefined }: IconLinkProps) {
  const navigate = useNavigate();
  const handleOnClick = useCallback(() => {
    if (link) navigate(link);
  }, [navigate, link]);

  return (
    <Box className={style['iconLinkContainer']}>
      <Box
        textAlign="center"
        sx={link ? { cursor: 'pointer' } : {}}
        onClick={handleOnClick}
      >
        <Box
          className={style['imageBox']}
          sx={{
            height: { xs: '114px', md: '150px' },
            width: { xs: '114px', md: '150px' },
          }}
        >
          <img
            src={icon as string}
            alt={title}
            className={style['iconImage']}
          />
        </Box>
        <h1 className={style['title']}>{title}</h1>
        {!link && (
          <h2 className={`${style['link']} ${style['disabled']}`}>
            Coming Soon
          </h2>
        )}
      </Box>
    </Box>
  );
}

export default IconLink;
