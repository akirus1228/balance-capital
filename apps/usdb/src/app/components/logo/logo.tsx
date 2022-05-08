import { useSelector } from "react-redux";
import { RootState } from "../../store";
import USDBLogoLight from "../../../assets/images/USDB-logo.svg";
import USDBLogoDark from "../../../assets/images/USDB-logo-dark.svg";
import { CSSProperties } from "react";

/* eslint-disable-next-line */
export interface LogoProps {
  style?: CSSProperties;
}

export function Logo(props: LogoProps) {
  const themeType = useSelector((state: RootState) => state.app.theme);

  return (
    <div style={{ ...props.style }}>
      <img src={themeType === "light" ? USDBLogoLight : USDBLogoDark} alt="BUSD Logo" />
    </div>
  );
}

export default Logo;
