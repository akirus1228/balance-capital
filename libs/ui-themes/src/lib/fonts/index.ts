//import MontserratWOFF from './montserrat-regular.woff';

const Montserrat = {
    fontFamily: "Montserrat",
    fontStyle: "normal",
    fontDisplay: "swap",
    fontWeight: 400,
    src: `
          local('montserrat-regular'),
          local('montserrat-regular'),
          url('./montserrat-regular.woff') format('woff')
      `,
    unicodeRange:
      "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF",
  };
  
  const MontserratLight = {
    fontFamily: "Montserrat",
    fontStyle: "normal",
    fontDisplay: "swap",
    fontWeight: 300,
    src: `
          local('montserrat-light'),
          local('montserrat-light'),
          url('./montserrat-light.woff') format('woff')
      `,
    unicodeRange:
      "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF",
  };
  
  const MontserratMedium = {
    fontFamily: "Montserrat",
    fontStyle: "normal",
    fontDisplay: "swap",
    fontWeight: 400,
    src: `
          local('montserrat-regular'),
          local('montserrat-regular'),
          url('./montserrat-regular.woff') format('woff')
      `,
    unicodeRange:
      "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF",
  };
  
  const MontserratSemiBold = {
    fontFamily: "Montserrat",
    fontStyle: "normal",
    fontDisplay: "swap",
    fontWeight: 900,
    src: `
          local('montserrat-black'),
          local('montserrat-black'),
          url('./montserrat-black.woff') format('woff')
      `,
    unicodeRange:
      "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF",
  };
  
  const MontserratBold = {
    fontFamily: "Montserrat",
    fontStyle: "bold",
    fontDisplay: "swap",
    fontWeight: 900,
    src: `
          local('montserrat-black'),
          local('montserrat-black'),
          url('./montserrat-black.woff') format('woff')
      `,
    unicodeRange:
      "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF",
  };
  
  const MontserratItalic = {
    fontFamily: "Montserrat",
    fontStyle: "normal",
    fontDisplay: "swap",
    fontWeight: 400,
    src: `
          local('montserrat-regular'),
          local('montserrat-regular'),
          url('./montserrat-regular.woff') format('woff')
      `,
    unicodeRange:
      "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF",
  };
  
  const fonts = [Montserrat, MontserratLight, MontserratMedium, MontserratBold, MontserratItalic];
  
  export default fonts;