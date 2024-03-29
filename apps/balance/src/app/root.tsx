// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import { Web3ContextProvider } from "@fantohm/shared-web3";
import { App } from "./app";
import store from "./store";

const Root = (): JSX.Element => {
  return (
    <Web3ContextProvider>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </Web3ContextProvider>
  );
};

export default Root;
