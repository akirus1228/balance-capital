import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import tradFiGraphLight from '../../../../assets/images/trad-fi-graph.svg';
import tradFiGraphDark from '../../../../assets/images/trad-fi-graph-dark.svg';
import { HTMLAttributes } from "react";

/* eslint-disable-next-line */
export interface LogoProps {
  style?: HTMLAttributes<HTMLDivElement>
}

export const Graph = (props: LogoProps): JSX.Element => {
  const themeType = useSelector((state: RootState) => state.app.theme);

  return (
    <div style={{...props.style}}>
      <img src={themeType === 'light' ? tradFiGraphLight : tradFiGraphDark} alt="Graph showing APR for various investments"/>
    </div>
  );
}

export default Graph;
