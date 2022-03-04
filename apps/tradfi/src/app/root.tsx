// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.scss';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import App from './app';
import { Web3ContextProvider } from '@fantohm/web3';

const Root = (): JSX.Element => {
    return (
        <Web3ContextProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Web3ContextProvider>
      );
}

export default Root;