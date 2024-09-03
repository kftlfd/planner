import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { Provider as ProvideStore } from "react-redux";
import { store } from "app/store/store";

import ProvideTheme from "app/context/ThemeContext";
import BaseStyles from "app/context/BaseStyles";
import ProvideActions from "app/context/ActionsContext";
import App from "app/App";
import { CookieError } from "app/pages/Error";

const cookiesDisabled = !navigator.cookieEnabled;

const rootEl = document.querySelector("#root");

if (!rootEl) {
  throw new Error("Root element not found");
}

const root = ReactDOM.createRoot(rootEl);

root.render(
  cookiesDisabled ? (
    <CookieError />
  ) : (
    <React.StrictMode>
      <ProvideStore store={store}>
        <ProvideTheme>
          <ProvideActions>
            <BaseStyles />
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ProvideActions>
        </ProvideTheme>
      </ProvideStore>
    </React.StrictMode>
  ),
);
