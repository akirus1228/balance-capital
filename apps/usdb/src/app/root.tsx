// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/system';
import { Web3ContextProvider } from '@fantohm/shared-web3';
import { USDBLight, USDBDark } from '@fantohm/shared-ui-themes';
import App from './app';
import store from './store';

const Root = (): JSX.Element => {
  return (
    <Web3ContextProvider>
      <Provider store={store}>
        <BrowserRouter> 
          <ThemeProvider theme={USDBLight}>
            <App />
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    </Web3ContextProvider>
  );
};

export default Root;
