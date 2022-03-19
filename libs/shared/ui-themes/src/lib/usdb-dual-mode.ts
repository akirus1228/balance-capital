import { createTheme } from '@mui/material/styles';
import { ThemeOptions } from '@mui/material';
import lightBG from './images/USDB_gradient_light.png';
import darkBG from './images/USDB_gradient_dark.png';

// light color pallet for use in themes
const usdbLightColors = {
  color: '#000',
  invertedColor: '#FFF',
  backgroundColor: '#ECECF4',
  paperBg: '#FFF',
  gray: '#696C80',
};

// dark color pallet for use in themes
const usdbDarkColors = {
  color: '#FFF',
  invertedColor: '#000',
  backgroundColor: '#000',
  paperBg: '#0E0F10',
  gray: '#929BA0',
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
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '53px',
          padding: '2.5em',
          '&.MuiAppBar-root': {
            padding: '0',
            marginTop: '2em'
          }
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
        root: {
          borderRadius: '30px',
          padding: '27px',
          fontSize: '20px',
          textTransform: 'capitalize',
          "&.paperButton": {
            width: '100%',
            padding: '1em',
          },
          "&.menuButton": {
            height: '1em',
            paddingTop: '1.8em',
            paddingBottom: '1.8em',
            borderRadius: '1.5em',
            margin: 'auto 1em'
          }
        },
        outlined: {
          borderRadius: '30px',
          padding: '27px',
          fontSize: '20px',
        },
      },
      defaultProps: {
        autoCapitalize: 'none',
      }
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundPosition: "top",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed"
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
          color: usdbLightColors.color
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          "&.paperButton": {
            color: '#FFF',
            backgroundColor: '#000',
          },
          "&.menuButton": {
            border: '1px solid #000',
          }
        },
        outlined: {
          border: '3px solid #000',
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          color: usdbLightColors.color,
        }
      }
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: `url(${lightBG})`,
        }
      }
    }
  }
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
          color: usdbDarkColors.color
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          "&.paperButton": {
            color: '#FFF',
            backgroundColor: '#000',
          },
          "&.menuButton": {
            border: '1px solid #FFF',
          }
        },
        outlined: {
          border: '3px solid #FFF',
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          color: usdbDarkColors.color,
        }
      }
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: `url(${darkBG})`,
        }
      }
    }
  }
};


export const USDBLight = createTheme(globalTheme, USDBLightBase);
export const USDBDark = createTheme(globalTheme, USDBDarkBase);