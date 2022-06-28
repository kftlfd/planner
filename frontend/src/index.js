import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.scss";
import { BrowserRouter } from "react-router-dom";
import ProvideAuth from "./AuthContext";
import ProvideProjects from "./ProjectsContext";

const root = ReactDOM.createRoot(document.querySelector("#root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ProvideAuth>
        <ProvideProjects>
          <App />
        </ProvideProjects>
      </ProvideAuth>
    </BrowserRouter>
  </React.StrictMode>
);
