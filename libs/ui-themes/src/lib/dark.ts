import { createTheme } from '@mui/material/styles';

const darkTheme = {
  color: "#FCFCFC",
  gold: "#F7C775",
  gray: "#E0E0E0",
  textHighlightColor: "#F7C775",
  backgroundColor: "rgba(60,67,78,1)",
  background: `
    linear-gradient(90deg, rgba(102,114,129,1), rgba(60,67,78,1));
    `,
  paperBg: "rgba(60,67,78,0.4)",
  modalBg: "#24242699",
  popoverBg: "rgba(60,67,78, 0.99)",
  menuBg: "#36384080",
  backdropBg: "rgba(60,67,78, 0.5)",
  largeTextColor: "#F7C775",
  activeLinkColor: "#F5DDB4",
  activeLinkSvgColor:
    "brightness(0) saturate(100%) invert(84%) sepia(49%) saturate(307%) hue-rotate(326deg) brightness(106%) contrast(92%)",
  primaryButtonColor: "#3C434E",
  primaryButtonBG: "#F7C775",
  primaryButtonHoverBG: "#CCA551",
  secondaryButtonHoverBG: "rgba(60,67,78, 1)",
  outlinedPrimaryButtonHoverBG: "#F7C775",
  outlinedPrimaryButtonHoverColor: "#3C434E",
  outlinedSecondaryButtonHoverBG: "transparent",
  outlinedSecondaryButtonHoverColor: "#F7C775", //gold
  containedSecondaryButtonHoverBG: "rgba(255, 255, 255, 0.15)",
  graphStrokeColor: "rgba(255, 255, 255, .1)",
};

export const dark = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: darkTheme.color,
    },
    secondary: {
      main: darkTheme.color,
    },
  },
});