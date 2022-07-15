import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { Provider } from "react-redux";
import { store } from "./store/store";

import App from "./App";
import ProvideAuth from "./context/AuthContext";

import "./index.scss";

const root = ReactDOM.createRoot(document.querySelector("#root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ProvideAuth>
          <App />
        </ProvideAuth>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
