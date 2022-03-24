import { createTheme } from '@mui/material/styles';
import { ThemeOptions } from '@mui/material';
import lightBG from './images/USDB_gradient_light.png';
import darkBG from './images/USDB_gradient_dark.png';
import { shadows } from '@mui/system';

// light color pallet for use in themes
const usdbLightColors = {
  color: '#000',
  invertedColor: '#FFF',
  backgroundColor: '#ECECF4',
  paperBg: '#FFF',
  gray: '#696C80',
  iconButtonBg: '#181A1C0F',
};

// dark color pallet for use in themes
const usdbDarkColors = {
  color: '#FFF',
  invertedColor: '#000',
  backgroundColor: '#000',
  paperBg: '#0E0F10',
  gray: '#929BA0',
  iconButtonBg: '#181A1CD4',
};

// global theme options that apply to both light and dark
const globalTheme: ThemeOptions = {
  typography: {
    fontFamily: ['Sora', 'Roboto', 'sans-serif'].join(','),
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          fontSize: '22px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "53px",
          padding: "2.5em",
          "&.MuiAppBar-root": {
            padding: "0",
            marginTop: "2em"
          },
          "&.dai": {
            border: "1px solid #F3AC28",
            borderRadius: "2em",
            background: "transparent",
            width: "100%",
            maxWidth: "525px",
          },
          "&.softGradient": {
            borderRadius: "2em",
          },
          "&.MuiMenu-paper":{
            borderRadius: "10px",
            padding: "0.5em",
          }
        }
      },
      defaultProps: {
        elevation: 0
      }
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          // background: 'rgba(100, 100, 100, 0.1)',
          // backdropFilter: 'blur(33px)',
          // '-webkit-backdrop-filter': 'blur(33px)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "30px",
          padding: "27px",
          fontSize: "20px",
          textTransform: "unset",
          "&.paperButton": {
            width: "100%",
            padding: "1em",
          },
          '&.menuButton': {
            height: '1em',
            paddingTop: '1.8em',
            paddingBottom: '1.8em',
            borderRadius: '1.5em',
            margin: 'auto 1em',
          },
          '&.cardActionButton': {
            width: "100%"
          },
          "&.thin": {
            padding: "15px 27px"
          },
          "&.portfolio": {
            height: '1em',
            paddingTop: '1.8em',
            paddingBottom: '1.8em',
            background: "#384bff",
            color: "#FFF",
          },
          "&.fill": {
            fontSize: '14px',
            backgroundColor: '#000',
            borderRadius: '1.5em',
            color: "#FFF",
            padding: "15px 27px"
          },
          "&.border": {
            fontSize: '14px',
            backgroundColor: '#FFF',
            borderRadius: '1.5em',
            color: "#000",
            padding: "15px 27px",
            border: "solid 1px #000"
          },
          "&.inputButton": {
            height: "3em",
            borderRadius: "2em",
            width: "245px",
          }
        },
        outlined: {
          borderRadius: '30px',
          padding: '27px',
          fontSize: '20px',
        },
        contained: {
          '&.closeButton': {
            borderRadius: '50%',
            p: '0.5em',
            boxSizing: 'border-box',
            minWidth: '16px'
          }
        }
      },
      defaultProps: {
        autoCapitalize: 'none',
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "unset",
        }
      }
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundPosition: 'top',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
        },
      },
    },
  },
};

// light theme
const USDBLightBase: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: usdbLightColors.color,
      contrastText: usdbLightColors.invertedColor,
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
          color: usdbLightColors.color,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          '&.paperButton': {
            color: '#FFF',
            backgroundColor: '#000',
          },
          '&.menuButton': {
            border: '1px solid #000',
          },
        },
        outlined: {
          '&, &:hover': {
            border: '3px solid #000'
          }
        },
        contained: {
          '&.closeButton': {
            color: usdbLightColors.color,
            background: usdbLightColors.iconButtonBg
          }
        }
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          color: usdbLightColors.color,
          "&.softGradient": {
            background: "linear-gradient(45deg, rgba(229,229,235,1) 15%, rgba(229,229,235,0.42) 90%)"
          }
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: `url(${lightBG})`,
        },
      },
    },
  },
};

// dark theme
const USDBDarkBase: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: usdbDarkColors.color,
      contrastText: usdbDarkColors.invertedColor,
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
  components: {
    MuiToolbar: {
      styleOverrides: {
        root: {
          color: usdbDarkColors.color,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          '&.paperButton': {
            color: '#FFF',
            backgroundColor: '#000',
          },
          '&.menuButton': {
            border: '1px solid #FFF',
          },
        },
        outlined: {
          '&, &:hover': {
            border: '3px solid #FFF'
          }
        },
        contained: {
          '&.closeButton': {
            color: usdbDarkColors.color,
            background: usdbDarkColors.iconButtonBg
          }
        }
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          color: usdbDarkColors.color,
          "&.softGradient": {
            background: "linear-gradient(45deg, rgba(8,9,10,1) 0%, rgba(8,9,10,0.62) 5%, rgba(14,15,16,1) 90%)"
          }
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: `url(${darkBG})`,
        },
      },
    },
  },
};

export const USDBLight = createTheme(globalTheme, USDBLightBase);
export const USDBDark = createTheme(globalTheme, USDBDarkBase);
