// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BrowserRouter } from "react-router-dom";
import App from './app';
import { Web3ContextProvider } from '@fantohm/web3';
import { ThemeProvider } from '@mui/styles';
import { dark as darkTheme } from '@fantohm/ui-themes';
import store from "./store";
import { Provider } from "react-redux";

const Root = (): JSX.Element => {
    return (
        <Web3ContextProvider>
          <Provider store={store}>
            <BrowserRouter>
              <ThemeProvider theme={darkTheme}>
                <App />
              </ThemeProvider>
            </BrowserRouter>
          </Provider>
        </Web3ContextProvider>
      );
}

export default Root;