import { createTheme } from '@mui/material/styles';
import { ThemeOptions} from '@mui/material';

// light color pallet for use in themes
const usdbLightColors = {
  color: '#OOO',
  backgroundColor: '#ECECF4',
  paperBg: '#0E0F10',
  gray: '#696C80',
};

// dark color pallet for use in themes
const usdbDarkColors = {
  color: '#FFF',
  backgroundColor: '#000',
  paperBg: '#000',
  gray: '#929BA0',
};

// global theme options that apply to both light and dark
const globalTheme: ThemeOptions = {
  typography: {
    fontFamily: ['Sora', 'sans-serif'].join(','),
  },
  components: {
    MuiToolbar: {
      styleOverrides: {
        root: {
          fontSize: '22px',
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          color: usdbDarkColors.color,
          borderRadius: '53px',
        }
      }
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          background: 'rgba(100, 100, 100, 0.1)',
          backdropFilter: 'blur(33px)',
          '-webkit-backdrop-filter': 'blur(33px)',
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        outlined: {
          borderRadius: '30px',
          padding: '27px',
          fontSize: '20px',
        }
      }
    }
  }
}

// light theme
const USDBLightBase: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: usdbLightColors.color,
      contrastText: usdbLightColors.color,
    },
    secondary: {
      main: usdbLightColors.color,
    },
    background: {
      default: usdbLightColors.backgroundColor,
      paper: usdbLightColors.paperBg,
    },
    text: {
      primary: usdbLightColors.color,
      secondary: usdbLightColors.gray,
    },
  },
  components: {
    MuiToolbar: {
      styleOverrides: {
        root: {
          color: usdbLightColors.color
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        outlined: {
          border: '3px solid #000',
        }
      }
    }
  }
};

// dark theme
const USDBDarkBase: ThemeOptions = {
  ...globalTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: usdbDarkColors.color,
      contrastText: usdbDarkColors.color,
    },
    secondary: {
      main: usdbDarkColors.color,
    },
    background: {
      default: usdbDarkColors.backgroundColor,
      paper: usdbDarkColors.paperBg,
    },
    text: {
      primary: usdbDarkColors.color,
      secondary: usdbDarkColors.gray,
    },
  },
};


export const USDBLight = createTheme(USDBLightBase, globalTheme);
export const USDBDark = createTheme(USDBDarkBase , globalTheme);