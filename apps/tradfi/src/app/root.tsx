// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.scss';
import { BrowserRouter } from "react-router-dom";
import App from './app';
import { Web3ContextProvider } from '@fantohm/web3';
import { ThemeProvider } from '@mui/styles';
import { dark as darkTheme } from '@fantohm/ui-themes';

const Root = (): JSX.Element => {
    return (
        <Web3ContextProvider>
          <BrowserRouter>
            <ThemeProvider theme={darkTheme}>
              <App />
            </ThemeProvider>
          </BrowserRouter>
        </Web3ContextProvider>
      );
}

export default Root;