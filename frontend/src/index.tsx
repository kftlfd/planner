import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { Provider as ProvideStore } from "react-redux";
import { store } from "app/store/store";

import ProvideTheme from "app/context/ThemeContext";
import ProvideActions from "app/context/ActionsContext";
import App from "app/App";
import { CookieError } from "app/pages/Error";

import "app/index.scss";

let cookiesDisabled = !navigator.cookieEnabled;

const root = ReactDOM.createRoot(document.querySelector("#root")!);
root.render(
  cookiesDisabled ? (
    <CookieError />
  ) : (
    // <React.StrictMode>
    <ProvideStore store={store}>
      <ProvideTheme>
        <ProvideActions>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ProvideActions>
      </ProvideTheme>
    </ProvideStore>
    // </React.StrictMode>
  )
);
