import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import { Web3ContextProvider } from '@fantohm/web3';

import store from './app/store';
import App from './app/app';

ReactDOM.render(
  <StrictMode>
      <Web3ContextProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </Web3ContextProvider>
  </StrictMode>,
  document.getElementById('root')
);
