import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { Provider as ProvideStore } from "react-redux";
import { store } from "./store/store";

import ProvideTheme from "./context/ThemeContext";
import ProvideAuth from "./context/AuthContext";
import ProvideActions from "./context/ActionsContext";
import App from "./App";

import "./index.scss";

const root = ReactDOM.createRoot(document.querySelector("#root"));
root.render(
  <React.StrictMode>
    <ProvideTheme>
      <ProvideAuth>
        <ProvideStore store={store}>
          <ProvideActions>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ProvideActions>
        </ProvideStore>
      </ProvideAuth>
    </ProvideTheme>
  </React.StrictMode>
);
