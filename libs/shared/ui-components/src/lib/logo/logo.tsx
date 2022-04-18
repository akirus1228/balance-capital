import { useSelector } from "react-redux";
import { LightUSDBLogo, DarkUSDBLogo } from "@fantohm/shared/images";
import { HTMLAttributes } from "react";
import { EnhancedStore } from "@reduxjs/toolkit";

/* eslint-disable-next-line */
export interface LogoProps {
  store: EnhancedStore<any>;
  style?: HTMLAttributes<HTMLDivElement>;
  className?: string | undefined;
}

export function Logo(props: LogoProps) {
  type RootState = ReturnType<typeof props.store.getState>;
  const themeType = useSelector((state: RootState) => state.app.theme);

  return (
    <div style={{ ...props.style }}>
      <img
        src={themeType === "light" ? LightUSDBLogo : DarkUSDBLogo}
        alt="BUSD Logo"
        className={props.className}
      />
    </div>
  );
}

export default Logo;
