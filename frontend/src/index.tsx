import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider as ProvideStore } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import ProvideActions from "~/context/ActionsContext";
import BaseStyles from "~/context/BaseStyles";
import ProvideTheme from "~/context/ThemeContext";
import { CookieError } from "~/pages/Error";
import store from "~/store";

import App from "./App";

const cookiesDisabled = !navigator.cookieEnabled;

const rootEl = document.querySelector("#root");

if (!rootEl) {
  throw new Error("Root element not found");
}

const root = createRoot(rootEl);

root.render(
  cookiesDisabled ? (
    <CookieError />
  ) : (
    <StrictMode>
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
    </StrictMode>
  ),
);
