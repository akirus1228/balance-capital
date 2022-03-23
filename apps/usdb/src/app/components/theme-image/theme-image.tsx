import { DetailedHTMLProps, ImgHTMLAttributes, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  DarkBankIcon,
  LightBankIcon,
  DarkCardsIcon,
  LightCardsIcon,
  DarkDoughnutChartIcon,
  LightDoughnutChartIcon,
  DarkLockIcon,
  LightLockIcon,
  DarkShieldIcon,
  LightShieldIcon
} from '@fantohm/shared/images';
import { RootState } from '../../store';
import { CSSProperties } from '@mui/styled-engine';

type ThemeImage = {
  alt: string;
  lightIcon: string;
  darkIcon: string;
};

export interface ThemeImages {
  [key: string]: ThemeImage
}

const imgMap: ThemeImages = {
  BankIcon: {
    alt: 'Illustration depicting roman style building to infer a bank. USDB logo on the roof.',
    lightIcon: LightBankIcon,
    darkIcon: DarkBankIcon
  },
  CardsIcon: {
    alt: 'Illustration of Credit Cards Stacked',
    lightIcon: LightCardsIcon,
    darkIcon: DarkCardsIcon
  },
  DoughnutChartIcon: {
    alt: 'Illustration of doughnut chart with 1/4 filled in',
    lightIcon: LightDoughnutChartIcon,
    darkIcon: DarkDoughnutChartIcon
  },
  LockIcon: {
    alt: 'Illustration of padlock with a clock face',
    lightIcon: LightLockIcon,
    darkIcon: DarkLockIcon
  },
  ShieldIcon: {
    alt: 'Illustration of shield with a lock on front and graphs in front.',
    lightIcon: LightShieldIcon,
    darkIcon: DarkShieldIcon
  },
};

interface ThemeImageProps {
    image: 'BankIcon' | 'CardsIcon' | 'DoughnutChartIcon' | 'LockIcon' | 'ShieldIcon';
    invertTheme?: boolean;
    style?: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;
}

export const ThemeImage = (props: ThemeImageProps): JSX.Element => {
    const themeType = useSelector((state: RootState) => state.app.theme);
    const [imgSrc, setImgSrc] = useState('');
  
    useEffect(() => {
      if(props.invertTheme){
        setImgSrc(themeType === 'dark' ? imgMap[props.image].lightIcon : imgMap[props.image].darkIcon);
      } else {
        setImgSrc(themeType === 'light' ? imgMap[props.image].lightIcon : imgMap[props.image].darkIcon);
      }
    }, [themeType, props.invertTheme, props.image]);

    return(
        <img src={imgSrc} alt={imgMap[props.image].alt} style={{...props.style}}/>
    )
}